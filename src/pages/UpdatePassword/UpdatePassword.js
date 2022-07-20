import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import 'antd/dist/antd.css';
import './UpdatePassword.css';
import { Form, Input, Button, message, Typography } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
const axios = require('axios');
const { Title } = Typography;
var sha512 = require('js-sha512');

function UpdatePassword() {

  const history = useHistory();
  const [userID, setUserID] = useState("");

  useEffect(() => {
    console.log("mounted")

    //Retrieve the id parameter from the URL query string. This comes from the link in the reocvery email.
    var urlString = window.location.href; //The entire URL
    var url = new URL(urlString);
    var requestUserID = url.searchParams.get("id");  //the value for the id param

    //hash the id. We dont want the users actual ID visible in the query string.
    var SHAID = sha512.update(userID);
    SHAID = SHAID.hex();

    //show the hashed id in the query string.
    window.history.replaceState(null, null, url.origin + url.pathname + "?id=" + SHAID);

    //update state with the ID, it'll be needed when the user submits
    setUserID(requestUserID);
  }, [])

  function validateForm() {
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


    return { "valid": isValidated, "password": passwordOne, "userID": userID };
  }

  async function handleSubmit(e) {

    let formData = validateForm();

    //if form is valid
    if (formData.valid) {
      //Hash the entered password
      let hashedPassword = sha512.update(formData.password);
      hashedPassword = hashedPassword.hex();

      //send the new password, and the id of the user to the server to be changed.
      message.info("Password Reset!")
      await axios.post(`/api/users/updatepassword/${formData.userID}/${hashedPassword}`)
        .then(response => {
          //redirect to login
          history.push("/login");
        })
    }
  }


  return (
    <Form id="update-password-form">
      <Title>Reset Password</Title>
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
        <Button type="primary" id="confirm" onClick={() => handleSubmit()}>Reset Password</Button>
      </FormItem>
    </Form>
  )
}

export default UpdatePassword;
