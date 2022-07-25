import React, { Component } from 'react';
import 'antd/dist/antd.css';
import "./index.css";
import { Layout } from 'antd';
import { BrowserRouter as Router, Route, Switch, } from 'react-router-dom';
import ReactDOM from 'react-dom';
import HeaderMenu from "./components/HeaderMenu"
import Home from "./pages/Home/Home";
import Admin from "./Admin";
import Account from "./pages/Account/Account";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import RecoverPassword from "./pages/RecoverPassword/RecoverPassword";
import UpdatePassword from './pages/UpdatePassword/UpdatePassword';
import Plant from './pages/Plant/Plant';
import UploadImage from './Upload';

const { Header, Content } = Layout;

class App extends Component {

  render() {
    return (
      <Router id="router">
        <div id="nav-container"><HeaderMenu /></div>
        <div id="content-container">
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
        </div>
        <div id="footer-container"></div>
      </Router>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));

export default App;
