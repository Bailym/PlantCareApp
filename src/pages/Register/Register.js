import React from 'react';
import { withRouter } from "react-router-dom";
import { BrowserRouter as Router, Link } from 'react-router-dom';
import 'antd/dist/antd.css';
import { Form, Input, Button, Row, message, Card, Typography } from 'antd';
import MediaQuery from 'react-responsive'
import FormItem from 'antd/lib/form/FormItem';
const axios = require('axios');
const { Title } = Typography;
var sha512 = require('js-sha512');


class Register extends React.Component {


  /*
  * Reads in the values entered on the form.
  * Checks each field is valid 
  * Sends valid data to server
  * Insterts valid data into MySQL database
  * Handles any errors
  */
  handleSubmit = async (e) => {
    //Entered Values from the form
    var emailOne = document.getElementById("emailOne").value;
    var emailTwo = document.getElementById("emailTwo").value;
    var passwordOne = document.getElementById("passwordOne").value;
    var passwordTwo = document.getElementById("passwordTwo").value;
    var firstName = document.getElementById("firstName").value;
    var surname = document.getElementById("surname").value;
    
    //Validation
    let isValidated = true; 

    //empty fields
    if (emailOne === "" || emailTwo === "" || passwordOne === "" | passwordTwo === "") {
      message.info("Please enter a valid email and password");
      isValidated = false;
    }

    //email format test
    let regexEmail = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;

    if (regexEmail.test(emailTwo) === false || regexEmail.test(emailTwo) === false){
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

    if (isValidated) {
      //Hash the entered password
      passwordOne = sha512.update(passwordOne);
      passwordOne = passwordOne.hex();


      //Send details to server 
      await axios.post(`/api/register/${emailOne}/${passwordOne}/${firstName}/${surname}`)
      .then(response => {
        console.log(response.data);
        //if server returns an error
        if(response.data.code){
          //handle each error individually
          switch(response.data.errno){
            case 1062:
              message.info("Could not create account - An Account with this email already exists");
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
          this.props.history.push("login");
          window.location.reload()
        }
      })
    }
  }

  render() {
    return (
      <Router>

        <MediaQuery minDeviceWidth={1025}>
          <Card bordered={true} style={{ width: "30%", backgroundColor: "#9dfac1", margin: "auto", marginTop: "5%", border: "2px solid black", borderRadius: "20px" }}>
            <Row style={{ paddingTop: "5%" }}>
              <Form style={{ textAlign: "center", margin: "auto" }}>
                <Title style={{ margin: "5% auto" }}>Register</Title>
                <Form.Item>
                  <Input id="firstName"
                    placeholder="First Name" 
                    maxLength = {45}/>
                </Form.Item>
                <Form.Item>
                  <Input id="surname"
                    placeholder="Surname"
                    maxLength = {45} />
                </Form.Item>
                <Form.Item>
                  <Input id="emailOne"
                    placeholder="Email"
                    maxLength = {255} />
                </Form.Item>
                <Form.Item>
                  <Input id="emailTwo"
                    placeholder="Confirm Email"
                    maxLength = {255} />
                </Form.Item>
                <Form.Item>
                  <Input id="passwordOne"
                    type="password"
                    placeholder="Password"
                    maxLength = {512} />
                </Form.Item>
                <Form.Item>
                  <Input id="passwordTwo"
                    type="password"
                    placeholder="Confirm Password"
                    maxLength = {255} />
                </Form.Item>
                <FormItem>
                  <Button type="primary" id="register" onClick={this.handleSubmit}>Register</Button>
                </FormItem>
                <FormItem>
                  <Link to="/recover" onClick={() => {
                    this.props.history.push("/recover")
                    window.location.reload()
                  }}>Forgot Password</Link>
                </FormItem>
                <FormItem>
                  <Link to="/login" onClick={() => {
                    this.props.history.push("/login")
                    window.location.reload()
                  }}>Already have an account? Login here.</Link>
                </FormItem>
              </Form>
            </Row>
          </Card>
        </MediaQuery>

        <MediaQuery minDeviceWidth={641} maxDeviceWidth={1024}>
          <Card bordered={true} style={{ width: "60%", backgroundColor: "#9dfac1", margin: "10% auto 0 auto ", border: "2px solid black", borderRadius: "20px" }}>
            <Row style={{ paddingTop: "5%" }}>
              <Form style={{ textAlign: "center", margin: "auto", minWidth: "100%" }}>
                <Title style={{ margin: "5% auto" }}>Register</Title>
                <Form.Item>
                  <Input id="firstName"
                    placeholder="First Name"
                    size="large" />
                </Form.Item>
                <Form.Item>
                  <Input id="surname"
                    placeholder="Surname"
                    size="large" />
                </Form.Item>
                <Form.Item>
                  <Input id="emailOne"
                    placeholder="Email"
                    size="large" />
                </Form.Item>
                <Form.Item>
                  <Input id="emailTwo"
                    placeholder="Confirm Email"
                    size="large" />
                </Form.Item>
                <Form.Item>
                  <Input id="passwordOne"
                    type="password"
                    placeholder="Password"
                    size="large" />
                </Form.Item>
                <Form.Item>
                  <Input id="passwordTwo"
                    type="password"
                    placeholder="Confirm Password"
                    size="large" />
                </Form.Item>
                <FormItem>
                  <Button type="primary"
                    id="register"
                    onClick={this.handleSubmit}
                    size="large">Register</Button>
                </FormItem>
                <FormItem>
                  <Link to="/recover" onClick={() => {
                    this.props.history.push("/recover")
                    window.location.reload()
                  }}>Forgot Password</Link>
                </FormItem>
                <FormItem>
                  <Link to="/login" onClick={() => {
                    this.props.history.push("/login")
                    window.location.reload()
                  }}>Already have an account? Login here.</Link>
                </FormItem>
              </Form>
            </Row>
          </Card>
        </MediaQuery>



        <MediaQuery maxDeviceWidth={640}>
          <Card bordered={true} style={{ width: "85%", backgroundColor: "#9dfac1", margin: "10% auto 0 auto ", border: "2px solid black", borderRadius: "20px" }}>
            <Row style={{ paddingTop: "5%" }}>
              <Form style={{ textAlign: "center", margin: "auto" }}>
                <Title style={{ margin: "5% auto" }}>Register</Title>
                <Form.Item>
                  <Input id="firstName"
                    placeholder="First Name"
                    size="large" />
                </Form.Item>
                <Form.Item>
                  <Input id="surname"
                    placeholder="Surname"
                    size="large" />
                </Form.Item>
                <Form.Item>
                  <Input id="emailOne"
                    placeholder="Email"
                    size="large" />
                </Form.Item>
                <Form.Item>
                  <Input id="emailTwo"
                    placeholder="Confirm Email"
                    size="large" />
                </Form.Item>
                <Form.Item>
                  <Input id="passwordOne"
                    type="password"
                    placeholder="Password"
                    size="large" />
                </Form.Item>
                <Form.Item>
                  <Input id="passwordTwo"
                    type="password"
                    placeholder="Confirm Password"
                    size="large" />
                </Form.Item>
                <FormItem>
                  <Button type="primary"
                    id="register"
                    onClick={this.handleSubmit}
                    size="large">Register</Button>
                </FormItem>
                <FormItem>
                  <Link to="/recover" onClick={() => {
                    this.props.history.push("/recover")
                    window.location.reload()
                  }}>Forgot Password</Link>
                </FormItem>
                <FormItem>
                  <Link to="/login" onClick={() => {
                    this.props.history.push("/login")
                    window.location.reload()
                  }}>Already have an account? Login here.</Link>
                </FormItem>
              </Form>
            </Row>
          </Card>
        </MediaQuery>
      </Router>
    );
  }
}


export default withRouter(Register);



