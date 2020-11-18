import React from 'react';
import 'antd/dist/antd.css';
import { Menu } from 'antd';
import {BrowserRouter as Router, Link} from 'react-router-dom';


class HeaderMenu extends React.Component {

  state = {
    current: 'Home',
  };

  render() {
    return (
        <Menu onClick={this.handleClick} selectedKeys={[this.state.current]} theme="dark" mode="horizontal" style={{ lineHeight: '64px' }}>
          <Menu.Item key="Home"><Link to="/Home">Home</Link></Menu.Item>
          <Menu.Item key="Settings"><Link to="/Settings">Settings</Link></Menu.Item>
        </Menu>
    );
  }
  componentDidMount() {


  }
  handleClick = e => {
    this.setState({
      current: e.key,
    });
  };
}
export default HeaderMenu;
