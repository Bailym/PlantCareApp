import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import 'antd/dist/antd.css';
import './Register.css';
import { Form, Input, Button, Row, message, Card, Typography } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
const axios = require('axios');
const { Title } = Typography;
var sha512 = require('js-sha512');

function Register() {

  const history = useHistory();

  function validateForm(){
    //Validation
    let isValidated = true;

    //Entered Values from the form
    var emailOne = document.getElementById("emailOne").value;
    var emailTwo = document.getElementById("emailTwo").value;
    var passwordOne = document.getElementById("passwordOne").value;
    var passwordTwo = document.getElementById("passwordTwo").value;
    var firstName = document.getElementById("firstName").value;
    var surname = document.getElementById("surname").value;

    //empty fields
    if (emailOne === "" || emailTwo === "" || passwordOne === "" | passwordTwo === "") {
      message.info("Please enter a valid email and password");
      isValidated = false;
    }

    //email format test
    let regexEmail = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;

    if (regexEmail.test(emailTwo) === false || regexEmail.test(emailTwo) === false) {
      message.info("Email format is invalid");
      isValidated = false;
    }

    //match emails
    if (emailOne !== emailTwo) {
      message.info("Emails do not match");
      isValidated = false;
    }

    //match passwords
    if (passwordOne !== passwordTwo) {
      message.info("Passwords do not match");
      isValidated = false;
    }

    return {"valid": isValidated, "email": emailOne, "password": passwordOne, "firstName": firstName, "surname": surname};
  }

  /*
  * Reads in the values entered on the form.
  * Checks each field is valid 
  * Sends valid data to server
  * Insterts valid data into MySQL database
  * Handles any errors
  */
  async function handleSubmit(e) {

    let formData = validateForm();
    
    if (formData.valid === true) {
      
      //Hash the entered password
      let hashedPassword = sha512.update(formData.password);
      hashedPassword = hashedPassword.hex();

      //Send details to server 
      await axios.post(`/api/register/${formData.email}/${hashedPassword}/${formData.firstName}/${formData.surname}`)
        .then(response => {
          //if server returns an error
          if (response.data.errno) {
            //handle each error individually
            switch (response.data.errno) {
              case 1062:
                message.info("Could not create account - An account with this email already exists");
                break;
              //default case
              default:
                message.info("Could not create account");
            }
          }
          //if server does not return an error
          else {
            //show a message and return to login
            message.info("Account Created!");
            history.push("login");
          }
        })
    }
  }

  return (
    <Form id="register-form">
      <Title>Register</Title>
      <Form.Item>
        <Input id="firstName"
          placeholder="First Name"
          maxLength={45} />
      </Form.Item>
      <Form.Item>
        <Input id="surname"
          placeholder="Surname"
          maxLength={45} />
      </Form.Item>
      <Form.Item>
        <Input id="emailOne"
          placeholder="Email"
          maxLength={128} />
      </Form.Item>
      <Form.Item>
        <Input id="emailTwo"
          placeholder="Confirm Email"
          maxLength={128} />
      </Form.Item>
      <Form.Item>
        <Input id="passwordOne"
          type="password"
          placeholder="Password"
          maxLength={512} />
      </Form.Item>
      <Form.Item>
        <Input id="passwordTwo"
          type="password"
          placeholder="Confirm Password"
          maxLength={512} />
      </Form.Item>
      <FormItem>
        <Button type="primary" id="register" onClick={() => handleSubmit()}>Register</Button>
      </FormItem>
      <FormItem>
        <Link to="/recover" onClick={() => {
          history.push("/recover")
        }}>Forgot Password</Link>
      </FormItem>
      <FormItem>
        <Link to="/login" onClick={() => {
          history.push("/login")
        }}>Already have an account? Login here.</Link>
      </FormItem>
    </Form>)
}

export default Register



