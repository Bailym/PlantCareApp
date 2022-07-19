import React from 'react';
import { Link } from 'react-router-dom';
import 'antd/dist/antd.css';
import './Login.css';
import { Form, Input, Button, message, Typography } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import FormItem from 'antd/lib/form/FormItem';
import { useHistory } from 'react-router-dom';

const axios = require('axios');
const { Title } = Typography;
var sha512 = require('js-sha512');


function Login() {

  const history = useHistory();

  /*
  * When the submit button is clicked.
  * Read the email and password that have been entered
  * If one is not valid then show a message
  * Encrypt the entered password and send data to server
  * The server then returns TRUE or FALSE
  * TRUE - Credentials are correct, show home page
  * FALSE - Credentials are incorrect, show message.
  */
  async function handleSubmit(e) {

    //read the values from the form
    var email = document.getElementById("form-email").value;
    var password = document.getElementById("form-password").value;

    //Validate the items in the form
    //presence check
    if (email === "" || password === "") {
      message.info("Please enter a valid email and password");
    }
    else {
      checkCredentials(email, password);  //else check the credentials against DB
    }
  };

  /*
   * Hashes the entered password and sends it to the server to be checked 
   * If the email/password is correct, show the home page
   * If the email/password is incorrect, show a message
   */ 
  async function checkCredentials(email, password) {
    //Hash the entered password
    password = sha512.update(password);
    password = password.hex();

    //Check credentials 
    await axios.post(`/api/login/${email}/${password}`)
      .then(async response => {
        //If credentials match send to home page
        if (response.data === true) {
          history.push('/home');
        }
        //if they dont match show a message
        else {
          message.info("Login details invalid - Please make sure you have entered your details correctly");
        }
      })
  }

  return (
    <Form id="login-form">
      <Title>Login</Title>
      <Form.Item>
        <Input id="form-email" prefix={<UserOutlined />}
          placeholder="Email" />
      </Form.Item>
      <Form.Item>
        <Input id="form-password"
          prefix={<LockOutlined />}
          type="password"
          placeholder="Password" />
      </Form.Item>
      <FormItem>
        <Button type="primary" id="btn-login" onClick={() => handleSubmit()}>Log in</Button>
      </FormItem>
      <FormItem>
        <Link to="/recover" onClick={() => {
          this.props.history.push("/recover")
          window.location.reload()
        }}>Forgot Password</Link>
      </FormItem>
      <FormItem>
        <Link to="/register" onClick={() => {
        }}>Dont have an account? Register here.</Link>
      </FormItem>
    </Form>
  )
}



export default Login;



