import React from 'react';
import 'antd/dist/antd.css';
import { Select } from 'antd';
import { Route, withRouter } from 'react-router-dom';
const { Option } = Select;
const axios = require('axios');

class PlantSearch extends React.Component {
  state = {
    data: [], //the data returned from the search
    value: undefined, //the selected Option value
    options: [] //the <option> components to be rendered
  };

  //handles client to server
  //@value: the term entered by the user
  handleSearch = async value => {

    let tempState = Object.assign({}, this.state)
    //reset the state before performing a new search
    this.setState({
      data: [],
      options: []
    })
    //if the input isnt blank
    if (value) {
      //perform the search and await a response from the server
      await axios.get(`/api/plants/search/${value}`)
        .then(async response => {
          //update the state with the search results and the options components
          this.setState({
            data: response.data,
            options: response.data.map(x => <Option style={{ padding: "1%", textAlign: "center" }} key={x.PlantID}>{x.CommonName + " (" + x.AltName + ") "} </Option>)
          })
        })
    }
    //if no search term has been entered
    else {
      //reset the state 
      this.setState({
        data: [],
        options: []
      })
    }
  };

  //handles selecting the value
  handleChange = value => {
    this.setState({ value });

    this.props.history.push({
      pathname: '/plant',
      state: { PlantID: value }
    })
    window.location.reload();
  };

  render() {
    return (
      <Select
        showSearch
        value={this.state.value}
        placeholder={this.props.placeholder}
        style={this.props.style}
        size="large"
        defaultActiveFirstOption={false}
        showArrow={false}
        filterOption={false}
        onSearch={this.handleSearch}
        onChange={this.handleChange}
        notFoundContent={null}
        placeholder="Search Plants"
      >
        { this.state.options}
      </Select>
    );
  }
}

export default withRouter(PlantSearch)