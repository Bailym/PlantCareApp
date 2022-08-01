import { useEffect, useState } from 'react';
import { Card, Tabs, Carousel, message, Spin, Typography, Button, Image as AntDImage } from 'antd';
import { useHistory } from 'react-router-dom';
import './Classify.css';
import * as tf from '@tensorflow/tfjs'
const axios = require('axios');
const knnClassifier = require('@tensorflow-models/knn-classifier');
const mobilenet = require('@tensorflow-models/mobilenet');
const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
var classNames = require("../../classes.json")

function Classify() {

  const [net, setNet] = useState(null);
  const [classifier, setClassifier] = useState(null);
  const [confidences, setConfidences] = useState(null);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const history = useHistory();
  const [selectedImage, setSelectedImage] = useState([]);

  /* 
      * Check that a user is logged in.
      * TRUE = Load the page
      * FALSE = Return to Login Page 
      */
  async function checkUser() {
    await axios.get('/api/checkuser')  //call the server endpoint
      .then(async response => {
        if (response.data === false) {   //if false redirect to login (you are not logged in.)
          history.push("/login");
        }
      })
  }

  //load the classifier on mount
  useEffect(() => {
    checkUser();

    async function loadClassifier() {
      await load();
    }
    loadClassifier();
  }, [])

  async function load() {
    // Load the mobilenet model and create our classifer
    var netInit = await mobilenet.load();
    var classifierInit = knnClassifier.create();

    //get the model from the server
    await axios.get('/api/getmodel')
      .then(function (response) {
        let tensorObj = response.data
        //covert back to tensor
        Object.keys(tensorObj).forEach((key) => {
          tensorObj[key] = tf.tensor(tensorObj[key], [tensorObj[key].length / 1024, 1024])
        })
        classifierInit.setClassifierDataset(tensorObj);
      })

    setNet(netInit);
    setClassifier(classifierInit);
    setLoading(false);
  }

  //redirect to a plant page.
  function goToPlant(value) {
    history.push({
      pathname: '/plant',
      state: { PlantID: value }
    })
  };

  async function classifyImage(img) {

    //create a tensor from the image
    var a = tf.browser.fromPixels(img)

    if (classifier.getNumClasses() > 0) {
      // Get the activation from mobilenet for the uploaded image.
      let activation = await net.infer(a, 'conv_preds');

      // Get the most likely class and confidence from the classifier module.
      let result = await classifier.predictClass(activation);

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
        if (modelPredictions[i] !== 0) {
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

      results = await Promise.all(confidences.details.map(async (x) =>
        <TabPane tab={x.Name} key={x.ClassID} className="results-tab-pane">
          <Text>{"Confidence: " + x.Confidence + "%"}</Text>
          <Button id="result-btn" onClick={() => goToPlant(x.PlantID)}>Go to plant</Button>
          <Carousel autoplay>
            {await getPlantImages(x.PlantID)}
          </Carousel>
        </TabPane>
      ))

      //update the state.
      setConfidences(confidences);
      setResults(results);
    }
  }

  //gets the field names from the server for this plants images.
  async function getPlantImages(plantID) {
    let tempComponents = [] //hold the components to be mapped.

    //get the image names and map them to <img> components.
    await axios.get(`/api/plant/images/${plantID}`)
      .then(response => {
        //create the image carousel components
        tempComponents = response.data.map((image) =>
          <AntDImage key={image.key} src={image.url} alt={image.key} />)
      })
    return tempComponents
  }

  //when a file is selected/deselected.
  function handleChange(e) {
    let imageFile = e.target.files[0]

    //if a file was chosen.
    if (imageFile) {
      let im = new Image()    //create an Image
      im.id = imageFile.name    //update the image name

      //read the URI (the file location on the client. No need to upload to the server)
      let reader = new FileReader();
      reader.onload = function (ev) {
        im.src = ev.target.result;
      }

      reader.readAsDataURL(e.target.files[0]);

      //runs each time an image is loaded
      im.onload = async () => {
        setSelectedImage(im) //update the selected image
        await classifyImage(im)
      }
    }
  }

  return (
    <Spin spinning={loading}>
      <form enctype="multipart/form-data" id="classify-form">
        <Title level={3}>About</Title>
        <Paragraph id="about-text">This tool uses transfer learning to add additional classes (plants) to an existing model (TF MobileNet). I have expanded the model and trained it to recognise specific plants.
          I have prioritised plants which I have easy access to, since I need 100+ of images of each plant for it to work effectively.
          For this reason this tool can reliably recognise a small range of plants and is being developed as a 'for fun' and a 'proof of concept' rather than a fully devleoped professional image classifier. </Paragraph>
        <Title level={3}>Upload Image</Title>
        <div id="upload-div">
          {selectedImage ? <img id="selected-image" src={selectedImage.src} alt={selectedImage.id} /> : null}
          <input type="file" required onChange={(e) => handleChange(e)} />
        </div>
        {confidences ?
          <div id="results-div">
            <Title level={3}>Results</Title>
            <Card id="result-card">
              <Tabs>
                {results}
              </Tabs>
            </Card>
          </div> : ""}
      </form>
    </Spin>
  );
}

export default Classify;
