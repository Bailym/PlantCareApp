import { useState } from 'react';
import 'antd/dist/antd.css';
import { Modal, message, Button, Form, Image, Upload } from 'antd';
import { MinusCircleOutlined, UploadOutlined } from '@ant-design/icons';
const axios = require('axios');

function UpdateImageModal(props) {
  const [visible, setVisible] = useState(false);
  const [newImages, setNewImages] = useState([]);
  const [imageComponents, setImageComponents] = useState([]);


  //toggles modal visibility
  function toggleShowModal() {
    setVisible(!visible);

    getImageData()
  }

  /*
  * callback for when the form is submitted
  * Reads the values from the form and sends them to the server 
  * The server INSERTS/UPDATES the names and the form is closed
  */
  async function onFinish(values) {

    var existingImageNames = values.names
    var newImages = this.state.newImages

    //post the data from the form
    await axios.post(`/api/plant/images/update/${props.PlantID}/`, { "newImages": newImages, "existingImageNames": existingImageNames })

    toggleShowModal();
  }

  /*
 * Method to show the modal.
 * Sets visible to true.
 */
  async function getImageData() {
    var images = { names: [] }
    //get the image paths for images assosciated with this plant
    await axios.get(`/api/plant/images/${props.PlantID}`)
      .then(response => {
        for (var i = 0; i < response.data.length; i++) {
          images.names.push(response.data[i].ImagePath)
        }
      })


    //render the form 
    setImageComponents([
      <Form onFinish={() => onFinish()} initialValues={images}>
        <Form.List style={{ overflow: "scroll" }}>
          {(fields, { add, remove }, { errors }) => (
            <>
              {fields.map((field, index) => (
                <Form.Item required={false} key={field.key} style={{ display: "inline-block", marginLeft: "2%" }}>
                  <Form.Item {...field}>
                    <Image style={{ border: "1px solid #000" }} width={100} src={"/images/" + images.names[field.name]} />
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
                    let tempNewImages = [];

                    if (info.file.status === 'done') {
                      message.success(`${info.file.name} file uploaded successfully`);
                      tempNewImages.push(info.file.name)

                    } else if (info.file.status === 'error') {
                      message.error(`${info.file.name} file upload failed.`);
                    }
                    setNewImages(tempNewImages);

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
      </Form>])
  };

  return (
    <>
      <Button onClick={()=>toggleShowModal()}>VIEW IMAGES</Button>
      <Modal
        title="View/Edit Plant Images"
        visible={visible}
        key={"image" + props.PlantID}
        onCancel={() => toggleShowModal()}
        footer={[
          <Button style={{ display: "inline-block" }} key="back" onClick={() => toggleShowModal()}>Cancel</Button>,
        ]}
      >
        {imageComponents}
      </Modal>
    </>
  );
}

export default UpdateImageModal