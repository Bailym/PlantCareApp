import React from 'react';
import { withRouter } from "react-router-dom";
import { BrowserRouter as Router, Link } from 'react-router-dom';
import 'antd/dist/antd.css';
import { Form, Input, Button, Row, message, Card, Typography } from 'antd';
import MediaQuery from 'react-responsive'
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import FormItem from 'antd/lib/form/FormItem';
const axios = require('axios');
const { Title } = Typography;
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
      message.info("Please enter a valid email and password");
    }
    else {
      //Hash the entered password
      password = sha512.update(password);
      password = password.hex();
      //Check credentials 
      await axios.post(`/api/login/${email}/${password}`)
        .then(async response => {
          //If credentials match send to home
          if (response.data === true) {

            this.props.history.push("/home")
            window.location.reload();

          }
          //Else show message
          else {
            message.info("Login details invalid - Please make sure you have entered your details correctly");
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
          <Card bordered={true} style={{ width: "100vw", backgroundColor: "#9dfac1", height:"100%",
            background: "rgb(157,250,193)",
            background: "linear-gradient(90deg, rgba(157,250,193,1) 35%, rgba(191,242,245,1) 100%)" }}>
            <Row style={{ paddingTop: "5%" }}>
              <Form style={{ textAlign: "center", margin: "auto", minWidth:"40%" }}>
                <Title style={{ margin: "5% auto" }}>Login</Title>
                <Form.Item>
                  <Input id="email" prefix={<UserOutlined />}
                    placeholder="Email"
                    style={{ borderRadius: "10px" }} />
                </Form.Item>
                <Form.Item>
                  <Input id="password"
                    prefix={<LockOutlined />}
                    type="password"
                    placeholder="Password"
                    style={{ borderRadius: "10px" }} />
                </Form.Item>
                <FormItem>
                  <Button type="primary" id="login" onClick={this.handleSubmit} style={{ width: "100%", borderRadius: "10px" }}>Log in</Button>
                </FormItem>
                <FormItem>
                  <Link to="/recover" onClick={() => {
                    this.props.history.push("/recover")
                    window.location.reload()
                  }}>Forgot Password</Link>
                </FormItem>
                <FormItem>
                  <Link to="/register" onClick={() => {
                    this.props.history.push("/register")
                    window.location.reload()
                  }}>Dont have an account? Register here.</Link>
                </FormItem>
              </Form>
            </Row>
          </Card>
        </MediaQuery>

        <MediaQuery minDeviceWidth={641} maxDeviceWidth={1024}>
          <Card bordered={true} style={{ width: "100vw", backgroundColor: "#9dfac1", height:"100%",
            background: "rgb(157,250,193)",
            background: "linear-gradient(90deg, rgba(157,250,193,1) 35%, rgba(191,242,245,1) 100%)" }}>
            <Row style={{ paddingTop: "1%" }}>
              <Form style={{ textAlign: "center", margin: "auto", minWidth: "50%", height: "40vh" }}>
                <Title style={{ marginTop: "5%" }}>Login</Title>
                <Form.Item style={{ marginTop: "2vh" }}>
                  <Input id="email" prefix={<UserOutlined />}
                    style={{ borderRadius: "10px" }}
                    placeholder="Username"
                    size="large"
                    style={{ borderRadius: "10px" }} />
                </Form.Item>
                <Form.Item>
                  <Input id="password"
                    style={{ borderRadius: "10px" }}
                    prefix={<LockOutlined />}
                    type="password"
                    placeholder="Password"
                    size="large"
                    style={{ borderRadius: "10px" }} />
                </Form.Item>
                <FormItem>
                  <Button type="primary" size="large" id="login" onClick={this.handleSubmit} style={{ width: "100%", borderRadius: "10px" }}>Log in</Button>
                </FormItem>
                <FormItem>
                  <Link to="/recover" onClick={() => {
                    this.props.history.push("/recover")
                    window.location.reload()
                  }}>Forgot Password</Link>
                </FormItem>
                <FormItem>
                  <Link to="/register" onClick={() => {
                    this.props.history.push("/register")
                    window.location.reload()
                  }}>Dont have an account? Register here.</Link>
                </FormItem>
              </Form>
            </Row>
          </Card>
        </MediaQuery>



        <MediaQuery maxDeviceWidth={640}>
          <Card bordered={true} style={{
            width: "100vw", backgroundColor: "#9dfac1", height:"100%",
            background: "rgb(157,250,193)",
            background: "linear-gradient(90deg, rgba(157,250,193,1) 35%, rgba(191,242,245,1) 100%)"
          }}>
            <Row style={{ paddingTop: "5%" }}>
              <Form style={{ textAlign: "center", margin: "auto" }}>
                <Title style={{ margin: "5% auto" }}>Login</Title>
                <Form.Item>
                  <Input id="email" prefix={<UserOutlined />}
                    placeholder="Username"
                    size="large"
                    style={{ borderRadius: "10px" }} />
                </Form.Item>
                <Form.Item>
                  <Input id="password"
                    prefix={<LockOutlined />}
                    type="password"
                    placeholder="Password"
                    size="large"
                    style={{ borderRadius: "10px" }} />
                </Form.Item>
                <FormItem >
                  <Button type="primary" size="large" id="login" onClick={this.handleSubmit} style={{ width: "100%", borderRadius: "10px" }}>Log in</Button>
                </FormItem>
                <FormItem>
                  <Link to="/recover" onClick={() => {
                    this.props.history.push("/recover")
                    window.location.reload()
                  }}>Forgot Password</Link>
                </FormItem>
                <FormItem>
                  <Link to="/register" onClick={() => {
                    this.props.history.push("/register")
                    window.location.reload()
                  }}>Dont have an account? Register here.</Link>
                </FormItem>
              </Form>
            </Row>
          </Card>
        </MediaQuery>

      </Router>
    );
  }
}


export default withRouter(Login);



