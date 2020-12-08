import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import PropTypes from 'prop-types';
import { Modal, Input, message, Button, Typography, Tabs } from 'antd';
const axios = require('axios');
const { Text } = Typography;
const { TabPane } = Tabs;

class PlantModal extends React.Component {

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

    this.getPlant();
  };

  getPlant = async () => {

    var plantData = []

    //get the data for this plant
    await axios.get(`/api/plants/${this.props.propPlantID}`)
      .then(response => {
        plantData = response.data[0];  //store this data.
      })
      .catch(function (error) {
        console.log(error);
      })

    ReactDOM.render(<Tabs defaultActiveKey="1" onChange={this.callback}>
    <TabPane forceRender tab="Key Details" key="1">
      <Input addonBefore="Plant ID" id="plantid" defaultValue = {plantData.PlantID} />
      <Input addonBefore="Common Name" id="commonname" defaultValue = {plantData.CommonName} />
      <Input addonBefore="Type" id="type" defaultValue = {plantData.Type} />
      <Input addonBefore="Native Country" id="nativecountry" defaultValue = {plantData.NativeCountry} />
      <Input addonBefore="Symbolism" id="symbolism" defaultValue = {plantData.Symbolism} />
      <Input addonBefore="Endangered Status" id="endangeredstatus" defaultValue = {plantData.EndangeredStatus} />
      <Input addonBefore="Environmental Threat" id="environmentalthreat" defaultValue = {plantData.EnvironmentalThreat} />
    </TabPane>
    <TabPane forceRender tab="Conditions" key="2">
      <Input addonBefore="Difficulty" id="difficulty" defaultValue = {plantData.Difficulty} />
      <Input addonBefore="Sunlight Needs" id="sunlightneeds" defaultValue = {plantData.SunlightNeeds}/>
      <Input addonBefore="Hardiness" id="hardiness" defaultValue = {plantData.Hardiness}/>
      <Input addonBefore="Hardiness Zones" id="hardinesszones"defaultValue = {plantData.HardinessZones} />
      <Input addonBefore="Soil Type" id="soiltype" defaultValue = {plantData.SoilType}/>
      <Input addonBefore="Water Needs" id="waterneeds" defaultValue = {plantData.WaterNeeds}/>
      <Input addonBefore="Fertilisation Needs" id="fertilisationneeds" defaultValue = {plantData.FertilisationNeeds}/>
      <Input addonBefore="Pruning" id="pruning" defaultValue = {plantData.Pruning}/>
      <Input addonBefore="Propagation" id="propagation" defaultValue = {plantData.Propagation}/>
      <Input addonBefore="Pests" id="pests" defaultValue = {plantData.Pests}/>
      <Input addonBefore="Planting Time" id="plantingtime" defaultValue = {plantData.PlantingTime}/>
      <Input addonBefore="Harvest Time" id="harvesttime" defaultValue = {plantData.HarvestTime}/>
      <Input addonBefore="PottingNeeds" id="pottingneeds" defaultValue = {plantData.PottingNeeds}/>
    </TabPane>
    <TabPane forceRender tab="Characteristics" key="3">
      <Input addonBefore="Lifespan" id="lifespan" defaultValue = {plantData.LifeSpan}/>
      <Input addonBefore="Bloom Time" id="bloomtime" defaultValue = {plantData.BloomTime}/>
      <Input addonBefore="Size Range" id="sizerange" defaultValue = {plantData.SizeRange}/>
      <Input addonBefore="Spread" id="spread" defaultValue = {plantData.Spread}/>
      <Input addonBefore="Flower Size" id="flowersize" defaultValue = {plantData.FlowerSize}/>
    </TabPane>
    <TabPane forceRender tab="Uses" key="4">
      <Input addonBefore="Environmental Uses" id="environmentaluses" defaultValue = {plantData.EnvironmentalUses}/>
      <Input addonBefore="Economic Uses" id="economicuses" defaultValue = {plantData.EconomicUses}/>
      <Input addonBefore="Home Uses" id="homeuses" defaultValue = {plantData.HomeUses}/>

    </TabPane>
  </Tabs>, document.getElementById("tabsDiv"))
  }

  /*
  * Handles when the OK button is pressed.
  * When the OK button is pressed. Delete the selected Plant
  */
  handleOk = async (e) => {
    //Close the modal by setting visible to false.
    this.setState({
      visible: false,
    });

    var plantID = this.props.propPlantID;

    //archive
    await axios.post(``)
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
    console.log(key);
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
          <div id="tabsDiv">
            

          </div>
        </Modal>
      </div>
    );
  }
}

export default PlantModal