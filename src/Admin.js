import React from 'react';
import 'antd/dist/antd.css';
import { Table, Input, Button, Space, Tabs, Typography } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import DeleteModal from "./components/DeleteModal";
import UpdatePlantModal from "./components/UpdatePlantModal";
import CreatePlantModal from "./components/AddPlantModal";

const axios = require('axios');
const { Title } = Typography;
const { TabPane } = Tabs;

class Admin extends React.Component {

  state = {
    allUserData: [],
    allPlantData: [],
    searchText: '',
    searchedColumn: '',
  }

  render() {
    return (
      <Tabs defaultActiveKey="1" onChange={() => this.callback} style={{ marginLeft: "1%" }}>
        <TabPane tab="Plants" key="1" >
          <Title style={{marginLeft:"2%"}}>Plants</Title>
          <Table style={{width:"95%", margin:"auto", overflow: "auto", backgroundColor: "#fff", border:"1px solid #e6dfdf", borderRadius:"20px" }} dataSource={this.state.allPlantData} columns={[
            {
              title: 'PlantID',
              dataIndex: 'PlantID',
              key: 'PlantID',
              align: "center",
              width:"10%"
            },
            {
              title: 'Common Name',
              dataIndex: 'CommonName',
              key: 'CommonName',
              align: "center",
              width:"30%",
              ...this.getColumnSearchProps('CommonName'),
            },
            {
              title: 'Type',
              dataIndex: 'Type',
              key: 'Type',
              align: "center",
              width:"30%"
            },
            {
              title: "Options",
              dataIndex: "Options",
              key: "Options",
              align: "center",
              width:"30%"
            }
          ]
          } />
          <CreatePlantModal/>
        </TabPane>
        <TabPane tab="Users" key="2">
          <Title>Users</Title>
        </TabPane>
      </Tabs>
    );
  }

  callback = (key) => {

  }

  //Makes the search column work ??????
  getColumnSearchProps = dataIndex => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => {
            this.searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
        : '',
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => this.searchInput.select(), 100);
      }
    },
  });

  //Performs the name search
  handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    this.setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
  };

  //resets the search
  handleReset = clearFilters => {
    clearFilters();
    this.setState({ searchText: '' });
  };

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

    this.getPlantData();
  }

  getPlantData = async () => {

    await axios.get("/api/plants/admintable")
      .then(response => {

        //add the options column to each entry
        let responseData = response.data
        for (var i = 0; i < responseData.length; i++) {
          responseData[i].Options =
            <div>
              <span style={{ display: "inline-block" }}><DeleteModal propPlantID={responseData[i].PlantID} propPlantName={response.data[i].CommonName} /></span>
              <span style={{ display: "inline-block" }}><UpdatePlantModal propPlantID={responseData[i].PlantID} propPlantName={response.data[i].CommonName} /></span>
            </div>
        }

        //update the state with the table data
        let tempState = Object.assign({}, this.state)
        tempState.allPlantData = response.data;
        this.setState(tempState);

      })
      .catch(function (error) {
        console.log(error);
      })

  }
}


export default Admin;
