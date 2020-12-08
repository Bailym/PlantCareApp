import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import PropTypes from 'prop-types';
import { Modal, Input, message, Button, Typography, Tabs } from 'antd';
const axios = require('axios');
const { Text } = Typography;
const { TabPane } = Tabs;

class UpdatePlantModal extends React.Component {

  static propTypes = {
    propPlantID: PropTypes.number,  //Stores the ID of the selected plant
    propPlantName: PropTypes.string
  }

  state = {
    visible: false, //Used to Show/Hide the Modal.
  };

  childKey = 0; //Prevents duplicate keys

  /*
  * Method to show the modal.
  * Sets visible to true.
  */
  showModal = async () => {

    this.setState({
      visible: true,
    });

    var plantData = []

    //get the data for this plant
    await axios.get(`/api/plants/${this.props.propPlantID}`)
      .then(response => {
        plantData = response.data[0];  //store this data.
      })
      .catch(function (error) {
        console.log(error);
      })

    //Render the contents of the modal with the plant information populated.
    ReactDOM.render(<Tabs defaultActiveKey="1" onChange={this.callback}>
      <TabPane forceRender tab="Key Details" key="1">
        <Input addonBefore="Plant ID" id="plantid" defaultValue={plantData.PlantID} />
        <Input addonBefore="Common Name" id="commonname" defaultValue={plantData.CommonName} />
        <Input addonBefore="Type" id="type" defaultValue={plantData.Type} />
        <Input addonBefore="Native Country" id="nativecountry" defaultValue={plantData.NativeCountry} />
        <Input addonBefore="Symbolism" id="symbolism" defaultValue={plantData.Symbolism} />
        <Input addonBefore="Endangered Status" id="endangeredstatus" defaultValue={plantData.EndangeredStatus} />
        <Input addonBefore="Environmental Threat" id="environmentalthreat" defaultValue={plantData.EnvironmentalThreat} />
      </TabPane>
      <TabPane forceRender tab="Conditions" key="2">
        <Input addonBefore="Difficulty" id="difficulty" defaultValue={plantData.Difficulty} />
        <Input addonBefore="Sunlight Needs" id="sunlightneeds" defaultValue={plantData.SunlightNeeds} />
        <Input addonBefore="Hardiness" id="hardiness" defaultValue={plantData.Hardiness} />
        <Input addonBefore="Hardiness Zones" id="hardinesszones" defaultValue={plantData.HardinessZones} />
        <Input addonBefore="Soil Type" id="soiltype" defaultValue={plantData.SoilType} />
        <Input addonBefore="Water Needs" id="waterneeds" defaultValue={plantData.WaterNeeds} />
        <Input addonBefore="Fertilisation Needs" id="fertilisationneeds" defaultValue={plantData.FertilisationNeeds} />
        <Input addonBefore="Pruning" id="pruning" defaultValue={plantData.Pruning} />
        <Input addonBefore="Propagation" id="propagation" defaultValue={plantData.Propagation} />
        <Input addonBefore="Pests" id="pests" defaultValue={plantData.Pests} />
        <Input addonBefore="Planting Time" id="plantingtime" defaultValue={plantData.PlantingTime} />
        <Input addonBefore="Harvest Time" id="harvesttime" defaultValue={plantData.HarvestTime} />
        <Input addonBefore="PottingNeeds" id="pottingneeds" defaultValue={plantData.PottingNeeds} />
      </TabPane>
      <TabPane forceRender tab="Characteristics" key="3">
        <Input addonBefore="Lifespan" id="lifespan" defaultValue={plantData.LifeSpan} />
        <Input addonBefore="Bloom Time" id="bloomtime" defaultValue={plantData.BloomTime} />
        <Input addonBefore="Size Range" id="sizerange" defaultValue={plantData.SizeRange} />
        <Input addonBefore="Spread" id="spread" defaultValue={plantData.Spread} />
        <Input addonBefore="Flower Size" id="flowersize" defaultValue={plantData.FlowerSize} />
      </TabPane>
      <TabPane forceRender tab="Uses" key="4">
        <Input addonBefore="Environmental Uses" id="environmentaluses" defaultValue={plantData.EnvironmentalUses} />
        <Input addonBefore="Economic Uses" id="economicuses" defaultValue={plantData.EconomicUses} />
        <Input addonBefore="Home Uses" id="homeuses" defaultValue={plantData.HomeUses} />

      </TabPane>
    </Tabs>, document.getElementById("tabsDiv"))
  };

