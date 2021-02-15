import React from 'react';
import 'antd/dist/antd.css';
import PlantSearch from "./components/PlantSearch"
import { Space, Card, Carousel, Image, Descriptions, Button, message, Tabs, List, Typography, Upload } from 'antd';
import ReactDOM from "react-dom"
import { BrowserRouter as Router, Link } from 'react-router-dom';
import { UploadOutlined, LoadingOutlined, PlusOutlined } from '@ant-design/icons'
import MediaQuery from 'react-responsive'
import * as tf from '@tensorflow/tfjs'
const axios = require('axios');
const knnClassifier = require('@tensorflow-models/knn-classifier');
const mobilenet = require('@tensorflow-models/mobilenet');

class UploadImage extends React.Component {

  state = {
    loading: false,
    uploadedImage: null,
    net: null,
    classifier: null,
    imgTensor: null,
  };

  componentDidMount = async() => {

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
}

  getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }
  beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
  }

  handleChange = info => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      this.getBase64(info.file.originFileObj, imageUrl =>
        this.setState({
          imageUrl,
          loading: false,
        }),
      );
    }
  };

  render() {
    const { loading, imageUrl } = this.state;
    const uploadButton = (
      <div>
        {loading ? <LoadingOutlined /> : <PlusOutlined />}
        <div style={{ marginTop: 8 }}>Upload</div>
      </div>
    );
    return (
      <Upload
        name="avatar"
        listType="picture-card"
        className="avatar-uploader"
        showUploadList={false}
        action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
        beforeUpload={this.beforeUpload}
        onChange={this.handleChange}
      >
        {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
      </Upload>
    );
  }
}


export default UploadImage;
