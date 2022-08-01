import { Modal, Button, message, Typography } from "antd";
import axios from "axios";
import "./UploadImage.css";
import { useEffect, useState } from 'react';
const { Title } = Typography;

function UploadImage(props) {

    const [visible, setVisible] = useState(false);
    const [imageFile, setImageFile] = useState(null);   //the file selected in the form.
    const [currentImageComponents, setCurrentImageComponents] = useState(null); //components for the plants existing images

    //gets the field names from the server for this plants images.
    async function getPlantImages() {

        //show the modal
        toggleShowModal();

        let tempComponents = [] //hold the components to be mapped.

        //get the image names and map them to <img> components.
        await axios.get(`/api/plant/images/${props.PlantID}`)
            .then(response => {
                console.log(response.data)
                tempComponents = response.data.map((image) =>
                    <img key={image.key} src={image.url} alt={image.key} onClick={()=> deleteImage(image.key)}></img>
                )
            })
        setCurrentImageComponents(tempComponents)   //update the state with the components.
    }

    async function deleteImage(key){
        await(axios.delete(`/api/plant/images/delete/${props.PlantID}/${key}`))
        .then(response => {
            if (response.status===200){
                message.success("Image Deleted")
                setVisible(false);
            }
        })
    }

    //toggles modal visibility
    function toggleShowModal() {
        setVisible(!visible);
    }

    //when the form is submitted
    async function handleOk(e) {
        //create a formdata object to send to the server
        const formData = new FormData();
        formData.append('plant-image', imageFile)   //add the image file to the formdata object

        //post the data to the server
        await axios.post(`/api/upload/${props.PlantID}`, formData)
            .then(response => {
                if (response.status === 200) {
                    message.success("Image Uploaded!");
                    toggleShowModal();
                }
            })
    }

    //update the state when the file is selected
    function handleChange(e) {
        setImageFile(e.target.files[0])
    }

    return (
        <>
            <Button onClick={() => getPlantImages()}>Upload Image</Button>
            <Modal
                footer={[<Button onClick={() => handleOk()}>Upload</Button>]}
                title="View/Edit Plant"
                visible={visible}
                onCancel={() => toggleShowModal()}
                onOk={() => handleOk()}>
                <form enctype="multipart/form-data" id="upload-form">
                    <Title level={3}>Remove Images</Title>
                    {currentImageComponents}
                    <Title level={3}>Upload New Images</Title>
                    <input type="file" name="plant-image" required onChange={(e) => handleChange(e)} />
                </form>
            </Modal>
        </>
    )
}

export default UploadImage;