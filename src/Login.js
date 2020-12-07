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

            //Once a user has been found. Check the user Type (Admin/Standard) to see which home page to show
            await axios.get('/api/usertype')  //Make an API call to check the Type of the logged in User
              .then(response => {
                
                //If the logged in user is a Standard User
                if (response.data === "User") {
                  this.props.history.push("/home"); //Redirect them to Home as they arent permitted to access Settings
                  window.location.reload();
                }
                else if(response.data == "Admin"){
                  this.props.history.push("/admin") //Redirect to admin page
                  window.location.reload();
                }
                else{
                  window.location.reload();
                }
              })
              //Catch any errors
              .catch(function (error) {
                console.log(error);
              })
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
          <Card bordered={true} style={{ width: "30%", backgroundColor: "#9dfac1", margin: "auto", marginTop: "10%", border: "2px solid black", borderRadius: "20px" }}>
            <Row style={{ paddingTop: "5%" }}>
              <Form style={{ textAlign: "center", margin: "auto" }}>
                <Title style={{ margin: "5% auto" }}>Login</Title>
                <Form.Item>
                  <Input id="email" prefix={<UserOutlined />}
                    placeholder="Email" />
                </Form.Item>
                <Form.Item>
                  <Input id="password"
                    prefix={<LockOutlined />}
                    type="password"
                    placeholder="Password" />
                </Form.Item>
                <FormItem>
                  <Button type="primary" id="login" onClick={this.handleSubmit}>Log in</Button>
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
          <Card bordered={true} style={{ width: "60%", backgroundColor: "#9dfac1", margin: "30% auto 0 auto ", border: "2px solid black", borderRadius: "20px" }}>
            <Row style={{ paddingTop: "5%" }}>
              <Form style={{ textAlign: "center", margin: "auto", minWidth: "100%" }}>
                <Title style={{ margin: "5% auto" }}>Login</Title>
                <Form.Item>
                  <Input id="email" prefix={<UserOutlined />}
                    placeholder="Username"
                    size="large" />
                </Form.Item>
                <Form.Item>
                  <Input id="password"
                    prefix={<LockOutlined />}
                    type="password"
                    placeholder="Password"
                    size="large" />
                </Form.Item>
                <FormItem>
                  <Button type="primary" size="large" id="login" onClick={this.handleSubmit}>Log in</Button>
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
          <Card bordered={true} style={{ width: "85%", backgroundColor: "#9dfac1", margin: "30% auto 0 auto ", border: "2px solid black", borderRadius: "20px" }}>
            <Row style={{ paddingTop: "5%" }}>
              <Form style={{ textAlign: "center", margin: "auto" }}>
                <Title style={{ margin: "5% auto" }}>Login</Title>
                <Form.Item>
                  <Input id="email" prefix={<UserOutlined />}
                    placeholder="Username"
                    size="large" />
                </Form.Item>
                <Form.Item>
                  <Input id="password"
                    prefix={<LockOutlined />}
                    type="password"
                    placeholder="Password"
                    size="large" />
                </Form.Item>
                <FormItem>
                  <Button type="primary" size="large" id="login" onClick={this.handleSubmit}>Log in</Button>
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



