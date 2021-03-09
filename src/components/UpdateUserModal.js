import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import PropTypes from 'prop-types';
import { Modal, Input, message, Button, Select } from 'antd';
const axios = require('axios');
const { Option } = Select;

class UpdateUserModal extends React.Component {

  static propTypes = {
    propUserID: PropTypes.number,  //Stores the ID of the selected plant
  }

  state = {
    visible: false, //Used to Show/Hide the Modal.
    typeSelectValue : ""
  };

  childKey = 0; //Prevents duplicate keys
  selectValue = "";

  /*
  * Method to show the modal.
  * Sets visible to true.
  */
  showModal = async () => {

    this.setState({
      visible: true,
    });

    var userData = []

    //get the data for this plant
    await axios.get(`/api/users/${this.props.propUserID}`)
      .then(response => {
        userData = response.data[0];  //store this data.
      })
      .catch(function (error) {
        console.log(error);
      })

    //Render the contents of the modal with the plant information populated.
    ReactDOM.render(
      <div>
        <Input addonBefore="Email" id="email" defaultValue={userData.Email} />
      <Input addonBefore="First Name" id="firstname" defaultValue={userData.FirstName} />
      <Input addonBefore="Surname" id="surname" defaultValue={userData.Surname} />
      <Input addonBefore="Password" id="password" defaultValue={userData.Password} type="password" disabled />
      <Input disabled value={"Type"} style={{ width: '15%', color: 'rgba(0, 0, 0, 1)', cursor: 'auto' }} /><Select addonBefore="Type" defaultValue={userData.Type} id="type" onChange={(value) =>{
        this.selectValue = value
      }}>
      <Option value="Admin">Admin</Option>
      <Option value="User">User</Option>
    </Select>
      </div>, document.getElementById("tabsDiv"))
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


      var userID = this.props.propUserID
      var email = document.getElementById("email").value ? document.getElementById("email").value : "Unknown"
      var firstName = document.getElementById("firstname").value ? document.getElementById("firstname").value : "Unknown"
      var surname = document.getElementById("surname").value ? document.getElementById("surname").value : "Unknown"
      var password = document.getElementById("password").value ? document.getElementById("password").value : "Unknown"
      var type = this.selectValue ? this.selectValue : "Unknown"
  

    //send this object to the server to be updated
    await axios.post(`/api/users/updateuser/${userID}/${firstName}/${surname}/${email}/${password}/${type}`)
      .then(response => {
        message.info("User Updated")
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
          title="View/Edit User"
          visible={this.state.visible}
          onCancel={this.handleCancel}
          key={this.childKey}
          onOk={this.handleOk}
        >
          <div id="tabsDiv"></div>
        </Modal>
      </div >
    );
  }
}

export default UpdateUserModal