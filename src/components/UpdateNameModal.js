import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import PropTypes from 'prop-types';
import { Modal, Input, Button, Form } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
const axios = require('axios');


class UpdateNameModal extends React.Component {

  static propTypes = {
    propPlantID: PropTypes.number,  //Stores the ID of the selected plant
  }

  state = {
    visible: false, //Used to Show/Hide the Modal.
  };


  /*
  * callback for when the form is submitted
  * Reads the values from the form and sends them to the server 
  * The server INSERTS/UPDATES the names and the form is closed
  */
  onFinish = async (values) => {

    //post the data from the form
    await axios.post(`/api/plants/names/update/${this.props.propPlantID}/`, values)
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

    var formData = { names: [] }  //will hold the initial data for the form

    //get the names for this plant
    await axios.get(`/api/plants/names/${this.props.propPlantID}`)
      .then(response => {
        //add these names to the formData object
        for (var i = 0; i < response.data.length; i++) {
          formData.names.push(
            response.data[i].AltName)
        }
      })
      .catch(function (error) {
        console.log(error);
      })

      //render the form with the exisitng data
    ReactDOM.render(<Form name="namesForm" initialValues={formData} onFinish={this.onFinish}>
      <Form.List name="names">
        {(fields, { add, remove }, { errors }) => (
          <>
            {fields.map((field, index) => (
              <Form.Item
                required={false}
                key={field.key}
              >
                <Form.Item
                  {...field}
                  validateTrigger={['onChange', 'onBlur']}
                  rules={[
                    {
                      required: true,
                      whitespace: true,
                      message: "Please enter a name or delete this field.",
                    },
                  ]}
                  noStyle
                >
                  <Input placeholder="Plant name" style={{ width: '90%' }} />
                </Form.Item>
                {fields.length > 0 ? (<MinusCircleOutlined className="dynamic-delete-button" onClick={() => remove(field.name)} />) : null}
              </Form.Item>
            ))}

            <Form.Item>
              <Button
                type="dashed"
                onClick={() => add()}
                style={{ width: '60%' }}
                icon={<PlusOutlined />}
              >Add Name</Button>
              <Form.ErrorList errors={errors} />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit"> Submit</Button>
            </Form.Item>
          </>
        )}
      </Form.List>
    </Form>, document.getElementById("namecontainer"))
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
        <Button onClick={this.showModal}>VIEW NAMES</Button>
        <Modal
          title="View/Edit Plant Names"
          visible={this.state.visible}
          key={"name" + this.props.propPlantID}
          onCancel={this.handleCancel}
          footer={[
            <Button style={{ display: "inline-block" }} key="back" onClick={this.handleCancel}>Cancel</Button>,
          ]}
        >
          <div id="namecontainer"></div>
        </Modal>
      </div>
    );
  }
}


export default UpdateNameModal