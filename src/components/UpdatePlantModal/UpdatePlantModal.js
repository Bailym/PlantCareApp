import { useState } from 'react';
import './UpdatePlantModal.css';
import { Modal, Input, message, Button, Tabs } from 'antd';
import UpdateNameModal from "../UpdateNameModal"
import UploadImage from "../UploadImage/UploadImage"
const axios = require('axios');
const { TabPane } = Tabs;

function UpdatePlantModal(props) {

  const [visible, setVisible] = useState(false);
  const [dataComponents, setDataComponents] = useState([]);


  function toggleShowModal() {
    setVisible(!visible);
  }

  async function showModal() {

    toggleShowModal();

    let plantData = []

    //get the data for this plant
    await axios.get(`/api/plants/${props.PlantID}`)
      .then(response => {
        plantData = response.data[0];  //store this data.
      })

    //update the state with this data
    setDataComponents([<Tabs defaultActiveKey="1">
      <TabPane forceRender tab="Key Details" key="1">
        <Input addonBefore="Plant ID" id="plantid" defaultValue={plantData.PlantID} />
        <Input addonBefore="Common Name" id="commonname" defaultValue={plantData.CommonName} maxLength={64} />
        <Input addonBefore="Type" id="type" defaultValue={plantData.Type} maxLength={16} />
        <Input addonBefore="Native Country" id="nativecountry" defaultValue={plantData.NativeCountry} maxLength={32} />
        <Input addonBefore="Symbolism" id="symbolism" defaultValue={plantData.Symbolism} maxLength={32} />
        <Input addonBefore="Endangered Status" id="endangeredstatus" defaultValue={plantData.EndangeredStatus} maxLength={64} />
        <Input addonBefore="Environmental Threat" id="environmentalthreat" defaultValue={plantData.EnvironmentalThreat} maxLength={64} />
      </TabPane>
      <TabPane forceRender tab="Conditions" key="2">
        <Input addonBefore="Difficulty" id="difficulty" defaultValue={plantData.Difficulty} maxLength={16} />
        <Input addonBefore="Sunlight Needs" id="sunlightneeds" defaultValue={plantData.SunlightNeeds} maxLength={128} />
        <Input addonBefore="Hardiness" id="hardiness" defaultValue={plantData.Hardiness} maxLength={32} />
        <Input addonBefore="Hardiness Zones" id="hardinesszones" defaultValue={plantData.HardinessZones} maxLength={16} />
        <Input addonBefore="Soil Type" id="soiltype" defaultValue={plantData.SoilType} maxLength={64} />
        <Input addonBefore="Water Needs" id="waterneeds" defaultValue={plantData.WaterNeeds} maxLength={128} />
        <Input addonBefore="Fertilisation Needs" id="fertilisationneeds" defaultValue={plantData.FertilisationNeeds} maxLength={128} />
        <Input addonBefore="Pruning" id="pruning" defaultValue={plantData.Pruning} maxLength={64} />
        <Input addonBefore="Propagation" id="propagation" defaultValue={plantData.Propagation} maxLength={64} />
        <Input addonBefore="Pests" id="pests" defaultValue={plantData.Pests} maxLength={64} />
        <Input addonBefore="Planting Time" id="plantingtime" defaultValue={plantData.PlantingTime} maxLength={32} />
        <Input addonBefore="Harvest Time" id="harvesttime" defaultValue={plantData.HarvestTime} maxLength={32} />
        <Input addonBefore="PottingNeeds" id="pottingneeds" defaultValue={plantData.PottingNeeds} maxLength={64} />
      </TabPane>
      <TabPane forceRender tab="Characteristics" key="3">
        <Input addonBefore="Lifespan" id="lifespan" defaultValue={plantData.LifeSpan} maxLength={32} />
        <Input addonBefore="Bloom Time" id="bloomtime" defaultValue={plantData.BloomTime} maxLength={32} />
        <Input addonBefore="Size Range" id="sizerange" defaultValue={plantData.SizeRange} maxLength={16} />
        <Input addonBefore="Spread" id="spread" defaultValue={plantData.Spread} maxLength={16} />
        <Input addonBefore="Flower Size" id="flowersize" defaultValue={plantData.FlowerSize} maxLength={16} />
      </TabPane>
      <TabPane forceRender tab="Uses" key="4">
        <Input addonBefore="Environmental Uses" id="environmentaluses" defaultValue={plantData.EnvironmentalUses} maxLength={128} />
        <Input addonBefore="Economic Uses" id="economicuses" defaultValue={plantData.EconomicUses} maxLength={128} />
        <Input addonBefore="Home Uses" id="homeuses" defaultValue={plantData.HomeUses} maxLength={128} />

      </TabPane>
    </Tabs>])
  };

  /*
 * Handles when the OK button is pressed.
 * When the OK button is pressed. Delete the selected Plant
 */
  async function handleOk(e) {

    toggleShowModal();

    //create an object containing the plants data
    var newPlantData =
    {
      plantID: props.PlantID,
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
  }

  return (
    <>
      <Button onClick={() => showModal()}>VIEW/EDIT</Button>
      <Modal
        title="View/Edit Plant"
        visible={visible}
        onCancel={() => toggleShowModal()}
        onOk={() => handleOk()}
        footer={[
          <div id="modal-footer">
            <UpdateNameModal PlantID={props.PlantID} />
            <UploadImage PlantID={props.PlantID} />
            <Button id="cancel-footer-btn" key="back" onClick={() => toggleShowModal()}>Cancel</Button>,
            <Button key="submit" type="primary" onClick={() => handleOk()}>Submit</Button>
          </div>
        ]}
      >
        {dataComponents}
      </Modal>
    </>
  );
}

export default UpdatePlantModal