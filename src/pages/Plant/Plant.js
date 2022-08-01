import { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import 'antd/dist/antd.css';
import "./Plant.css";
import PlantSearch from "../../components/PlantSearch/PlantSearch";
import { Space, Card, Carousel, Image, Descriptions, Button, message, Tabs, Spin } from 'antd';
const axios = require('axios');



function Plant() {

  const location = useLocation();
  const history = useHistory();
  const [plantID, setPlantID] = useState(location.state.PlantID);
  const [plantData, setPlantData] = useState([]);
  const [plantNames, setPlantNames] = useState([]);
  const [plantImages, setPlantImages] = useState([]);
  const [imageCarouselComponents, setImageCarouselComponents] = useState([]);
  const [keyDetailsComponents, setKeyDetailsComponents] = useState([]);
  const [conditionsComponents, setConditionsComponents] = useState([]);
  const [characteristicsComponents, setCharacteristicsComponents] = useState([]);
  const [usesComponents, setUsesComponents] = useState([]);
  const [nameComponents, setNameComponents] = useState([]);
  const [isInGarden, setIsInGarden] = useState(false);
  const [loading, setLoading] = useState(true);

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

  async function checkGarden(plantID) {
    let check = false;

    //check to see if the plant is already in the users garden
    await axios.get(`/api/garden/check/${plantID}`)
      .then(response => {
        console.log(response.data)
        if (response.data[0]) {
          check = true;
        }
      })

    setIsInGarden(check)
  }

  async function addToGarden() {

    await axios.post(`/api/garden/add/${plantID}`)
      .then(response => {
        setIsInGarden(true);
        message.info("Plant Added to Garden!")
      })
      .catch(error => {
        message.error("Plant could not be added...")
      })
  }

  async function removeFromGarden() {

    await axios.post(`/api/garden/delete/${plantID}`)
      .then(response => {
        setIsInGarden(false);
        message.info("Plant Removed from Garden!")
      })
      .catch(error => {
        message.error("Plant could not be removed...")
      })
  }


  //When component first mounts.
  useEffect(() => {

    //check a user is logged in.
    checkUser();
    //check if the plant is in their garden already.
    checkGarden(plantID)

    async function getData() {
      //make requests to get all of this plants data

      //data from the plant table
      await axios.get(`/api/plants/${plantID}`)
        .then(response => {
          setPlantData(response.data);
        })

      //data from the names table
      await axios.get(`/api/plants/names/${plantID}`)
        .then(response => {
          setPlantNames(response.data)
        })

      //data from the images table
      await axios.get(`/api/plant/images/${plantID}`)
        .then(response => {
          setPlantImages(response.data)
        })
    }


    getData();  //call the function to get the data.
  }, []);

  useEffect(()=>{
    console.log("isInGarden = " + isInGarden)
  },[isInGarden])

  //when the plant data has been retreieved, create the conponents to diplay.
  useEffect(() => {
    if (plantData.length > 0) {
      //Create components from the data
      setKeyDetailsComponents([
        <Descriptions.Item label="Common Name" key="CommonName" span={3}> {plantData[0].CommonName}</Descriptions.Item>,
        <Descriptions.Item label="Type" key="Type" span={3}> {plantData[0].Type}</Descriptions.Item>,
        <Descriptions.Item label="Native Country" key="NativeCountry" span={3}> {plantData[0].NativeCountry}</Descriptions.Item>,
        <Descriptions.Item label="Symbolism" key="Symbolism" span={3}> {plantData[0].Symbolism}</Descriptions.Item >,
        <Descriptions.Item label="Endangered Status" key="EndangeredStatus" span={3}> {plantData[0].EndangeredStatus}</Descriptions.Item>,
        <Descriptions.Item label="Environmental Threat" key="EnvironmentalThreat" span={3}> {plantData[0].EnvironmentalThreat}</Descriptions.Item>
      ])

      setConditionsComponents([
        <Descriptions.Item label="Difficulty" key="Difficulty" span={3}> {plantData[0].Difficulty}</Descriptions.Item >,
        <Descriptions.Item label="Sunlight Needs" key="SunlightNeeds" span={3}> {plantData[0].SunlightNeeds}</Descriptions.Item >,
        <Descriptions.Item label="Hardiness °C" key="Hardiness" span={3}> {plantData[0].Hardiness}</Descriptions.Item >,
        <Descriptions.Item label="Hardiness Zones" key="HardinessZones" span={3}> {plantData[0].HardinessZones}</Descriptions.Item >,
        <Descriptions.Item label="Soil Type" key="SoilType" span={3}> {plantData[0].SoilType}</Descriptions.Item >,
        <Descriptions.Item label="Water Needs" key="WaterNeeds" span={3}> {plantData[0].WaterNeeds}</Descriptions.Item >,
        <Descriptions.Item label="Fertilisation Needs" key="FertilisationNeeds" span={3}> {plantData[0].FertilisationNeeds}</Descriptions.Item >,
        <Descriptions.Item label="Pruning" key="Pruning" span={3}> {plantData[0].Pruning}</Descriptions.Item >,
        <Descriptions.Item label="Propagation" key="Propagation" span={3}> {plantData[0].Propagation}</Descriptions.Item >,
        <Descriptions.Item label="Pests" key="Pests" span={3}> {plantData[0].Pests}</Descriptions.Item >,
        <Descriptions.Item label="Planting Time" key="PlantingTime" span={3}> {plantData[0].PlantingTime}</Descriptions.Item >,
        <Descriptions.Item label="Harvest Time" key="HarvestTime" span={3}> {plantData[0].HarvestTime}</Descriptions.Item >,
        <Descriptions.Item label="Potting Needs" key="PottingNeeds" span={3}> {plantData[0].PottingNeeds}</Descriptions.Item >,
      ])

      setCharacteristicsComponents([
        <Descriptions.Item label="Lifespan" key="LifeSpan" span={3}> {plantData[0].LifeSpan}</Descriptions.Item >,
        <Descriptions.Item label="Bloom Time" key="BloomTime" span={3}> {plantData[0].BloomTime}</Descriptions.Item >,
        <Descriptions.Item label="Size Range" key="SizeRange" span={3}> {plantData[0].SizeRange}</Descriptions.Item >,
        <Descriptions.Item label="Spread" key="Spread" span={3}> {plantData[0].Spread}</Descriptions.Item >,
        <Descriptions.Item label="Flower Size" key="FlowerSize" span={3}> {plantData[0].FlowerSize}</Descriptions.Item >,
      ])

      setUsesComponents([
        <Descriptions.Item label="Environmental Uses" key="EnvironmentalUses" span={3}> {plantData[0].EnvironmentalUses}</Descriptions.Item >,
        <Descriptions.Item label="Economic Uses" key="EconomicUses" span={3}> {plantData[0].EconomicUses}</Descriptions.Item >,
        <Descriptions.Item label="Home Uses" key="HomeUses" span={3}> {plantData[0].HomeUses}</Descriptions.Item >,
      ])
    }

    setLoading(false);
  }, [plantData]);

  //when the plant images have been retreieved, create the conponents to diplay.
  useEffect(() => {

    if (plantImages.length > 0) {
      var tempComponents = []
      //create the image carousel components
      tempComponents = plantImages.map((image) =>
        <Image key={image.key} src={image.url} alt={image.key} />)
      setImageCarouselComponents(tempComponents);
    }

  }, [plantImages]);

  //when the plant names have been retreieved, create the conponents to diplay.
  useEffect(() => {
    if (plantNames.length > 0) {
      let tempNames = [];
      for (var i = 0; i < plantNames.length; i++) {
        tempNames.push(
          <Descriptions.Item key={i}>{plantNames[i].AltName}
          </Descriptions.Item>
        )
      }
      setNameComponents(tempNames)
    }
  }, [plantNames])

  return (
    <Spin spinning={loading} id="spin-container">
      <PlantSearch id="search" />
      <div id="button-div">
        {!isInGarden ?
          <Button onClick={() => addToGarden()}>Add to Garden</Button> :
          <Button onClick={() => removeFromGarden()}>Remove From Garden</Button>}
      </div>

      <div id="plant-row">
        <div className='plant-col'>
          <Card title="Images" >
            <Carousel>
              {imageCarouselComponents}
            </Carousel>
          </Card>
          <Card title="Key Details" >
            <Descriptions bordered size="small">
              {keyDetailsComponents}
            </Descriptions>
          </Card>
        </div>
        <div className='plant-col'>
          <Card title="Conditions" >
            <Descriptions bordered size="small" >
              {conditionsComponents}
            </Descriptions>
          </Card>
        </div>
        <div className='plant-col'>
          <Card title="Characteristics" >
            <Descriptions bordered size="small" >
              {characteristicsComponents}
            </Descriptions>
          </Card>
          <Card title="Uses">
            <Descriptions bordered size="small" >
              {usesComponents}
            </Descriptions>
          </Card>
          <Card title="Other Names">
            <Descriptions bordered size="small" >
              {nameComponents}
            </Descriptions>
          </Card>
        </div>
      </div>
    </Spin>
  )
}

export default Plant;
