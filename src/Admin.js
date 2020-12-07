import React from 'react';
import 'antd/dist/antd.css';
import { Table, Input, Button, Space, Tabs, Typography, Button  } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

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
        <TabPane tab="Plants" key="1">
          <Title>Plants</Title>
          <Table style={{width:"98%", margin:"auto" }} dataSource={this.state.allPlantData} columns={[
            {
              title: 'PlantID',
              dataIndex: 'PlantID',
              key: 'PlantID',
            },
            {
              title: 'Common Name',
              dataIndex: 'CommonName',
              key: 'CommonName',
              ...this.getColumnSearchProps('CommonName'),
            },
            {
              title: 'Type',
              dataIndex: 'Type',
              key: 'Type',
            }
          ]
          } />;
          <Button>

          </Button>
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

  getPlantData = async() => {

    await axios.get("/api/plants/admintable")
      .then(response => {

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
