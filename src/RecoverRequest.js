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

class RecoverRequest extends React.Component {

  state = {
    userID: null
  }

  render() {
    return (
      <Router>

        <MediaQuery minDeviceWidth={1025}>
          <Card bordered={true} style={{ width: "30%", backgroundColor: "#9dfac1", margin: "auto", marginTop: "10%", border: "2px solid black", borderRadius: "20px" }}>
            <Row style={{ paddingTop: "5%" }}>
              <Form style={{ textAlign: "center", margin: "auto" }}>
                <Title style={{ margin: "5% auto" }}>Reset Password</Title>
                <Form.Item>
                  <Input id="passwordOne"
                    type="password"
                    placeholder="New Password" />
                </Form.Item>
                <Form.Item>
                  <Input id="passwordTwo"
                    type="password"
                    placeholder="Confirm New Password" />
                </Form.Item>
                <FormItem>
                  <Button type="primary" id="confirm" onClick={this.handleSubmit}>Reset Password</Button>
                </FormItem>
              </Form>
            </Row>
          </Card>
        </MediaQuery>

        <MediaQuery minDeviceWidth={641} maxDeviceWidth={1024}>
          <Card bordered={true} style={{ width: "60%", backgroundColor: "#9dfac1", margin: "30% auto 0 auto ", border: "2px solid black", borderRadius: "20px" }}>
            <Row style={{ paddingTop: "5%" }}>
              <Form style={{ textAlign: "center", margin: "auto", minWidth: "100%" }}>
                <Title style={{ margin: "5% auto" }}>Reset Password</Title>
                <Form.Item>
                  <Input id="passwordOne"
                    placeholder="New Password"
                    type="password"
                    size="large" />
                </Form.Item>
                <Form.Item>
                  <Input id="passwordTwo"
                    type="password"
                    placeholder="Confirm New Password"
                    size="large" />
                </Form.Item>
                <FormItem>
                  <Button type="primary" id="confirm" onClick={this.handleSubmit}>Reset Password</Button>
                </FormItem>
              </Form>
            </Row>
          </Card>
        </MediaQuery>



        <MediaQuery maxDeviceWidth={640}>
          <Card bordered={true} style={{ width: "85%", backgroundColor: "#9dfac1", margin: "30% auto 0 auto ", border: "2px solid black", borderRadius: "20px" }}>
            <Row style={{ paddingTop: "5%" }}>
              <Form style={{ textAlign: "center", margin: "auto" }}>
                <Title style={{ margin: "5% auto" }}>Reset Password</Title>
                <Form.Item>
                  <Input id="passwordOne"
                    type="password"
                    placeholder="New Password"
                    size="large" />
                </Form.Item>
                <Form.Item>
                  <Input id="passwordTwo"
                    type="password"
                    placeholder="Confirm New Password"
                    size="large" />
                </Form.Item>
                <FormItem>
                  <Button type="primary" id="confirm" onClick={this.handleSubmit}>Reset Password</Button>
                </FormItem>
              </Form>
            </Row>
          </Card>
        </MediaQuery>
      </Router>
    );
  }

  async componentDidMount() {

    //Retrieve the id parameter from the URL query string. This comes from the link in the reocvery email.
    var urlString = window.location.href; //The entire URL
    var url = new URL(urlString);
    var userID = url.searchParams.get("id");  //the value for the id param

    //hash the id. We dont want the users actual ID visible in the query string.
    var SHAID = sha512.update(userID);
    SHAID = SHAID.hex();

    //show the hashed id in the query string.
    window.history.replaceState(null, null, url.origin + url.pathname + "?id=" + SHAID);

    //update state with the ID, it'll be needed when the user submits
    let tempState = Object.assign({}, this.state)
    tempState.userID = userID;

    this.setState(tempState);

  }

  handleSubmit = async (e) => {
    //Entered Values
    var passwordOne = document.getElementById("passwordOne").value;
    var passwordTwo = document.getElementById("passwordTwo").value;

    //Validation

    let isValidated = true;

    //presence check
    if (passwordOne === "" || passwordTwo === "") {
      message.info("Please enter a password");
      isValidated = false;
    }

    //double entry check
    if (passwordOne !== passwordTwo) {
      message.info("Passwords do not match")
      isValidated = false;
    }

    //if form is valid
    if (isValidated) {
      //Hash the entered password
      passwordOne = sha512.update(passwordOne);
      passwordOne = passwordOne.hex();
      
      //send the new password, and the id of the user to the server to be changed.
      message.info("Password Reset!")
      await axios.post(`/api/users/updatepassword/${this.state.userID}/${passwordOne}`)
      .then(response => {
        //redirect to login
          this.props.history.push("/login");
          window.location.reload();
        })
      //error handling
      .catch(function (error) {
        console.log(error);

      })
    }


  }
};



export default RecoverRequest;
