import React from 'react';
import './app.css';
import 'antd/dist/antd.css';
import PlantSearch from "./components/PlantSearch"
import { Space, Card, Carousel, Image, Descriptions, Button, message, Spin, List, Typography, Divider } from 'antd';
import ReactDOM from "react-dom"
import { BrowserRouter as Router, Link } from 'react-router-dom';
import { CameraOutlined } from '@ant-design/icons'
import MediaQuery from 'react-responsive'
import * as Parser from 'rss-parser';
const axios = require('axios');
const { Title, Paragraph, Text } = Typography;

class Home extends React.Component {

  state = {
    gardenData: [],
    gardenPreviewComponents: [],
    loading: false,
    rssComponents: [],
  }

  render() {
    return (
      <Spin spinning={this.state.loading}>
          <MediaQuery minDeviceWidth={1025}>
            <div style={{margin: "1% auto", width: "95vw", height: "90vh"}}>
              <PlantSearch style={{ width: "100%", textAlign: "center", textAlignLast: "center" }} />
              <Space direction="vertical" style={{ width: "31vw", overflowY: "auto"}}>
                <Card title="My Garden" className="hideScroll" headStyle={{backgroundImage:"url(woodtexture.png)"}} bodyStyle={{backgroundColor:"#fcf4e1"}}>
                  <List>
                    {this.state.gardenPreviewComponents}
                  </List>
                </Card>
              </Space>
              <Space direction="vertical" style={{ width: "31vw", overflowY: "auto", margin: "1vw" }}>
                <Card title="Identify Plants" className="hideScroll" style={{ textAlign: "center" }} headStyle={{backgroundImage:"url(woodtexture.png)"}} bodyStyle={{backgroundColor:"#fcf4e1"}}>
                  <CameraOutlined style={{ fontSize: "100px" }} onClick={() => { this.props.history.push("/upload") }} />
                </Card>
              </Space>
              <Space direction="vertical" className="hideScroll" style={{ width: "31vw", maxHeight:"70vh"}}>
                <Card title="News" style={{ textAlign: "center" }} headStyle={{backgroundImage:"url(woodtexture.png)"}} bodyStyle={{backgroundColor:"#fcf4e1"}}>
                  <div id="rssDiv">
                    <Text id="rssText"></Text>
                    {this.state.rssComponents}
                  </div>
                </Card>
              </Space>
            </div>
          </MediaQuery>

          <MediaQuery minDeviceWidth={641} maxDeviceWidth={1024}>
            <div style={{ margin: "1% auto", width: "95vw", height: "90vh" }}>
              <PlantSearch style={{ width: "100%", textAlign: "center", textAlignLast: "center" }} />
              <Space direction="vertical" style={{ width: "31vw", overflowY: "auto" }}>
                <Card title="My Garden" headStyle={{backgroundImage:"url(woodtexture.png)"}} bodyStyle={{backgroundColor:"#fcf4e1"}}>
                  <List>
                    {this.state.gardenPreviewComponents}
                  </List>
                </Card>
              </Space>
              <Space direction="vertical" style={{ width: "31vw", overflowY: "auto", margin: "1vw" }}>
                <Card title="Identify Plants" style={{ textAlign: "center" }} headStyle={{backgroundImage:"url(woodtexture.png)"}} bodyStyle={{backgroundColor:"#fcf4e1"}}>
                  <CameraOutlined style={{ fontSize: "100px" }} onClick={() => { this.props.history.push("/upload") }} />
                </Card>
              </Space>
              <Space direction="vertical" style={{ width: "31vw", overflowY: "auto", maxHeight:"70vh" }}>
                <Card title="News" style={{ textAlign: "center" }} headStyle={{backgroundImage:"url(woodtexture.png)"}} bodyStyle={{backgroundColor:"#fcf4e1"}}>
                  <div id="rssDiv">
                    <Text id="rssText"></Text>
                    {this.state.rssComponents}
                  </div>
                </Card>
              </Space>
            </div>
          </MediaQuery>


          <MediaQuery maxDeviceWidth={640}>
            <div style={{ margin: "1% auto", width: "95vw", height: "90vh" }}>
              <PlantSearch style={{ width: "100%", textAlign: "center", textAlignLast: "center" }} />
              <Space direction="vertical" style={{ width: "100%"}}>
                <Card title="My Garden" headStyle={{backgroundImage:"url(woodtexture.png)"}} bodyStyle={{backgroundColor:"#fcf4e1"}}>
                  <List>
                    {this.state.gardenPreviewComponents}
                  </List>
                </Card>
                <Card title="Identify Plants" style={{ textAlign: "center" }} headStyle={{backgroundImage:"url(woodtexture.png)"}} bodyStyle={{backgroundColor:"#fcf4e1"}}>
                  <CameraOutlined style={{ fontSize: "100px" }} onClick={() => { this.props.history.push("/upload") }} />
                </Card>
                <Card title="News" style={{ textAlign: "center" }} headStyle={{backgroundImage:"url(woodtexture.png)"}} bodyStyle={{backgroundColor:"#fcf4e1"}}>
                  <div id="rssDiv">
                    <Text id="rssText"></Text>
                    {this.state.rssComponents}
                  </div>
                </Card>
              </Space>
            </div>

          </MediaQuery>
      </Spin>


    );
  }

