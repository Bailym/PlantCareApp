import React from 'react';
import 'antd/dist/antd.css';
import { Link } from 'react-router-dom';
import { Form, Input, Button, message, Typography } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import MediaQuery from 'react-responsive'
const axios = require('axios');
const { Title, Text } = Typography;




class Account extends React.Component {

  state = {
    loggedInUserID: -1, //The ID of the currently logged in user. 
    loggedInUserDetails: [] //The details of the currently logged in user
  }

  render() {
    return (
      <div>
        <MediaQuery minDeviceWidth={1025}>
          <div id="container" style={{ width: "80%", margin: "auto", height: "100%" }}>
            <Title style={{ textAlign: "center" }}>Account</Title>
            <Form style={{ textAlign: "center", margin: "auto" }}>
              <Form.Item>
                <Input
                  addonBefore={<Text>First Name</Text>}
                  id="firstName"
                  placeholder="First Name" />
              </Form.Item>
              <Form.Item>
                <Input
                  addonBefore={<Text>Surname</Text>}
                  id="surname"
                  placeholder="Surname" />
              </Form.Item>
              <Form.Item>
                <Input
                  addonBefore={<Text>Email</Text>}
                  id="email"
                  placeholder="Email"
                  disabled />
              </Form.Item>
              <Form.Item>
                <Input
                  addonBefore={<Text>Password</Text>}
                  id="password"
                  type="password"
                  placeholder="Password"
                  disabled />
              </Form.Item>
              <FormItem>
                <Link to="/recover" onClick={() => {
                  this.props.history.push("/recover")
                  window.location.reload()
                }}>Reset Password</Link>
              </FormItem>
              <FormItem>
                <Button type="primary" id="updateChanges" onClick={() => this.updateDetails()}>Update</Button>
              </FormItem>
            </Form>
          </div>
        </MediaQuery>


        <MediaQuery minDeviceWidth={641} maxDeviceWidth={1024}>
          <div id="container" style={{ width: "80%", margin: "auto", height: "100%" }}>
            <Title style={{ textAlign: "center" }}>Account</Title>
            <Form style={{ textAlign: "center", margin: "auto" }}>
              <Form.Item>
                <Input
                  addonBefore={<Text>First Name</Text>}
                  id="firstName"
                  placeholder="First Name"
                  size="large" />
              </Form.Item>
              <Form.Item>
                <Input addonBefore={<Text>Surname</Text>}
                  id="surname"
                  placeholder="Surname"
                  size="large" />
              </Form.Item>
              <Form.Item>
                <Input
                  addonBefore={<Text>Email</Text>}
                  id="email"
                  placeholder="Email"
                  size="large"
                  disabled />
              </Form.Item>
              <Form.Item>
                <Input
                  addonBefore={<Text>Password</Text>}
                  id="password"
                  type="password"
                  placeholder="Password"
                  size="large"
                  disabled />
              </Form.Item>
              <FormItem>
                <Link to="/recover" onClick={() => {
                  this.props.history.push("/recover")
                  window.location.reload()
                }}>Reset Password</Link>
              </FormItem>
              <FormItem>
                <Button type="primary" id="updateChanges" onClick={() => this.updateDetails()}>Update</Button>
              </FormItem>
            </Form>
          </div>
        </MediaQuery>


        <MediaQuery maxDeviceWidth={640}>
          <div id="container" style={{ width: "80%", margin: "auto", height: "100%" }}>
            <Title style={{ textAlign: "center" }}>Account</Title>
            <Form style={{ textAlign: "center", margin: "auto" }}>
              <Form.Item>
                <Input
                  addonBefore={<Text>First Name</Text>}
                  id="firstName"
                  placeholder="First Name"
                  size="large" />
              </Form.Item>
              <Form.Item>
                <Input
                  addonBefore={<Text>Surname</Text>}
                  id="surname"
                  placeholder="Surname"
                  size="large" />
              </Form.Item>
              <Form.Item>
                <Input
                  addonBefore={<Text>Email</Text>}
                  id="email"
                  placeholder="Email"
                  size="large"
                  disabled />
              </Form.Item>
              <Form.Item>
                <Input
                  addonBefore={<Text>Password</Text>}
                  id="password"
                  type="password"
                  placeholder="Password"
                  size="large"
                  disabled />
              </Form.Item>
              <FormItem>
                <Link to="/recover" onClick={() => {
                  this.props.history.push("/recover")
                  window.location.reload()
                }}>Reset Password</Link>
              </FormItem>
              <FormItem>
                <Button type="primary" id="updateChanges" onClick={() => this.updateDetails()}>Update</Button>
              </FormItem>
            </Form>
          </div>
        </MediaQuery>
      </div>

    );
  }

  async componentDidMount() {

    /* 
     * Check that a user is logged in.
     * FALSE = Return to Login Page 
     * Otherwise store the ID of the logged in user
    */
    await axios.get('/api/checkuser')  //call the server endpoint
      .then(response => {
        if (response.data === false) {   //if false redirect to login (you are not logged in.)
          this.props.history.push("/login");
          window.location.reload();
        }
        else {  //else save the users id
          this.setState({
            loggedInUserID: response.data.userID
          })
        }
      })
      .catch(function (error) {
        console.log(error);
      })

    //Look up the logged in user and save their details to component state
    await axios.get(`/api/users/${this.state.loggedInUserID}`)  //call the server endpoint
      .then(response => {
        //Update the state with the users data.
        this.setState({
          loggedInUserID: this.state.loggedInUserID,
          loggedInUserDetails: response.data[0]
        }, () => this.getDetails())
      })
      .catch(function (error) {
        console.log(error);
      })
  }

  //Populates the form with the users data once it has been retrieved
  getDetails = () => {
    document.getElementById("firstName").value = this.state.loggedInUserDetails.FirstName
    document.getElementById("surname").value = this.state.loggedInUserDetails.Surname
    document.getElementById("email").value = this.state.loggedInUserDetails.Email
    document.getElementById("password").value = this.state.loggedInUserDetails.Password
  }

  //Updates the users data in the database with the values specified in the form.
  updateDetails = async () => {
    var newFirstName = document.getElementById("firstName").value
    var newSurname = document.getElementById("surname").value
    var newEmail = document.getElementById("email").value = this.state.loggedInUserDetails.Email
    var newPassword = document.getElementById("password").value = this.state.loggedInUserDetails.Password

    //Validation
    let isValidated = true;

    //empty fields
    if (newFirstName === "" || newSurname === "" || newEmail === "" | newPassword === "") {
      message.info("Please fill in all fields");
      isValidated = false;
    }

    //email format test
    let regexEmail = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;

    if (regexEmail.test(newEmail) === false) {
      message.info("Email format is invalid");
      isValidated = false;
    }

    if (isValidated) {
      //update the users details
      await axios.post(`/api/users/updateuser/${this.state.loggedInUserID}/${newFirstName}/${newSurname}/${newEmail}/${newPassword}`)  //call the server endpoint
        .then(function (response) {
          message.info("Account Details Updated!")
        })
        .catch(function (error) {
          message.info("Account details could not be updated")
        })
    }
  }


}





export default Account;
