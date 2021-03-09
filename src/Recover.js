import React from 'react';
import { withRouter } from "react-router-dom";
import { BrowserRouter as Router, Link } from 'react-router-dom';
import 'antd/dist/antd.css';
import { Form, Input, Button, Row, message, Card, Typography } from 'antd';
import MediaQuery from 'react-responsive'
import {UserOutlined } from '@ant-design/icons';
import FormItem from 'antd/lib/form/FormItem';
const axios = require('axios');
const { Title } = Typography;

class Recover extends React.Component {


  /*
  * 
  */
  handleSubmit = async (e) => {
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
          if(response.data.length === 1){

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

render() {
  return (
    <Router>

      <MediaQuery minDeviceWidth={1025}>
        <Card bordered={true} style={{ width: "30%", backgroundColor: "#9dfac1", margin: "auto", marginTop: "10%", border: "2px solid black", borderRadius: "20px" }}>
          <Row style={{ paddingTop: "5%" }}>
            <Form style={{ textAlign: "center", margin: "auto" }}>
              <Title style={{ margin: "5% auto" }}>Recover Password</Title>
              <Form.Item>
                <Input id="email" prefix={<UserOutlined />}
                  placeholder="Email" />
              </Form.Item>
              <FormItem>
                  <Button type="primary" id="recover" onClick={this.handleSubmit}>Send Email</Button>
                </FormItem>
              <FormItem>
                <Link to="/login" onClick={() => {
                  this.props.history.push("/login")
                  window.location.reload()
                }}>Back to Login</Link>
              </FormItem>
            </Form>
          </Row>
        </Card>
      </MediaQuery>

      <MediaQuery minDeviceWidth={641} maxDeviceWidth={1024}>
        <Card bordered={true} style={{ width: "60%", backgroundColor: "#9dfac1", margin: "30% auto 0 auto ", border: "2px solid black", borderRadius: "20px" }}>
          <Row style={{ paddingTop: "5%" }}>
            <Form style={{ textAlign: "center", margin: "auto", minWidth: "100%" }}>
              <Title style={{ margin: "5% auto" }}>Recover Password</Title>
              <Form.Item>
                <Input id="email" prefix={<UserOutlined />}
                  placeholder="Email"
                  size="large" />
              </Form.Item>
              <FormItem>
                  <Button type="primary" id="recover" size="large" onClick={this.handleSubmit}>Send Email</Button>
                </FormItem>
              <FormItem>
                <Link to="/login" onClick={() => {
                  this.props.history.push("/login")
                  window.location.reload()
                }}>Back to Login</Link>
              </FormItem>
            </Form>
          </Row>
        </Card>
      </MediaQuery>



      <MediaQuery maxDeviceWidth={640}>
        <Card bordered={true} style={{ width: "85%", backgroundColor: "#9dfac1", margin: "30% auto 0 auto ", border: "2px solid black", borderRadius: "20px" }}>
          <Row style={{ paddingTop: "5%" }}>
            <Form style={{ textAlign: "center", margin: "auto" }}>
              <Title style={{ margin: "5% auto" }}>Recover Password</Title>
              <Form.Item>
                <Input
                  id="email"
                  placeholder="Email"
                  size="large" />
              </Form.Item>
              <FormItem>
                  <Button type="primary" id="recover" size="large" onClick={this.handleSubmit}>Send Email</Button>
                </FormItem>
              <FormItem>
                <Link to="/login" onClick={() => {
                  this.props.history.push("/login")
                  window.location.reload()
                }}>Back to Login</Link>
              </FormItem>
            </Form>
          </Row>
        </Card>
      </MediaQuery>

    </Router>
  );
}
}


export default withRouter(Recover);



