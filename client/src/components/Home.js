import React from 'react';
import { FaUserAlt } from 'react-icons/fa';
import {Link} from "react-router-dom";
import Login from "./Login";
import Signup from "./Signup";
import '../App.css';

function Home() {
  localStorage.removeItem("username")
  return (
    <div className="container welcome1" style={{ paddingTop: '80px' }}>
    <div className="jumbotron text-center">
        <h1><span className="fa fa-lock"></span> Node Authentication</h1>

        <p>Login or Register with:</p>


        <Link to="/signup">
          <span href="" className="btn btn-light mr-1" ><FaUserAlt /> Local Signup</span>
        </Link>
        <Link to="/login">
          <span href="" className="btn btn-light mr-1" ><FaUserAlt /> Local Login</span>
        </Link>
    </div>

    

</div>

  );
}

export default Home;