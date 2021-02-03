import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import PropTypes from 'prop-types';
import { Modal, Input, message, Button, Typography, Tabs } from 'antd';
const axios = require('axios');
const { Text } = Typography;
const { TabPane } = Tabs;

class AddPlantModal extends React.Component {

  static propTypes = {
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
    await axios.post(`/api/plants/create`, newPlantData)
      .then(response => {
        message.info("Plant Created")
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
      <div style={{margin:"1% 0 0 3%"}}>
        <Button onClick={this.showModal}>Create Plant</Button>
        <Modal
          title="Create Plant"
          visible={this.state.visible}
          onCancel={this.handleCancel}
          key={this.childKey}
          onOk={this.handleOk}
        >
          <div>
            <Tabs defaultActiveKey="1" onChange={this.callback}>
              <TabPane forceRender tab="Key Details" key="1">
                <Input addonBefore="Common Name" id="commonname" />
                <Input addonBefore="Type" id="type" />
                <Input addonBefore="Native Country" id="nativecountry" />
                <Input addonBefore="Symbolism" id="symbolism" />
                <Input addonBefore="Endangered Status" id="endangeredstatus" />
                <Input addonBefore="Environmental Threat" id="environmentalthreat" />
              </TabPane>
              <TabPane forceRender tab="Conditions" key="2">
                <Input addonBefore="Difficulty" id="difficulty" />
                <Input addonBefore="Sunlight Needs" id="sunlightneeds" />
                <Input addonBefore="Hardiness" id="hardiness" />
                <Input addonBefore="Hardiness Zones" id="hardinesszones" />
                <Input addonBefore="Soil Type" id="soiltype" />
                <Input addonBefore="Water Needs" id="waterneeds" />
                <Input addonBefore="Fertilisation Needs" id="fertilisationneeds" />
                <Input addonBefore="Pruning" id="pruning" />
                <Input addonBefore="Propagation" id="propagation" />
                <Input addonBefore="Pests" id="pests" />
                <Input addonBefore="Planting Time" id="plantingtime" />
                <Input addonBefore="Harvest Time" id="harvesttime" />
                <Input addonBefore="PottingNeeds" id="pottingneeds" />
              </TabPane>
              <TabPane forceRender tab="Characteristics" key="3">
                <Input addonBefore="Lifespan" id="lifespan" />
                <Input addonBefore="Bloom Time" id="bloomtime" />
                <Input addonBefore="Size Range" id="sizerange" />
                <Input addonBefore="Spread" id="spread" />
                <Input addonBefore="Flower Size" id="flowersize" />
              </TabPane>
              <TabPane forceRender tab="Uses" key="4">
                <Input addonBefore="Environmental Uses" id="environmentaluses" />
                <Input addonBefore="Economic Uses" id="economicuses" />
                <Input addonBefore="Home Uses" id="homeuses" />
              </TabPane>
            </Tabs>
          </div>
        </Modal>
      </div>
    );
  }
}

export default AddPlantModal