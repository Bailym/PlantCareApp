import React from 'react';
import 'antd/dist/antd.css';
import { Menu, message } from 'antd';
import { withRouter } from "react-router-dom";
import { Link} from 'react-router-dom';
import { LoginOutlined } from '@ant-design/icons';
const axios = require('axios');

class HeaderMenu extends React.Component {

  state = {
    current: "",
  };

  render() {
    return (
        <Menu onClick={this.handleClick} theme="dark" selectedKeys={[this.state.current]} mode="horizontal" style={{ lineHeight: '4em', backgroundColor:"#77d1a1" }}>
          <Menu.Item key="Home"><Link to="/home" style={{color:"#000"}} >Home</Link></Menu.Item>
          <Menu.Item key="Account"><Link to="/account" style={{color:"#000"}}>Account</Link></Menu.Item>
          <Menu.Item id="loginout" key="Logout" onClick={() => this.clickLogout()} style={{float:"right"}}><LoginOutlined type="login" style={{fontSize:"20px", color:"#000"}} /></Menu.Item>
        </Menu>
    );
  }
  componentDidMount() {



  }

   /*
  * Handles when the Logout button is clicked.
  * Make an API request to logout 
  * Redirect to Login screen
  */
 async clickLogout() {
  await axios.get('/api/logout')  //Make API call to logout
    .then(response => {
      this.props.history.push('/login');  //Redirect to login
      message.info("Logged Out!");  //Show a success message
      window.location.reload();
    })
    .catch(function (error) {
      console.log(error);     
    })
}

  handleClick = e => {
    this.setState({
      current: e.key,
    });

    if(e.key!=="Logout"){
      window.location.reload();
    }
    

  };
}
export default withRouter(HeaderMenu);
