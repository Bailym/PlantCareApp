import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import '../app.css';
import PropTypes from 'prop-types';
import { Modal, message, Button, Form, Image, Upload } from 'antd';
import { MinusCircleOutlined, UploadOutlined } from '@ant-design/icons';
const axios = require('axios');


class UpdateImageModal extends React.Component {

  static propTypes = {
    propPlantID: PropTypes.number,  //Stores the ID of the selected plant
  }

  state = {
    visible: false, //Used to Show/Hide the Modal.
    newImages: []
  };


  /*
  * callback for when the form is submitted
  * Reads the values from the form and sends them to the server 
  * The server INSERTS/UPDATES the names and the form is closed
  */
  onFinish = async (values) => {

    var existingImageNames = values.names
    var newImages = this.state.newImages

    //post the data from the form
    await axios.post(`/api/plant/images/update/${this.props.propPlantID}/`, { "newImages": newImages, "existingImageNames": existingImageNames })
      .then(response => {
        //close the form
        this.handleCancel();
      })
      .catch(function (error) {
        console.log(error);
      })
  }

  /*
  * Method to show the modal.
  * Sets visible to true.
  */
  showModal = async () => {

    this.setState({
      visible: true,
    });


    var images = { names: [] }
    //get the names for this plant
    await axios.get(`/api/plant/images/${this.props.propPlantID}`)
      .then(response => {
        for (var i = 0; i < response.data.length; i++) {
          images.names.push(response.data[i].ImagePath)
        }
      })
      .catch(function (error) {
        console.log(error);
      })

    //render the form with the exisitng data
    ReactDOM.render(<Form name="namesForm" onFinish={this.onFinish} initialValues={images} >
      <Form.List name="names" style={{overflow:"scroll"}}>
        {(fields, { add, remove }, { errors }) => (
          <>
            {fields.map((field, index) => (
                <Form.Item required={false} key={field.key} style={{display:"inline-block", marginLeft:"2%"}}>
                  <Form.Item {...field}>
                    <Image style={{border:"1px solid #000"}} width={100} src={"/images/" + images.names[field.name] } />
                  </Form.Item>
                  {fields.length > 0 ? (<MinusCircleOutlined className="dynamic-delete-button" onClick={() => remove(field.name)} />) : null}
                </Form.Item>
            ))}
            <Form.Item>
              <Form.ErrorList errors={errors} />
              <Upload name='file'
              action='/api/upload'
              headers={{
                authorization: 'authorization-text',
              }}
              onChange={(info) => {

                let tempState = Object.assign({}, this.state)
                if (info.file.status !== 'uploading') {

                }
                if (info.file.status === 'done') {
                  message.success(`${info.file.name} file uploaded successfully`);
                  tempState.newImages.push(info.file.name)

                } else if (info.file.status === 'error') {
                  message.error(`${info.file.name} file upload failed.`);
                }
                this.setState(tempState);

              }}
              beforeUpload={(file) => {
                if (file.type !== 'image/jpeg') {
                  message.error(`${file.name} is not a jpeg file`);
                }
                return file.type === 'image/jpeg';
              }}
              style={{ width: "50%" }}>
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit"> Submit</Button>
            </Form.Item>
          </>
        )}
      </Form.List>
    </Form>, document.getElementById("imagecontainer"))
  };


  /*
  * Handles when the cancel button is pressed. Hides the modal
  */
  handleCancel = e => {
    //Set visible to false to close the modal.
    this.setState({
      visible: false,
    });
  };

  render = () => {
    return (
      <div>
        <Button onClick={this.showModal}>VIEW IMAGES</Button>
        <Modal
          title="View/Edit Plant Images"
          visible={this.state.visible}
          key={"image" + this.props.propPlantID}
          onCancel={this.handleCancel}
          footer={[
            <Button style={{ display: "inline-block" }} key="back" onClick={this.handleCancel}>Cancel</Button>,
          ]}
        >
          <div id="imagecontainer">

          </div>

        </Modal>
      </div>
    );
  }
}


export default UpdateImageModal