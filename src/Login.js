import React from 'react';
import { withRouter } from "react-router-dom";
import { BrowserRouter as Router } from 'react-router-dom';
import 'antd/dist/antd.css';
import { Form, Input, Button, Row, message } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import FormItem from 'antd/lib/form/FormItem';
const axios = require('axios');
var sha512 = require('js-sha512');


class Login extends React.Component {


/*
* When the submit button is clicked.
* Read the email and password that have been entered
* If one is not valid then show a message
* Encrypt the entered password and send data to server
* The server then returns TRUE or FALSE
* TRUE - Credentials are correct, show home page
* FALSE - Credentials are incorrect, show message.
*/
  handleSubmit = async (e) => {
    //Entered Values
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
    //Validation
    if (email === "" || password === "") {
      message.info("Please enter a email and password");
    }
    else {
      //Hash the entered password
      password = sha512.update(password);
      password = password.hex();
      //Check credentials 
      await axios.post(`/api/login/${email}/${password}`)
        .then(response => {
          //If credentials match send to home
          if (response.data === true) {
            this.props.history.push("/home");
            window.location.reload();
          }
          //Else show message
          else {
            message.info("Invalid Credentials");
          }
        })
        //error handling
        .catch(function (error) {

        })
    }
  };

  render() {
    return (
      <Router>
          <Row style={{ paddingTop: "5%" }}>
              <Form style={{textAlign: "center", margin:"auto"}}>
                <Form.Item>
                  <Input id="email" prefix={<UserOutlined/>}
                    placeholder="Username" />
                </Form.Item>
                <Form.Item>
                  <Input id="password"
                    prefix={<LockOutlined/>}
                    type="password"
                    placeholder="Password" />
                </Form.Item>
                <FormItem>
                  <Button type="primary" id="login" onClick={this.handleSubmit}>Log in</Button>
                </FormItem>
              </Form>
          </Row>
      </Router>
    );
  }
}


export default withRouter(Login);



