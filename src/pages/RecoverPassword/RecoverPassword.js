import React from 'react';
import { useHistory, Link } from "react-router-dom";
import 'antd/dist/antd.css';
import "./RecoverPassword.css";
import { Form, Input, Button, message, Typography } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import FormItem from 'antd/lib/form/FormItem';
const axios = require('axios');
const { Title } = Typography;


function RecoverPassword() {

  const history = useHistory();

  async function handleSubmit(e) {
    //Entered Values
    var email = document.getElementById("email").value;


    //Validation

    let isValidated = true;

    //presence check
    if (email === "") {
      message.info("Please enter a valid email and password");
      isValidated = false;
    }

    //email format test
    let regexEmail = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;

    if (regexEmail.test(email) === false) {
      message.info("Email format is invalid");
      isValidated = false;
    }


    //if the form is valid
    if (isValidated) {
      //Check the entered email exists in the system
      await axios.post(`/api/recover/check/${email}`)
        .then(async response => {

          //if the email does exist in the system
          if (response.data.length === 1) {

            let id = response.data[0].UserID; //extract the id

            message.info("Password Recovery Email SENT! - Please check your Inbox and Junk folders")  //show a message and send the email 
            await axios.post(`/api/recover/send/${id}/${email}`);  //SEND THE EMAIL

          }
        })
        //error handling
        .catch(function (error) {

        })
    }
  };

  return (
    <Form id='recover-form'>
      <Title>Recover Password</Title>
      <Form.Item>
        <Input id="email" prefix={<UserOutlined />}placeholder="Email" />
      </Form.Item>
      <FormItem>
        <Button type="primary" id="recover" onClick={() => handleSubmit()}>Send Email</Button>
      </FormItem>
      <FormItem>
        <Link to="/login" onClick={() => {history.push("/login")}}>Back to Login</Link>
      </FormItem>
    </Form>
  )
}

export default RecoverPassword;



