import React from 'react';
import 'antd/dist/antd.css';
import PlantSearch from "./components/PlantSearch"
const axios = require('axios');

class Home extends React.Component {

  render() {
    return (
      <div>
        <div style={{ margin:"1% auto", width:"95%"}}>
          <PlantSearch style={{width:"100%", textAlign:"center", textAlignLast:"center"}} />
        </div>

      </div>


    );
  }

  async componentDidMount() {

    /* 
    * Check that a user is logged in.
    * TRUE = Load the page
    * FALSE = Return to Login Page 
    */
    await axios.get('/api/checkuser')  //call the server endpoint
      .then(async response => {
        if (response.data === false) {   //if false redirect to login (you are not logged in.)
          this.props.history.push("/login");
          window.location.reload();
        }
        //if a user is logged in
        else {
          // Check the user Type (Admin/Standard) to see which home page to show
          await axios.get('/api/usertype')  //Make an API call to check the Type of the logged in User
            .then(response => {
              if (response.data == "Admin") {
                this.props.history.push("/admin") //Redirect to admin page
                window.location.reload();
              }

            })
            //Catch any errors
            .catch(function (error) {
              console.log(error);
            })

        }
      })
      .catch(function (error) {
        console.log(error);
      })

  }



}


export default Home;
