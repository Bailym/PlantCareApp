import React, { Component } from 'react';
import 'antd/dist/antd.css';
import { Layout } from 'antd';
import {BrowserRouter as Router,Route,Switch,} from 'react-router-dom';

import HeaderMenu from "./components/HeaderMenu"
import Home from "./Home";
import Settings from "./Settings";

const { Header, Footer, Content } = Layout;

class App extends Component {

  render() {
    return (
      <Router>
          <Layout>
            <Header><HeaderMenu /></Header>
            <Content>
              <Switch>
                <Route path='/Home' component={Home} />
                <Route path='/Settings' component={Settings} />
              </Switch>
            </Content>
            <Footer>Footer</Footer>
          </Layout>
      </Router>
    );
  }

  componentDidMount() {



  }



}

export default App;