  /*
  * Handles when the OK button is pressed.
  * When the OK button is pressed. Delete the selected Plant
  */
  handleOk = async (e) => {
    //Close the modal by setting visible to false.
    this.setState({
      visible: false,
    });

    //create an object containing the plants data
    var newPlantData = 
      {
        plantID: this.props.propPlantID,
        commonName: document.getElementById("commonname").value ? document.getElementById("commonname").value : "Unknown",
        type: document.getElementById("type").value ? document.getElementById("type").value : "Unknown",
        nativeCountry: document.getElementById("nativecountry").value ? document.getElementById("nativecountry").value : "Unknown",
        symbolism: document.getElementById("symbolism").value ? document.getElementById("symbolism").value : "Unknown",
        endangeredStatus: document.getElementById("endangeredstatus").value ? document.getElementById("endangeredstatus").value : "Unknown",
        environmentalThreat: document.getElementById("environmentalthreat").value ? document.getElementById("environmentalthreat").value : "Unknown",
        difficulty: document.getElementById("difficulty").value ? document.getElementById("difficulty").value : "Unknown",
        sunlightNeeds: document.getElementById("sunlightneeds").value ? document.getElementById("sunlightneeds").value : "Unknown",
        hardiness: document.getElementById("hardiness").value ? document.getElementById("hardiness").value : "Unknown",
        hardinessZones: document.getElementById("hardinesszones").value ? document.getElementById("hardinesszones").value : "Unknown",
        soilType: document.getElementById("soiltype").value ? document.getElementById("soiltype").value : "Unknown",
        waterNeeds: document.getElementById("waterneeds").value ? document.getElementById("waterneeds").value : "Unknown",
        fertilisationNeeds: document.getElementById("fertilisationneeds").value ? document.getElementById("fertilisationneeds").value : "Unknown",
        pruning: document.getElementById("pruning").value ? document.getElementById("pruning").value : "Unknown",
        propagation: document.getElementById("propagation").value ? document.getElementById("propagation").value : "Unknown",
        pests: document.getElementById("pests").value ? document.getElementById("pests").value : "Unknown",
        plantingTime: document.getElementById("plantingtime").value ? document.getElementById("plantingtime").value : "Unknown",
        harvestTime: document.getElementById("harvesttime").value ? document.getElementById("harvesttime").value : "Unknown",
        pottingNeeds: document.getElementById("pottingneeds").value ? document.getElementById("pottingneeds").value : "Unknown",
        lifeSpan: document.getElementById("lifespan").value ? document.getElementById("lifespan").value : "Unknown",
        bloomTime: document.getElementById("bloomtime").value ? document.getElementById("bloomtime").value : "Unknown",
        sizeRange: document.getElementById("sizerange").value ? document.getElementById("sizerange").value : "Unknown",
        spread: document.getElementById("spread").value ? document.getElementById("spread").value : "Unknown",
        flowerSize: document.getElementById("flowersize").value ? document.getElementById("flowersize").value : "Unknown",
        environmentalUses: document.getElementById("environmentaluses").value ? document.getElementById("environmentaluses").value : "Unknown",
        economicUses: document.getElementById("economicuses").value ? document.getElementById("economicuses").value : "Unknown",
        homeUses: document.getElementById("homeuses").value ? document.getElementById("homeuses").value : "Unknown",
      }
  

     //send this object to the server to be updated
    await axios.post(`/api/plants/update`, newPlantData)
      .then(response => {
        message.info("Plant Updated")
      })
      .catch(function (error) {
        console.log(error)
      })
  }

  /*
  * Handles when the cancel button is pressed. Hides the modal
  */
  handleCancel = e => {
    //Set visible to false to close the modal.
    this.setState({
      visible: false,
    });
  };

  callback = (key) => {

  }

  render = () => {
    ++this.childKey;
    return (
      <div>
        <Button onClick={this.showModal}>VIEW/EDIT</Button>
        <Modal
          title="View/Edit Plant"
          visible={this.state.visible}
          onCancel={this.handleCancel}
          key={this.childKey}
          onOk={this.handleOk}
        >
          <div id="tabsDiv"></div>
        </Modal>
      </div>
    );
  }
}

export default UpdatePlantModal