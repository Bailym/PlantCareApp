import React from 'react';
import 'antd/dist/antd.css';
import PropTypes from 'prop-types';
import { Modal, Popconfirm, message, Button, Typography } from 'antd';
const axios = require('axios');
const { Text } = Typography;

class DeleteUserModal extends React.Component {

  static propTypes = {
    propUserID: PropTypes.number,  //Stores the ID of the selected plant
  }

  state = {
    visible: false, //Used to Show/Hide the Modal.
  };

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

    var userID = this.props.propUserID;

    //archive
    await axios.post(`/api/users/archive/${userID}`)
    .then(response =>{
      message.info("User Deleted")
    })
    .catch(function(error){
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

  render() {
    return (
      <div>
        <Button onClick={this.showModal} >DELETE</Button>
        <Modal
          title="Delete"
          visible={this.state.visible}
          onCancel={this.handleCancel}
          footer={null}
          key={this.props.propPlantID}
        >
          <Text id="deleteText" type="danger" style={{fontSize:"16px"}}>You are about to delete: {this.props.propUserID} </Text> <br/><br/>
          <Popconfirm
            title="Are you sure?"
            onConfirm={this.handleOk}
            onCancel={this.handleCancel}
            okText="Yes"
            cancelText="No"
          >
            <Button>Confirm</Button>
          </Popconfirm>
        </Modal>
      </div>
    );
  }
}

export default DeleteUserModal