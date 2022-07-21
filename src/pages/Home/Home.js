import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import 'antd/dist/antd.css';
import "./Home.css";
import PlantSearch from "../../components/PlantSearch/PlantSearch";
import { Space, Card, Spin, List, Typography, Divider, Button, Row, Col } from 'antd';
import { CameraOutlined } from '@ant-design/icons'
import * as Parser from 'rss-parser';
const axios = require('axios');
const { Title, Text } = Typography;

function Home() {

  const history = useHistory();
  const [gardenData, setGardenData] = useState([]);
  const [gardenPreviewComponents, setGardenPreviewComponents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rssComponents, setRssComponents] = useState([]);

  useEffect(() => {

    //make sure the user is logged in.
    checkUser();

    //useEffect cannot be async so I have declared a function and called it inside useEffect. This is OK.
    async function getGardenData() {
      //Get this users garden data
      await axios.get("/api/garden/get")
        .then(response => {
          setGardenData(response.data) //set the garden data, it will re render on next update
        })
    }

    getGardenData();

  }, [])

  //when gardenData updates on next render, create a list of plants in their garden. These will be mapped to components later.
  useEffect(() => {
    //useEffect cannot be async so I have declared a function and called it inside useEffect. This is OK.
    async function getGardenPreviewComponents() {
      let plantList = [];
      let currentItem = [];

      //create a list of plants
      for (var i = 0; i < gardenData.length; i++) {
        currentItem = await axios.get(`/api/plants/${gardenData[i].PlantID}`);
        plantList.push(currentItem.data[0])
      }

      let components = [];

      //map the plants to components
      components = plantList.map(x =>
        <List.Item key={x.PlantID}>
          <Typography.Text><Button type="dashed" onClick={() => goToPlant(x.PlantID)} style={{ backgroundColor: "#f5e8cb" }}>
            {x.CommonName}</Button></Typography.Text>
        </List.Item>)
      setGardenPreviewComponents(components); //these will render on next update
    }
    getGardenPreviewComponents();
  }, [gardenData])

  //when gardenPreviewComponents have rendered, load the RSS feed.
  useEffect(() => {

    async function getRssComponents() {
      //RSS FEED CODE
      let parser = new Parser() //create a parser
      let tempComponents = [];

      //parse the url to get the feed object
      await parser.parseURL("https://bailym-cors-anywhere.herokuapp.com/https://www.finegardening.com/feed")
        .then(function (response) {
          //map the feed entries to components
          tempComponents = response.items.map((x) =>
            <div key={x.guid}>
              <Divider />
              <Title>{x.title}</Title>
              <div> {x.content}</div>
              <a href={x.link}>Read More</a><br />
              <Text style={{ fontWeight: "bold" }}>{x.creator + " "}</Text>
              <Text>{x.pubDate.slice(0, -15)}</Text>
            </div>)
        })
      setRssComponents(tempComponents);
    }

    getRssComponents();
  }, [gardenPreviewComponents])

  //when rsscomponents have rendered we can stop loading.
  useEffect(() => {
    setLoading(false)
  }, [rssComponents])

  function goToPlant(value) {
    history.push({
      pathname: '/plant',
      state: { PlantID: value }
    })
  };

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
        //if a user is logged in
        else {
          // Check the user Type (Admin/Standard) to see which home page to show
          await axios.get('/api/usertype')
            .then(response => {
              if (response.data === "Admin") {
                history.push("/admin") //Redirect to admin page
              }
            })
        }
      })
  }

  return (
    <Spin id="spin-container" spinning={loading}>
      <PlantSearch id="search"  />
      <div id="home-row">
        <div className="home-col" >
          <Card title="My Garden">
            <List>
              {gardenPreviewComponents}
            </List>
          </Card>
        </div>
        <div className="home-col">
          <Card title="Identify Plants">
            <CameraOutlined id="camera-img" style={{ fontSize: "100px" }} onClick={() => { history.push("/upload") }} />
          </Card>
        </div>
        <div className="home-col">
          <Card title="News">
            <div id="rssDiv">
              <Text id="rssText">{rssComponents[0] ? "FineGardening.com" : "Could not load RSS feed"}</Text>
              {rssComponents}
            </div>
          </Card>
        </div>
      </div>
    </Spin>)
}
export default Home;
