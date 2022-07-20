import React, { Component } from 'react';
import 'antd/dist/antd.css';
import "./app.css";
import { Layout } from 'antd';
import { BrowserRouter as Router, Route, Switch, } from 'react-router-dom';
import ReactDOM from 'react-dom';
import HeaderMenu from "./components/HeaderMenu"
import Home from "./Home";
import Admin from "./Admin";
import Account from "./Account";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import RecoverPassword from "./pages/RecoverPassword/RecoverPassword";
import UpdatePassword from './pages/UpdatePassword/UpdatePassword';
import Plant from './Plant';
import UploadImage from './Upload';

const { Header, Content } = Layout;

class App extends Component {

  render() {
    return (
      <Router>
        <Layout style={{
          height: "100vh",
          overflow: "auto",
          background: "linear-gradient(90deg, rgba(157,250,193,1) 35%, rgba(191,242,245,1) 100%)"
          
        }}>
          <Header style={{ backgroundColor: "#77d1a1", maxHeight:"10vh" }}><HeaderMenu /></Header>
          <Content>
            <Switch>
              <Route exact path='/' component={Home} />
              <Route path='/login' component={Login} />
              <Route path='/register' component={Register} />
              <Route path='/recover' component={RecoverPassword} />
              <Route path='/updatepassword' component={UpdatePassword} />
              <Route path='/account' component={Account} />
              <Route path='/home' component={Home} />
              <Route path='/admin' component={Admin} />
              <Route path='/plant' component={Plant} />
              <Route path='/upload' component={UploadImage} />
            </Switch>
          </Content>
        </Layout>
      </Router>
    );
  }

  componentDidMount() {



  }





}

ReactDOM.render(<App />, document.getElementById('root'));

export default App;
