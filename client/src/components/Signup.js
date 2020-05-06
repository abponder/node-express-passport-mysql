import React from 'react';
import {Link} from "react-router-dom";
import axios from "axios";
import Alert from 'react-bootstrap/Alert';
import { Redirect } from "react-router-dom";

class Signup extends React.Component {
  constructor(props) {
    super(props);
     this.state = {
      username:'',
      password:'',
      remember: true,
      flashMessages: [],
      showFlash: false,
      redirect: ''
     }

  }
  
  handleChange = e => {
    let value = e.target.type === 'checkbox' ? !this.state.remember : e.target.value; 
    this.setState({
      [e.target.name]: value
      
    })
  }

  onSubmit = (e) => {
    e.preventDefault()
    if(!this.state.username){
      console.log('testing 1')
      return this.setState({
        flashMessages: [...this.state.flashMessages, 'User Name is Required'],
        showFlash: true
      })
    }
    if(!this.state.password){
      console.log('testing 2')
      return this.setState({
        flashMessages: [...this.state.flashMessages, 'Password is Required'],
        showFlash: true
      })
    }
    // if(this.state.flashMessages.length){
    //   console.log('testing')
    //   return
    // }
    console.log(this.state)
    axios.post('/api/signup',{
      username:this.state.username,
      password:this.state.password
    })
    .then(res => {
      console.log(res)
      if(res.data.user) {
        this.setState({
          redirect:'/welcome'
        })

      }else{
        this.setState({
          flashMessages:res.data.msg,
          showFlash:res.data.msg.length ? true : false
        })
      }
      
    })
  }

  setShow = (status) => this.setState({showFlash: status})

  render(){
    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />
    }
    return (
      <div className="container mt-4" >
      <div className="col-sm-6 col-sm-offset-3">
          <h1><span className="fa fa-sign-in"></span> Signup</h1>
  
          <div >{this.state.showFlash && this.state.flashMessages.map((msg, i) => (
              <Alert key={i} variant="danger" onClose={() => this.setShow(false)} dismissible>
                {msg}
            </Alert>
              
          ))}</div>
          {/* <!-- LOGIN FORM --> */}
          <form  onSubmit={e => this.onSubmit(e,this.state)}>
              <div className="form-group">
                  <label>Username</label>
                  <input type="text" className="form-control" name="username" onChange={this.handleChange} value={this.state.username} />
              </div>
              <div className="form-group">
                  <label>Password</label>
                  <input type="password" className="form-control" name="password" onChange={this.handleChange} value={this.state.password} />
              </div>
  
              <button type="submit" className="btn btn-warning btn-lg">Signup</button>
          </form>
  
          <hr />
  
          <p>Already Have an account? 
            <Link to="/login">
              <span href="" className=" mr-1" > Login</span>
            </Link>
          </p>
          <p>Or go 
            <Link to="/">
              <span href="" className=" mr-1" > Home</span>
            </Link>
          </p>
      </div>
  </div>
  
    );


  }


  
}

export default Signup;