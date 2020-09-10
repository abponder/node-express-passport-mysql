import React from 'react';
import {Link} from "react-router-dom";
import axios from "axios";
import Alert from 'react-bootstrap/Alert';
import { Redirect } from "react-router-dom";

 
class Welcome extends React.Component{
   state={
     isAuthenticated : false,
     redirect:''
   }
  componentDidMount(){
    this.isAuthenticated()
  }
  isAuthenticated = (e) => {
    
    axios.get('/api/welcome', { withCredentials: true })
    .then(res => {
      console.log('api welcome res;', res)
      
      if(res.data.user) { 
        this.setState({
          isAuthenticated:true
        })
   
      localStorage.setItem("username", res.data.user.username)
        
      }else{
        this.setState({
          redirect:'/'
        })
      }
      
    })
  }
 render(){
   
  if (this.state.redirect) {
    return <Redirect to={this.state.redirect} />
  }
  if(this.state.isAuthenticated){
    return (
      <div className="container" style={{ paddingTop: '80px' }}>
      
     Welcome to Welcome page
  
  </div>
  
    );
  }
  return <div></div>
}
 }

export default Welcome;