  async componentDidMount() {

    this.setState({
      loading: true
    })

    /* 
    * Check that a user is logged in.
    * TRUE = Load the page
    * FALSE = Return to Login Page 
    */
    await axios.get('/api/checkuser')  //call the server endpoint
      .then(async response => {
        if (response.data === false) {   //if false redirect to login (you are not logged in.)
          this.props.history.push("/login");
          window.location.reload();
        }
        //if a user is logged in
        else {
          // Check the user Type (Admin/Standard) to see which home page to show
          await axios.get('/api/usertype')  //Make an API call to check the Type of the logged in User
            .then(response => {
              if (response.data == "Admin") {
                this.props.history.push("/admin") //Redirect to admin page
                window.location.reload();
              }

            })
            //Catch any errors
            .catch(function (error) {
              console.log(error);
            })

        }
      })
      .catch(function (error) {
        console.log(error);
      })


    let tempState = Object.assign({}, this.state)


    //Get this users garden data
    await axios.get("/api/garden/get")
      .then(response => {
        tempState.gardenData = response.data
      })


    let components = [];
    let currentItem = [];

    let plantList = [];


    //create a list of plants
    for (var i = 0; i < tempState.gardenData.length; i++) {
      currentItem = await axios.get(`/api/plants/${tempState.gardenData[i].PlantID}`);
      plantList.push(currentItem.data[0])
    }


    //map these plants to a list
    components = plantList.map(x =>
      <List.Item key={x.PlantID}>
        <Typography.Text><a onClick={() => this.goToPlant(x.PlantID)}>
          {x.CommonName}</a></Typography.Text>
      </List.Item>)

    tempState.gardenPreviewComponents = components;


    //RSS FEED CODE
    let parser = new Parser() //create a parser

    const CORS_PROXY = "https://bailymcorsserver.herokuapp.com/"

    //parse the url to get the feed object
    await parser.parseURL(CORS_PROXY + 'https://www.finegardening.com/feed')
      .then(function (response) {
        //map the feed entries to components
        tempState.rssComponents = response.items.map((x) =>
          <div key={x.guid}>
            <Divider />
            <Title>{x.title}</Title>
            <div dangerouslySetInnerHTML={{ __html: x.content }}></ div>
            <a href={x.link}>Read More</a><br />
            <Text style={{ fontWeight: "bold" }}>{x.creator + " "}</Text>
            <Text>{x.pubDate.slice(0, -15)}</Text>
          </div>)
        document.getElementById("rssText").innerHTML = "FineGardening.com"
      })
      .catch(function (error) {
        console.log("RSS Feed Could not be Loaded...")
        document.getElementById("rssText").innerHTML = "Could not load RSS feed..."
      });

    tempState.loading = false
    this.setState(tempState)


  }


  goToPlant = value => {
    this.props.history.push({
      pathname: '/plant',
      state: { PlantID: value }
    })
    window.location.reload();
  };


}


export default Home;
