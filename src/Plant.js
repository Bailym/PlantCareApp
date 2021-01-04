import React from 'react';
import 'antd/dist/antd.css';
import PlantSearch from "./components/PlantSearch";
import { Space, Card, Carousel, Image, Descriptions } from 'antd';
import ReactDOM from "react-dom"
const axios = require('axios');

class Plant extends React.Component {

  state = {
    plantID: this.props.location.state.PlantID,
    plantData: [],
    plantNames: [],
    plantImages: [],
    imageCarouselComponents: [],
    keyDetailsComponents: [],
  }

  render() {
    return (

      <div style={{ margin: "1% auto", width: "95%" }}>
        <PlantSearch style={{ width: "100%", textAlign: "center", textAlignLast: "center" }} />

        <Space direction="vertical" style={{width:"30%"}}>
          <Card title="Images" style={{ width: "100%" }}>
            <Carousel autoplay>
              {this.state.imageCarouselComponents}
            </Carousel>
          </Card>
          <Card title="Key Details" style={{ width: "100%" }} id="keydetails">
            <Descriptions bordered size="small">
              {this.state.keyDetailsComponents}
            </Descriptions>


          </Card>
        </Space>
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




tempState.keyDetailsComponents = [
  < Descriptions.Item label = "Common Name"  key="key1" span={3}> { tempState.plantData[0].CommonName }</Descriptions.Item >,
  < Descriptions.Item label = "Type"  key="key2" span={3}> { tempState.plantData[0].Type }</Descriptions.Item >,
  < Descriptions.Item label = "Native Country"  key="key3" span={3}> { tempState.plantData[0].NativeCountry }</Descriptions.Item >,
  < Descriptions.Item label = "Symbolism"  key="key4" span={3}> { tempState.plantData[0].Symbolism }</Descriptions.Item >,
  < Descriptions.Item label = "Endangered Status"  key="key5" span={3}> { tempState.plantData[0].EndangeredStatus }</Descriptions.Item >,
  < Descriptions.Item label = "Environmental Threat"  key="key6" span={3}> { tempState.plantData[0].EnvironmentalThreat }</Descriptions.Item >
]

    
    console.log(tempState)

    //apply the state
    this.setState(tempState)












  }



}


export default Plant;
