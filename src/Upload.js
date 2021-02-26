import React from 'react';
import 'antd/dist/antd.css';
import PlantSearch from "./components/PlantSearch"
import { Space, Card, Tabs, Descriptions, Image as AntdImage, message, List, Spin, Typography, Upload, } from 'antd';
import ReactDOM from "react-dom"
import { BrowserRouter as Router, Link } from 'react-router-dom';
import { UploadOutlined, LoadingOutlined, PlusOutlined } from '@ant-design/icons'
import MediaQuery from 'react-responsive'
import * as tf from '@tensorflow/tfjs'
const axios = require('axios');
const knnClassifier = require('@tensorflow-models/knn-classifier');
const mobilenet = require('@tensorflow-models/mobilenet');
const { Title, Paragraph, Text } = Typography;
const { TabPane } = Tabs;
var classNames = require("./classes.json")

class UploadImage extends React.Component {

  state = {
    uploadedImage: null,
    net: null,
    classifier: null,
    confidences: null,
    results: null,
    loading: true,
  };

  componentDidMount = async () => {
    // Load the mobilenet model and create our classifer

    var netInit = await mobilenet.load();
    var classifierInit = knnClassifier.create();

    this.setState({
      net: netInit,
      classifier: classifierInit,

    })

    await this.load();
  }

  load = async () => {

    var tempClassifier = this.state.classifier;
    //can be change to other source
    await axios.get('/api/getmodel')
      .then(function (response) {
        let tensorObj = response.data
        //covert back to tensor
        Object.keys(tensorObj).forEach((key) => {
          tensorObj[key] = tf.tensor(tensorObj[key], [tensorObj[key].length / 1024, 1024])
        })
        tempClassifier.setClassifierDataset(tensorObj);
      })
      .catch(function (error) {
        console.log(error)
      })

    this.setState({
      classifier: tempClassifier,
      loading: false
    })
  }

  goToPlant = value => {
    this.props.history.push({
      pathname: '/plant',
      state: { PlantID: value }
    })
    window.location.reload();
  };

  classifyImage = async (img) => {

    var a = tf.browser.fromPixels(img)
    if (this.state.classifier.getNumClasses() > 0) {
      // Get the activation from mobilenet from the uploaded image.
      let activation = await this.state.net.infer(a, 'conv_preds');

      // Get the most likely class and confidence from the classifier module.
      let result = await this.state.classifier.predictClass(activation);

      let label = ""; //the label (name) of the plant
      let confidences = [];   //a list of confidences and assosciated class ids and names
      let modelPredictions = Object.values(result.confidences)    //the raw confidences supplied by the model

      //create keys for key details readability
      confidences.details = []
      confidences["File Name"] = img.id;
      confidences.tensor = a;

      //Iterate through the confidences for each class (all classes are included here even if the confidence is 0)
      for (let i = 0; i < modelPredictions.length; i++) {
        //iterate through the list of classes (classes.JSON, this is so the Common Name can be mapped to a ClassID)
        for (var j = 0; j < classNames.length; j++) {
          //match each class ID to a Common Name (string)
          if (classNames[j].ClassID === i) {
            label = classNames[j].Name;
          }
        }

        //get the Plant ID from the database (different to the classifiers classid)
        var plantID = null
        var plantImages = []
        //we only want to display results where the confidence is not 0
        if (modelPredictions[i] != 0) {
          await axios.get(`/api/plants/getid/${label}`)
            .then(function (response) {
              plantID = response.data[0].PlantID
            })
            .catch(function (error) {
              message.error("Unknown Error...")
            })

          //it is also worth getting a url to the images of the plant in the database
          await axios.get(`/api/plant/images/${plantID}`)
            .then(response => {
              plantImages = response.data
            })
            .catch(function (error) {
              console.log("Error getting plant images...")
            })

          console.log(plantImages)

          //add an entry to the details object which contains the complete details of the predicition. 
          confidences.details.push({ "ClassID": i, "PlantID": plantID, "Name": label, "Confidence": modelPredictions[i] * 100, "dbImages": plantImages })

          //sort details in desc order by confidence
          confidences.details.sort(function (a, b) {
            var keyA = a.Confidence,
              keyB = b.Confidence;
            // Compare the 2 dates
            if (keyA < keyB) return 1;
            if (keyA > keyB) return -1;
            return 0;
          });

          //add the important details as keys [0] is the first entry with the most confidence since the list was sorted above.
          confidences["Prediction"] = confidences.details[0].Name
          confidences["Confidence"] = confidences.details[0].Confidence
        }
      }
      var results = []

      console.log(confidences)
      results = await Promise.all(confidences.details.map(async (x) =>
        <TabPane tab={x.Name} key={x.ClassID}>
          <Card>
            <Typography.Text><a onClick={() => this.goToPlant(x.PlantID)}>{x.Name}</a></Typography.Text>
            {await this.getPlantImages(x.PlantID)}
          </Card>
        </TabPane>
      ))

      this.setState({
        confidences: confidences,
        results: results,
        uploadedImage: null,
      })
    }
  }

