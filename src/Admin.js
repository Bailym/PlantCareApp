import React from 'react';
import 'antd/dist/antd.css';
import { Tabs, Typography } from 'antd';

const axios = require('axios');
const { Title } = Typography;
const { TabPane } = Tabs;

class Admin extends React.Component {

  render() {
    return (
      <Tabs defaultActiveKey="1" onChange={() => this.callback} style={{marginLeft:"1%"}}>
        <TabPane tab="Plants" key="1">
          <Title>Plants</Title>

        </TabPane>
        <TabPane tab="Users" key="2">
          <Title>Users</Title>

        </TabPane>
      </Tabs>
    );
  }

  callback = (key) => {
    console.log(key);
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


export default Admin;
