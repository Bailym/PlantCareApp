import { Modal, Button, message } from "antd";
import axios from "axios";
import { useState } from 'react';

function UploadImage(props) {

    const [visible, setVisible] = useState(false);
    const [imageFile, setImageFile] = useState(null);   //the file selected in the form.

    //toggles modal visibility
    function toggleShowModal() {
        setVisible(!visible);
    }

    //when the form is submitted
    async function handleOk() {
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
            <Button onClick={() => toggleShowModal()}>Upload Image</Button>
            <Modal
                footer={[<Button onClick={() => handleOk()}>Upload</Button>]}
                title="View/Edit Plant"
                visible={visible}
                onCancel={() => toggleShowModal()}
                onOk={() => handleOk()}>
                <form enctype="multipart/form-data">
                    <input type="file" name="plant-image" required onChange={(e) => handleChange(e)} />
                </form>
            </Modal>
        </>
    )
}

export default UploadImage;