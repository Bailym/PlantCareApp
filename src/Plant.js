import React from 'react';
import 'antd/dist/antd.css';
import PlantSearch from "./components/PlantSearch";
import { Space, Card, Carousel, Image, Descriptions } from 'antd';
import ReactDOM from "react-dom"
import MediaQuery from 'react-responsive'
const axios = require('axios');

class Plant extends React.Component {

  state = {
    plantID: this.props.location.state.PlantID,
    plantData: [],
    plantNames: [],
    plantImages: [],
    imageCarouselComponents: [],
    keyDetailsComponents: [],
    conditionsComponents: [],
    characteristicsComponents: [],
    usesComponents: [],
    nameComponents: [],
  }

  render() {
    return (
      <div style={{ height: "100%" }}>
        <MediaQuery minDeviceWidth={1025}>
          <div style={{ margin: "1% auto", width: "95%", height: "98%" }}>
            <PlantSearch style={{ width: "100%", textAlign: "center", textAlignLast: "center" }} />

            <Space direction="vertical" style={{ width: "33%", overflowY: "auto", height: "100%" }}>
              <Card title="Images">
                <Carousel autoplay>
                  {this.state.imageCarouselComponents}
                </Carousel>
              </Card>
              <Card title="Key Details">
                <Descriptions bordered size="small">
                  {this.state.keyDetailsComponents}
                </Descriptions>
              </Card>
            </Space>
            <Space direction="vertical" style={{ width: "33%", margin: "0 0.5%", overflowY: "auto", height: "100%" }}>
              <Card title="Conditions" >
                <Descriptions bordered size="small">
                  {this.state.conditionsComponents}
                </Descriptions>
              </Card>
            </Space>
            <Space direction="vertical" style={{ width: "33%", overflowY: "auto", height: "100%" }}>
              <Card title="Characteristics" >
                <Descriptions bordered size="small">
                  {this.state.characteristicsComponents}
                </Descriptions>
              </Card>
              <Card title="Uses">
                <Descriptions bordered size="small">
                  {this.state.usesComponents}
                </Descriptions>
              </Card>
              <Card title="Other Names" >
                <Descriptions bordered size="small">
                  {this.state.nameComponents}
                </Descriptions>
              </Card>
            </Space>
          </div>
        </MediaQuery>

        <MediaQuery minDeviceWidth={641} maxDeviceWidth={1024}>
          <div style={{ margin: "1% auto", width: "95%", height: "100%" }}>
            <PlantSearch style={{ width: "100%", textAlign: "center", textAlignLast: "center" }} />

            <Space direction="vertical" style={{ width: "33%", overflowY: "auto", height: "100%" }}>
              <Card title="Images">
                <Carousel autoplay>
                  {this.state.imageCarouselComponents}
                </Carousel>
              </Card>
              <Card title="Key Details">
                <Descriptions bordered >
                  {this.state.keyDetailsComponents}
                </Descriptions>
              </Card>
            </Space>
            <Space direction="vertical" style={{ width: "33%", margin: "0 0.5%", overflowY: "auto", height: "100%" }}>
              <Card title="Conditions" >
                <Descriptions bordered >
                  {this.state.conditionsComponents}
                </Descriptions>
              </Card>
            </Space>
            <Space direction="vertical" style={{ width: "33%", overflowY: "auto", height: "100%" }}>
              <Card title="Characteristics" >
                <Descriptions bordered >
                  {this.state.characteristicsComponents}
                </Descriptions>
              </Card>
              <Card title="Uses">
                <Descriptions bordered >
                  {this.state.usesComponents}
                </Descriptions>
              </Card>
              <Card title="Other Names" >
                <Descriptions bordered >
                  {this.state.nameComponents}
                </Descriptions>
              </Card>
            </Space>
          </div>
        </MediaQuery>

        <MediaQuery maxDeviceWidth={640}>
          <div style={{ margin: "1% auto", width: "95%", height: "100%" }}>
            <PlantSearch style={{ width: "100%", textAlign: "center", textAlignLast: "center" }} />

            <Space direction="vertical" style={{ width: "100%", overflowY: "auto", height: "100%" }}>
              <Card title="Images">
                <Carousel autoplay touchMove={false}>
                  {this.state.imageCarouselComponents}
                </Carousel>
              </Card>
              <Card title="Key Details">
                <Descriptions bordered >
                  {this.state.keyDetailsComponents}
                </Descriptions>
              </Card>
              <Card title="Conditions" >
                <Descriptions bordered >
                  {this.state.conditionsComponents}
                </Descriptions>
              </Card>
              <Card title="Characteristics" >
                <Descriptions bordered >
                  {this.state.characteristicsComponents}
                </Descriptions>
              </Card>
              <Card title="Uses">
                <Descriptions bordered >
                  {this.state.usesComponents}
                </Descriptions>
              </Card>
              <Card title="Other Names" >
                <Descriptions bordered >
                  {this.state.nameComponents}
                </Descriptions>
              </Card>
            </Space>
          </div>
        </MediaQuery>
      </div>

    );
  }

