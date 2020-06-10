import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Home from "./Home.js"
import Login from "./Login.js";
import Signup from "./Signup.js";
import Welcome from "./Welcome.js";
import { Nav, Navbar, NavDropdown } from 'react-bootstrap'
import axios from "axios";
import { Redirect } from "react-router-dom";

// This site has 3 pages, all of which are rendered
// dynamically in the browser (not server rendered).
//
// Although the page does not ever refresh, notice how
// React Router keeps the URL up to date as you navigate
// through the site. This preserves the browser history,
// making sure things like the back button and bookmarks
// work properly.

class AppRouter extends React.Component {
  constructor(props) {
    super(props);
     this.state = {
       username:null,
       redirect:''
     }
  }

  componentDidMount(){
    const username = localStorage.getItem("username")
      
    if(username!=="null"){
        this.setState({
          username
        })
      }
  }


updateusername = (username) => {
 
  this.setState({
    username
  })
}


isloggedin = () => {
  const username = localStorage.getItem("username")
  
  if (username !== 'null') {
    this.setState({
      username
    })
    return true
  }
    this.setState({
    username:null
  })
    return false
}

logout = () => {
  axios.post('/api/logout')
  .then(res => {
    
    this.setState({
      redirect:'/',
      username:null
    })
    localStorage.removeItem("username")
    
  })
  .finally(() => {
    this.setState({
      redirect:''
    })
  })
}

  render(){
    const { username, redirect } = this.state

    return (
      <Router>  
        <div>
          {this.state.redirect && (
            <Redirect to={redirect} />
          )}
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Nav.Item > 
          <Link to="/">
            HOME
          </Link>
          </Nav.Item>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="mr-auto">
        <Nav.Link href="#features">Features</Nav.Link>
        <Nav.Link href="#pricing">Pricing</Nav.Link>
        <Nav.Link href="#deets">More deets</Nav.Link>
        <Nav.Link eventKey={2} href="#memes">
          Dank memes
        </Nav.Link>
      </Nav>
      <Nav>
        <NavDropdown 
          title={username ? username : "Dropdown"} 
          id="collasible-nav-dropdown" 
          style={{marginRight: '60px'}}
          onClick={this.isloggedin}
        >
          <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
          <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
          <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
          { username && (
            <>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={this.logout}>Logout</NavDropdown.Item>
            </>
          )}
        </NavDropdown>
      </Nav>
    </Navbar.Collapse>
  </Navbar>
  
          {/*
            A <Switch> looks through all its children <Route>
            elements and renders the first one whose path
            matches the current URL. Use a <Switch> any time
            you have multiple routes, but you want only one
            of them to render at a time
          */}
          <Switch>
            <Route exact path="/">
              <Home />
            </Route>
            <Route path="/login">
              <Login updateusername={this.updateusername}/>
            </Route>
            <Route path="/signup">
              <Signup />
            </Route>
            <Route path="/welcome">
              <Welcome />
            </Route>
          </Switch>
        </div>
      </Router>
    );

  }
  
}

// You can think of these components as "pages"
// in your app.

export default AppRouter;
