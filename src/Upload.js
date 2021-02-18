import React from 'react';
import 'antd/dist/antd.css';
import PlantSearch from "./components/PlantSearch"
import { Space, Card, Carousel, Descriptions, Button, message, Tabs, Spin, Typography, Upload } from 'antd';
import ReactDOM from "react-dom"
import { BrowserRouter as Router, Link } from 'react-router-dom';
import { UploadOutlined, LoadingOutlined, PlusOutlined } from '@ant-design/icons'
import MediaQuery from 'react-responsive'
import * as tf from '@tensorflow/tfjs'
const axios = require('axios');
const knnClassifier = require('@tensorflow-models/knn-classifier');
const mobilenet = require('@tensorflow-models/mobilenet');
const { Title, Paragraph, Text } = Typography;
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

    this.load();
  }

  load = async () => {

    var tempClassifier = this.state.classifier;
    //can be change to other source
    await axios.get('/api/getmodel')
      .then(function (response) {
        try {
          let tensorObj = response.data
          //covert back to tensor
          Object.keys(tensorObj).forEach((key) => {
            tensorObj[key] = tf.tensor(tensorObj[key], [tensorObj[key].length / 1024, 1024])
          })
          tempClassifier.setClassifierDataset(tensorObj);
        }
        catch (error) {
          console.log(error)

        }
      })
      .catch(function (error) {
        console.log(error);
      });

    this.setState({
      classifier: tempClassifier,
    })

    console.log("Model loaded!")
    this.setState({
      loading: false
    })
  }

  classifyImage = async (img) => {

    var a = tf.browser.fromPixels(img)
    if (this.state.classifier.getNumClasses() > 0) {
      // Get the activation from mobilenet from the uploaded image.
      let activation = this.state.net.infer(a, 'conv_preds');
      // Get the most likely class and confidence from the classifier module.
      let result = await this.state.classifier.predictClass(activation);

      let label = ""; //the label (name) of the plant
      let confidences = [];   //a list of confidences and assosciated class ids and names
      let modelPredictions = Object.values(result.confidences)    //the raw confidences supplied by the model

      //create keys for key details readability
      confidences.details = []
      confidences["File Name"] = img.id;
      confidences.tensor = a;

      //create a list of confidences with names and ids
      for (let i = 0; i < modelPredictions.length; i++) {
        //iterate through the list of classes
        for (var j = 0; j < classNames.length; j++) {
          //match each class ID to a plant name (string)
          if (classNames[j].ClassID === i) {
            label = classNames[j].Name;
          }
        }

        //add the full details
        confidences.details.push({ "ClassID": i, "Name": label, "Confidence": modelPredictions[i] * 100 })

        //sort details in desc order by confidence
        confidences.details.sort(function (a, b) {
          var keyA = a.Confidence,
            keyB = b.Confidence;
          // Compare the 2 dates
          if (keyA < keyB) return 1;
          if (keyA > keyB) return -1;
          return 0;
        });

        //add the important details as keys
        confidences["Prediction"] = confidences.details[0].Name
        confidences["Confidence"] = confidences.details[0].Confidence
      }

      console.log(confidences)


      var results = []

      //add any results with some confidence to a list to be rendered
      for (var i = 0; i < confidences.details.length; i++) {
        if (confidences.details[i].Confidence != 0) {
          results.push(<p id={confidences.details[i].ClassID}>{confidences.details[i].Name}</p>)
        }
      }

      this.setState({
        confidences: confidences,
        results: results
      })
    }
  }

  //reads a file URL and returns the image 
  getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }

  //ALWAYS RETURN FALSE, THIS STOPS THE UPLOAD FROM ATTEMPTING TO CONTACT THE SERVER
  beforeUpload = (file) => {
    return false;
  }

  //handles when a new image is uploaded
  handleChange = async (info) => {
    var listLength = info.fileList.length - 1
    //Upload the image anc check it is valid
    const isJpgOrPng = info.file.type === 'image/jpeg' || info.file.type === 'image/png';
    const isLt2M = info.file.size / 1024 / 1024 < 2;
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
      this.setState({
        uploadedImage: null
      })
    }
    //if the image is too big
    else if (!isLt2M) {
      message.error('Image must smaller than 5MB!');
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
            await this.classifyImage(im)
          }
        }),
      );


    }
  }

  render() {
    const { loading, imageUrl } = this.state;
    const uploadButton = (
      <div style={{ width: "300px", height: "300px", border: "1px solid #000", backgroundColor: "#d3ebe5" }}>
        <div style={{ fontSize: "50px", textAlign: "center", marginTop: "20%" }}>
          <PlusOutlined />
          <p>Upload</p>
        </div>
      </div>
    );
    return (
      <Card title="Upload Image">
        <Spin spinning ={this.state.loading}>
          <Upload id="uploadControl"
            showUploadList={false}
            beforeUpload={this.beforeUpload}
            onChange={this.handleChange}
            disabled={this.state.loading}>
            {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '300px', height: "300px", border: "1px solid #000", float: "left" }} /> : uploadButton}
          </Upload>
          <div style={{ float: "right", marginRight: "75%" }}>
            {this.state.confidences ?
              <div>
                <Title>Results</Title>
                {this.state.results}
              </div> : ""}
          </div>
        </Spin>
      </Card>
    );
  }
}


export default UploadImage;
