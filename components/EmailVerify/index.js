import React from 'react';
import "./styles.css";
import queryString from 'query-string';
import { Link } from "react-router-dom";
import apiconfig from "../../apiconfiguration/apiconfig";

class EmailVerify extends React.Component {

  constructor(props) {
   super(props);
   this.userId = 0;
   this.state= { verified:false };
   this.clear = {};    
  }


  componentDidMount() {
        
    const values = queryString.parse(this.props.location.search);
    let esc = encodeURIComponent;    
    let qsData = { userid: values.userid };     
    let query = `?${Object.keys(qsData).map(k => `${esc(k)}=${esc(qsData[k])}`).join("&")}`;    
    fetch(apiconfig.verifyuser.concat(query), {        
          method: "GET",    
          headers: { 'Content-type':'application/json' }
        })
        .then(response => {           
          return response.json();
        })              
        .then(data => {          
          if(data.verified) this.setState({verified:true});
        }) 

  };
  
  render() {
    if(this.state.verified)
    {
      
      return ( 
        <div className="email-verified-container">
        <div>
          <h2>You have successfuly verified your email.</h2>
          <Link to="/login"><button>Login here.</button></Link>
        </div>          
        </div>
      );
    }

    else
    {
      return ( 
        <div className="email-verified-container">
       <div>
          <h2> NOT YET VERIFIED.</h2>
        </div>      
        </div>
      );
    } 
  }
}

export default EmailVerify;