  getPlantImages = async (plantID) => {
    var imageComponents = []
    var imageURLs = []
    await axios.get(`/api/plant/images/${plantID}`)
      .then(response => {
        imageURLs = response.data
      })

    imageComponents = imageURLs.map(x =>
      <div key={x.ImagePath}  >
        <AntdImage key={x.ImagePath} style={{
          border: "1px solid #000", width: "auto",
          height: "auto",
          maxWidth: "250px",
          maxHeight: "250px",
          display: "block",
          margin: "auto",
        }} src={"/images/" + x.ImagePath} />
      </div>)

    console.log(imageComponents)
    return imageComponents
  }

  //reads a file URL and returns the image 
  getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }

  //ALWAYS RETURN FALSE, THIS STOPS THE UPLOAD FROM ATTEMPTING TO CONTACT THE SERVER
  beforeUpload = (file) => {
    this.setState({
      loading: true
    })
    return false;
  }

  //handles when a new image is uploaded
  handleChange = async (info) => {
    var listLength = info.fileList.length - 1
    //Upload the image anc check it is valid
    const isJpgOrPng = info.file.type === 'image/jpeg' || info.file.type === 'image/png';
    const isLt20M = info.file.size / 1024 / 1024 < 20;
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
      this.setState({
        uploadedImage: null
      })
    }
    //if the image is too big
    else if (!isLt20M) {
      message.error('Image must smaller than 20MB!');
      this.setState({
        uploadedImage: null
      })
    }
    //if it is valid save it to state
    else {
      // Get this url from response in real world.
      this.getBase64(info.fileList[listLength].originFileObj, imageUrl =>
        this.setState({
          imageUrl,
          uploadedImage: info.fileList[listLength]
        }, () => {
          let im = new Image()    //create an Image
          im.src = this.state.imageUrl    //update the image source
          im.id = this.state.uploadedImage.name    //update the image name

          //runs each time an image is loaded
          im.onload = async () => {
            this.setState({
              loading: false
            })

            //IMPORTANT: CALLING THIS FUNCTION TWICE MAKES IT WORK ON IOS. NO IDEA WHY????????
            await this.classifyImage(im)
            await this.classifyImage(im)
          }
        }),
      );


    }
  }

  render() {
    const { loading, imageUrl } = this.state;
    const uploadButtonDesktop = (
      <div style={{ width: "30vmax", height: "30vmax", border: "1px solid #000", backgroundColor: "#d3ebe5" }}>
        <div style={{ fontSize: "50px", textAlign: "center", marginTop: "10vmax" }}>
          <PlusOutlined />
          <p>Upload</p>
        </div>
      </div>
    );
    const uploadButtonTablet = (
      <div style={{ width: "30vmax", height: "30vmax", border: "1px solid #000", backgroundColor: "#d3ebe5" }}>
        <div style={{ fontSize: "50px", textAlign: "center", marginTop: "8vmax" }}>
          <PlusOutlined />
          <p>Upload</p>
        </div>
      </div>
    );
    const uploadButtonMobile = (
      <div style={{ width: "88vmin", height: "88vmin", border: "1px solid #000", backgroundColor: "#d3ebe5" }}>
        <div style={{ fontSize: "50px", textAlign: "center", marginTop: "20vmin" }}>
          <PlusOutlined />
          <p>Upload</p>
        </div>
      </div>
    );
    return (

      <div>
        <MediaQuery minDeviceWidth={1025}>
          <Card title="Upload Image">
            <Spin spinning={this.state.loading}>
              <Upload id="uploadControl"
                showUploadList={false}
                beforeUpload={this.beforeUpload}
                onChange={this.handleChange}
                disabled={this.state.loading}>
                {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '30vmax', height: "30vmax", border: "1px solid #000", float: "left" }} /> : uploadButtonDesktop}
              </Upload>
              <div style={{ float: "right", marginRight: "35vmax" }}>
                {this.state.confidences ?
                  <div>
                    <Title>Results</Title>
                    <Tabs style={{ width: "30vmax", overflow: "auto" }}>
                      {this.state.results}
                    </Tabs>
                  </div> : ""}
              </div>
            </Spin>
          </Card>
        </MediaQuery>

        <MediaQuery minDeviceWidth={641} maxDeviceWidth={1024}>
          <Card title="Upload Image">
            <Spin spinning={this.state.loading}>
              <Upload id="uploadControl"
                showUploadList={false}
                beforeUpload={this.beforeUpload}
                onChange={this.handleChange}
                disabled={this.state.loading}>
                {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '30vmax', height: "30vmax", border: "1px solid #000", float: "left" }} /> : uploadButtonTablet}
              </Upload>
              <div style={{ float: "right", marginRight: "35%" }}>
                {this.state.confidences ?
                  <div>
                    <Title>Results</Title>
                    {this.state.results}
                  </div> : ""}
              </div>
            </Spin>
          </Card>
        </MediaQuery>

        <MediaQuery maxDeviceWidth={640}>
          <Card title="Upload Image">
            <Spin spinning={this.state.loading}>
              <Upload id="uploadControl"
                showUploadList={false}
                beforeUpload={this.beforeUpload}
                onChange={this.handleChange}
                disabled={this.state.loading}>
                {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: "88vmin", height: "88vmin", border: "1px solid #000" }} /> : uploadButtonMobile}
              </Upload>
              <div>
                {this.state.confidences ?
                  <div style={{ textAlign: "center" }}>
                    <Title>Results</Title>
                    {this.state.results}
                  </div> : ""}
              </div>
            </Spin>
          </Card>
        </MediaQuery>
      </div>
    );
  }
}


export default UploadImage;
