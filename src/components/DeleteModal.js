import { useState } from 'react';
import 'antd/dist/antd.css';
import { Modal, Popconfirm, message, Button, Typography } from 'antd';
const axios = require('axios');
const { Text } = Typography;

function DeleteModal(props) {

  const [visible, setVisible] = useState(false);

  //toggles modal visibility
  function toggleShowModal() {
    setVisible(!visible)
  };

  /*
  * Handles when the OK button is pressed.
  * When the OK button is pressed. Delete the selected Plant
  */
  async function handleOk(e) {

    var plantID = props.PlantID;
    //archive
    await axios.post(`/api/plants/archive/${plantID}`)
      .then(response => {
        message.info("Plant Deleted")
      })
    toggleShowModal();
  }

  return (
    <>
      <Button onClick={() => toggleShowModal()}>ARCHIVE</Button>
      <Modal
        title="Archive Plant"
        visible={visible}
        onCancel={() => toggleShowModal()}
        footer={false}
        key={props.PlantID}
      >
        <Text type="danger">You are about to archive: {props.PlantName} </Text><br/>
        <Popconfirm
          title="Are you sure?"
          onConfirm={() => handleOk()}
          onCancel={() => toggleShowModal()}
          okText="Yes"
          cancelText="No"
        >
          <Button>Confirm</Button>
        </Popconfirm>
      </Modal>
    </>
  );
}

export default DeleteModal