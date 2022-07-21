import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import './app.css';
import 'antd/dist/antd.css';
import "./Home.css";
import PlantSearch from "../../components/PlantSearch"
import { Space, Card, Spin, List, Typography, Divider, Button } from 'antd';
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
          <Typography.Text><Button type="dashed" onClick={() => this.goToPlant(x.PlantID)} style={{ backgroundColor: "#f5e8cb" }}>
            {x.CommonName}</Button></Typography.Text>
        </List.Item>)
      setGardenPreviewComponents(components); //these will render on next update
    }
    getGardenPreviewComponents();
  }, [gardenData])

  //when gardenpreviewcomponents have rendered re can stop loading.
  useEffect(() => {
    setLoading(false)
  }, [gardenPreviewComponents])

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
    <Spin spinning={loading}>
      <PlantSearch style={{ width: "100%", textAlign: "center", textAlignLast: "center" }} />
      <Space direction="vertical" style={{ width: "31vw", overflowY: "auto" }}>
        <Card title="My Garden" headStyle={{ backgroundImage: "url(woodtexture.png)" }} bodyStyle={{ backgroundColor: "#fcf4e1" }}>
          <List>
            {gardenPreviewComponents}
          </List>
        </Card>
      </Space>
      <Space direction="vertical" style={{ width: "31vw", overflowY: "auto", margin: "1vw" }}>
        <Card title="Identify Plants" style={{ textAlign: "center" }} headStyle={{ backgroundImage: "url(woodtexture.png)" }} bodyStyle={{ backgroundColor: "#fcf4e1" }}>
          <CameraOutlined style={{ fontSize: "100px" }} onClick={() => { history.push("/upload") }} />
        </Card>
      </Space>
      <Space direction="vertical" className="hideScroll" style={{ width: "31vw", maxHeight: "70vh" }}>
        <Card title="News" style={{ textAlign: "center" }} headStyle={{ backgroundImage: "url(woodtexture.png)" }} bodyStyle={{ backgroundColor: "#fcf4e1" }}>
          <div id="rssDiv">
            <Text id="rssText"></Text>
            {/*rssComponents*/}
          </div>
        </Card>
      </Space>
    </Spin>)
}

/* //RSS FEED CODE
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
this.setState(tempState) */


export default Home;
