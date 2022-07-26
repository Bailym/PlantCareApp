import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import 'antd/dist/antd.css';
import "./Admin.css";
import { Table, Tabs, Typography } from 'antd';
import ArchiveModal from "../../components/ArchiveModal/ArchiveModal";
import UpdatePlantModal from "../../components/UpdatePlantModal/UpdatePlantModal";
import CreatePlantModal from "../../components/AddPlantModal/AddPlantModal";
import UpdateUserModal from "../../components/UpdateUserModal";
import DeleteUserModal from "../../components/DeleteUserModal";

const axios = require('axios');
const { TabPane } = Tabs;


function Admin() {

  const [allUserData, setAllUserData] = useState([]);
  const [allPlantData, setAllPlantData] = useState([]);
  const history = useHistory();

  /* 
     * Check that a user is logged in.
     * TRUE = Load the page
     * FALSE = Return to Login Page 
     */
  async function checkUser() {
    await axios.get('/api/checkuser')  //call the server endpoint
      .then(async response => {
        if (response.data === false) {   //if false redirect to login (you are not logged in.)
          history.push("/login");
        }
      })
  }

  async function getPlantData() {
    //the object of this response is used as the datasource for the table
    await axios.get("/api/plants/admintable")
      .then(response => {
        //add the options column to each entry
        let responseData = response.data
        for (var i = 0; i < responseData.length; i++) {
          responseData[i].Options =
            <div>
              <span><DeleteModal PlantID={responseData[i].PlantID} PlantName={response.data[i].CommonName} /></span>
              <span><UpdatePlantModal PlantID={responseData[i].PlantID} PlantName={response.data[i].CommonName} /></span>
            </div>
        }
        setAllPlantData(responseData);
      })
  }

  async function getUserData() {
    //the object of this response is used as the datasource for the table
    await axios.get("/api/usertable")
      .then(response => {

        //add the options column to each entry
        let responseData = response.data

        for (var i = 0; i < responseData.length; i++) {
          responseData[i].Options =
            <div>
              <span><DeleteUserModal propUserID={responseData[i].ID} /></span>
              <span><UpdateUserModal propUserID={responseData[i].ID} /></span>
            </div>
        }
        setAllUserData(responseData);
      })
  }

  //when the component mounts
  useEffect(() => {
    checkUser();  //make sure a user is logged in
    getUserData();
    getPlantData();
  }, [])


  //config for the table
  let config = {
    pagination: {
      defaultPageSize: 7,
    }
  }

  return (
    <Tabs defaultActiveKey="1" id="tab-container">
      <TabPane tab="Plants" key="1" >
        <Table className="data-table" {...config} dataSource={allPlantData} columns={[
          {
            title: 'PlantID',
            dataIndex: 'PlantID',
            key: 'PlantID',
            align: "center",
          },
          {
            title: 'Common Name',
            dataIndex: 'CommonName',
            key: 'CommonName',
            align: "center",
            responsive: ['md'],
          },
          {
            title: 'Type',
            dataIndex: 'Type',
            key: 'Type',
            align: "center",
            responsive: ['md'],
          },
          {
            title: "Options",
            dataIndex: "Options",
            key: "Options",
            align: "center",
          }
        ]
        } />
        <CreatePlantModal />
      </TabPane>
      <TabPane tab="Users" key="2">
        <Table {...config} dataSource={allUserData} columns={[
          {
            title: 'ID',
            dataIndex: 'ID',
            key: 'UserID',
            align: "center",
          },
          {
            title: 'Email',
            dataIndex: 'Email',
            key: 'Email',
            align: "center",
            responsive: ['md'],
          },
          {
            title: 'First Name',
            dataIndex: 'FirstName',
            key: 'FirstName',
            align: "center",
            responsive: ['md'],
          },
          {
            title: "Surname",
            dataIndex: "Surname",
            key: "Surname",
            align: "center",
            responsive: ['md'],
          },
          {
            title: "Type",
            dataIndex: "Type",
            key: "UserType",
            align: "center",
            responsive: ['md'],
          },
          {
            title: "Options",
            dataIndex: "Options",
            key: "Options",
            align: "center",
          }
        ]} />
      </TabPane>
    </Tabs>
  )
}
export default Admin;
