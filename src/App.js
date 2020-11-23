import React, { Component } from 'react';
import 'antd/dist/antd.css';
import { Layout } from 'antd';
import { BrowserRouter as Router, Route, Switch, } from 'react-router-dom';

import HeaderMenu from "./components/HeaderMenu"
import Home from "./Home";
import Settings from "./Settings";
import Login from "./Login";

const { Header, Footer, Content } = Layout;

class App extends Component {

  render() {
    return (
      <Router>
        <Layout style={{
          position: "absolute",
          top: "0",
          right: "0",
          bottom: "0",
          left: "0"
        }}>
          <Header><HeaderMenu /></Header>
          <Content>
            <Switch>
              <Route path='/login' component={Login} />
              <Route path='/home' component={Home} />
              <Route path='/settings' component={Settings} />
            </Switch>
          </Content>
          <Footer>Baily Martin - 10582026</Footer>
        </Layout>
      </Router>
    );
  }

  componentDidMount() {



  }



}

export default App;
