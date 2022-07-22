import { useState, useEffect } from 'react';
import 'antd/dist/antd.css';
import "./Account.css";
import { Link, useHistory } from 'react-router-dom';
import { Form, Input, Button, message, Typography, Spin } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
const axios = require('axios');
const { Title, Text } = Typography;

function Account() {


  const history = useHistory()
  const [form] = Form.useForm();
  const [loggedInUserID, setLoggedInUserID] = useState(0);
  const [loggedInUserDetails, setLoggedInUserDetails] = useState([]);
  const [loading, setLoading] = useState(true);

  /* 
     * Check that a user is logged in.
     * TRUE = Load the page
     * FALSE = Return to Login Page 
     */
  async function checkUser() {
    /* 
     * Check that a user is logged in.
     * FALSE = Return to Login Page 
     * Otherwise store the ID of the logged in user
    */
    await axios.get('/api/checkuser')  //call the server endpoint
      .then(response => {
        if (response.data === false) {   //if false redirect to login (you are not logged in.)
          history.push("/login");
        }
        else {  //else save the users id
          setLoggedInUserID(response.data.userID);
        }
      })
  }

  async function updateDetails() {

    //these two are the only ones that can change here.
    var newFirstName = document.getElementById("firstName").value
    var newSurname = document.getElementById("surname").value


    let formData = validateForm(newFirstName, newSurname);

    if (formData.valid) {
      //update the users details
      await axios.post(`/api/users/updateuser/${loggedInUserID}/${formData.firstName}/${formData.surname}/${loggedInUserDetails.Email}/${loggedInUserDetails.Password}/${loggedInUserDetails.Type}`)  //call the server endpoint
        .then(function (response) {
          message.info("Account Details Updated!")
        })
        .catch(function (error) {
          message.info("Account details could not be updated")
        })
    }
  }

  function validateForm(newFirstName, newSurname) {

    let isValidated = true;

    //empty fields
    if (newFirstName === "" || newSurname === "") {
      message.info("Please fill in all fields");
      isValidated = false;
    }

    return { "valid": isValidated, firstName: newFirstName, surname: newSurname }
  }


  //when first mounting
  useEffect(() => {
    checkUser();
  }, [])

  //when the userID changes (in checkuser)
  useEffect(() => {

    //use the loginID to get the users details
    async function getUserDetails() {
      let details = [];

      await axios.get(`/api/users/${loggedInUserID}`)  //call the server endpoint
        .then(response => {
          //Update the state with the users data.
          details = response.data[0];
        })
      return details;
    }

    if (loggedInUserID !== 0) {
      getUserDetails().then(details => {
        setLoggedInUserDetails(details);
      })

      setLoading(false)
    }

  }, [loggedInUserID])

  useEffect(() => {
    form.setFieldsValue({
      firstName: loggedInUserDetails.FirstName,
      surname: loggedInUserDetails.Surname,
      email: loggedInUserDetails.Email,
      password: loggedInUserDetails.Password,
      type: loggedInUserDetails.Type

    })
  })

  return (
    <Spin spinning={loading}>
      <Title style={{ textAlign: "center" }}>Account</Title>
      <Form style={{ textAlign: "center", margin: "auto" }} form={form}>
        <Form.Item name="firstName">
          <Input
            addonBefore={<Text>First Name</Text>}
            id="firstName"
            placeholder="First Name"
            defaultValue={loggedInUserDetails.FirstName} />
        </Form.Item>
        <Form.Item name="surname">
          <Input
            addonBefore={<Text>Surname</Text>}
            id="surname"
            placeholder="Surname"
            defaultValue={loggedInUserDetails.Surname} />
        </Form.Item>
        <Form.Item name="email">
          <Input
            addonBefore={<Text>Email</Text>}
            id="email"
            placeholder="Email"
            disabled
            defaultValue={loggedInUserDetails.Email} />
        </Form.Item>
        <Form.Item name="type">
          <Input
            addonBefore={<Text>Type</Text>}
            id="type"
            placeholder="Type"
            disabled
            defaultValue={loggedInUserDetails.Type} />
        </Form.Item>
        <FormItem>
          <Link to="/recover" onClick={() => {
            history.push("/recover")
          }}>Reset Password</Link>
        </FormItem>
        <FormItem>
          <Button type="primary" id="updateChanges" onClick={() => updateDetails()}>Update</Button>
        </FormItem>
      </Form>
    </Spin>
  )

}
export default Account;