  async componentDidMount() {
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
              if (response.data === "Admin") {
                this.props.history.push("/admin") //Redirect to admin page
                window.location.reload();
              }
            })
        }
      })
      .catch(function (error) {
        console.log(error);
      })

    //get all of thid plants data
    let tempState = Object.assign({}, this.state)

    await axios.get(`/api/plants/${this.state.plantID}`)
      .then(response => {
        tempState.plantData = response.data;
      })

    await axios.get(`/api/plants/names/${this.state.plantID}`)
      .then(response => {
        tempState.plantNames = response.data
      })

    await axios.get(`/api/plant/images/${this.state.plantID}`)
      .then(response => {
        tempState.plantImages = response.data
      })

    //create the image carousel components
    tempState.imageCarouselComponents = tempState.plantImages.map(x => <div key={x.ImagePath}  >
      <Image key={x.ImagePath} style={{
        border: "1px solid #000", width: "auto",
        height: "auto",
        maxWidth: "250px",
        maxHeight: "250px",
        display: "block",
        margin: "auto",
      }} src={"/images/" + x.ImagePath} />
    </div>)



    //Create components from the data 
    tempState.keyDetailsComponents = [
      < Descriptions.Item label="Common Name" key="key3" span={3}> {tempState.plantData[0].CommonName}</Descriptions.Item >,
      < Descriptions.Item label="Type" key="key3" span={3}> {tempState.plantData[0].Type}</Descriptions.Item >,
      < Descriptions.Item label="Native Country" key="key3" span={3}> {tempState.plantData[0].NativeCountry}</Descriptions.Item >,
      < Descriptions.Item label="Symbolism" key="key4" span={3}> {tempState.plantData[0].Symbolism}</Descriptions.Item >,
      < Descriptions.Item label="Endangered Status" key="key3" span={3}> {tempState.plantData[0].EndangeredStatus}</Descriptions.Item >,
      < Descriptions.Item label="Environmental Threat" key="key6" span={3}> {tempState.plantData[0].EnvironmentalThreat}</Descriptions.Item >
    ]

    tempState.conditionsComponents = [
      <Descriptions.Item label="Difficulty" key="conditions3" span={3}> {tempState.plantData[0].Difficulty}</Descriptions.Item >,
      <Descriptions.Item label="Sunlight Needs" key="conditions3" span={3}> {tempState.plantData[0].SunlightNeeds}</Descriptions.Item >,
      <Descriptions.Item label="Hardiness °C" key="conditions3" span={3}> {tempState.plantData[0].Hardiness}</Descriptions.Item >,
      <Descriptions.Item label="Hardiness Zones" key="conditions4" span={3}> {tempState.plantData[0].HardinessZones}</Descriptions.Item >,
      <Descriptions.Item label="Soil Type" key="conditions3" span={3}> {tempState.plantData[0].SoilType}</Descriptions.Item >,
      <Descriptions.Item label="Water Needs" key="conditions6" span={3}> {tempState.plantData[0].WaterNeeds}</Descriptions.Item >,
      <Descriptions.Item label="Fertilisation Needs" key="conditions7" span={3}> {tempState.plantData[0].FertilisationNeeds}</Descriptions.Item >,
      <Descriptions.Item label="Pruning" key="conditions8" span={3}> {tempState.plantData[0].Pruning}</Descriptions.Item >,
      <Descriptions.Item label="Propagation" key="conditions9" span={3}> {tempState.plantData[0].Propagation}</Descriptions.Item >,
      <Descriptions.Item label="Pests" key="conditions30" span={3}> {tempState.plantData[0].Pests}</Descriptions.Item >,
      <Descriptions.Item label="Planting Time" key="conditions33" span={3}> {tempState.plantData[0].PlantingTime}</Descriptions.Item >,
      <Descriptions.Item label="Harvest Time" key="conditions33" span={3}> {tempState.plantData[0].HarvestTime}</Descriptions.Item >,
      <Descriptions.Item label="Potting Needs" key="conditions33" span={3}> {tempState.plantData[0].PottingNeeds}</Descriptions.Item >,
    ]


    tempState.characteristicsComponents = [
      <Descriptions.Item label="Lifespan" key="char3" span={3}> {tempState.plantData[0].LifeSpan}</Descriptions.Item >,
      <Descriptions.Item label="Bloom Time" key="char3" span={3}> {tempState.plantData[0].BloomTime}</Descriptions.Item >,
      <Descriptions.Item label="Size Range" key="char3" span={3}> {tempState.plantData[0].SizeRange}</Descriptions.Item >,
      <Descriptions.Item label="Spread" key="char4" span={3}> {tempState.plantData[0].Spread}</Descriptions.Item >,
      <Descriptions.Item label="Flower Size" key="char3" span={3}> {tempState.plantData[0].FlowerSize}</Descriptions.Item >,
    ]


    tempState.usesComponents = [
      <Descriptions.Item label="Environmental Uses" key="uses3" span={3}> {tempState.plantData[0].EnvironmentalUses}</Descriptions.Item >,
      <Descriptions.Item label="Economic Uses" key="uses3" span={3}> {tempState.plantData[0].EconomicUses}</Descriptions.Item >,
      <Descriptions.Item label="Home Uses" key="uses3" span={3}> {tempState.plantData[0].HomeUses}</Descriptions.Item >,
    ]

    for (var i = 0; i < tempState.plantNames.length; i++) {
      tempState.nameComponents.push(
        <Descriptions.Item key={i}>{tempState.plantNames[i].AltName}
        </Descriptions.Item>
      )
    }

    //apply the state
    this.setState(tempState)
  }



}


export default Plant;
