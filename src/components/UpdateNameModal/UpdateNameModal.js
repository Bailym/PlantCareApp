import { useEffect, useState } from 'react';
import { Modal, Input, Button, Form, message, Typography } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
const axios = require('axios');

function UpdateNameModal(props) {

  const [visible, setVisible] = useState(false);
  const [initialNames, setinitialNames] = useState([]);
  const [form] = Form.useForm();


  //toggles modal visibility.
  function toggleShowModal() {
    setVisible(!visible);
  }

  /*
    * callback for when the form is submitted
    * Reads the values from the form and sends them to the server 
    * The server INSERTS/UPDATES the names and the form is closed
    */
  async function onSubmit(values) {

    //post the data from the form
    await axios.post(`/api/plants/names/update/${props.PlantID}/`, values.names)
      .then(response => {
        message.success("Names updated successfully!");
        //close the form
        toggleShowModal()
      })
  }

  /*
   * Method to show the modal.
   * Sets visible to true.
   */
  async function getNames() {
    toggleShowModal();
    var tempNames = { names: [] }  //will hold the initial names for the form
    //get the names for this plant
    await axios.get(`/api/plants/names/${props.PlantID}`)
      .then(response => {
        //add these names to the tempNames object
        for (var i = 0; i < response.data.length; i++) {
          tempNames.names.push(response.data[i].AltName)
        }
      })
    setinitialNames(tempNames)
  }

  useEffect(() =>{
    form.resetFields(); //reset the form since initialValue will be set again.
  },[initialNames])

  return (
    <>
      <Button onClick={() => getNames()}>VIEW NAMES</Button>
      <Modal
        title="View/Edit Plant Names"
        visible={visible}
        key={"name" + props.PlantID}
        onCancel={() => toggleShowModal()}
      >
        <Form name="namesForm" initialValues={initialNames} onFinish={(values) => onSubmit(values)} encType="multipart/form-data" form={form}>
          <Form.List name="names">
            {(fields, { add, remove }, { errors }) => (
              <>
                {fields.map((field, index) => (
                  <Form.Item key={field.key} className="name-form-item">
                    <Form.Item
                      {...field}
                      validateTrigger={['onChange', 'onBlur']}
                      rules={[
                        {
                          required: true,
                          message: "Please enter a name or delete this field.",
                        },
                      ]}>
                      <Input placeholder="Plant name" className="name-input" />
                    </Form.Item>
                    {fields.length > 0 ? (<Button type="link" danger className="dynamic-delete-button" onClick={() => remove(field.name)} >Remove</Button>) : null}
                  </Form.Item>
                ))}

                <Form.Item>
                  <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />}>Add Name</Button>
                  <Form.ErrorList errors={errors} />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit"> Submit</Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Form>
      </Modal>
    </>
  );

}
export default UpdateNameModal