import React from 'react';
import 'antd/dist/antd.css';
const axios = require('axios');




class Settings extends React.Component {

  render() {
    return (
      <h1>Page 2</h1>

    );
  }

  async componentDidMount() {

    /* 
     * Check that a user is logged in.
     * TRUE = Load the page
     * FALSE = Return to Login Page 
     */
    await axios.get('/api/checkuser')  //call the server endpoint
      .then(response => {
        if (response.data === false) {   //if false redirect to login (you are not logged in.)
          this.props.history.push("/login");
          window.location.reload();
        }
      })
      .catch(function (error) {
        console.log(error);
      })

  }



}





export default Settings;
