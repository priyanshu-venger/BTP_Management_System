import React, { Component, useEffect } from 'react'
import './header.css'
import logo from './assets/img/logo.png'
import axios from 'axios';
//import { Link } from 'react-router-dom';

class Header extends Component {

  handleLogout = async(e) => {
    e.preventDefault();
    fetch(`127.0.0.1:5000/logout`, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      // body: JSON.stringify(loginJson),
    })
      .then((response) => {
        localStorage.clear();
        console.log("done");
        // Redirect the user to the login page
        window.location.href = '/index';
      })
      .catch(error => {
        console.log(error);
      });
  }
  state = {clicked: false};
  handleclick = () =>{
    this.setState({clicked:!this.state.clicked})
  }
  
  render(){
  return (
    <>
    <nav>
    <a href="home">
      <img src={logo} alt="LOGO"  width={100} height={90} />
      </a>
      <div>
        <ul id="navbar" className={this.state.clicked ? "#navbar active":"#navbar"}>
        <li>
          </li>
          
            <li>
          <a href={(localStorage.getItem("id")!==null && localStorage.getItem("role")==="faculty")?"/upload":null}>
              {(localStorage.getItem("id")!==null && localStorage.getItem("role")==="faculty")?"Upload project":null}
            </a>
            </li>
            <li>
          <a href={(localStorage.getItem("id")!==null &&localStorage.getItem("role")==="student")?'/list':(localStorage.getItem("id")!==null && localStorage.getItem("role")==="faculty")?"/approve":null}>
              {(localStorage.getItem("id")!==null &&localStorage.getItem("role")==="student")?"btp list":(localStorage.getItem("id")!==null && localStorage.getItem("role")==="faculty")?"btp requests":null}
            </a>
          </li>
          <li>
          <a href={(localStorage.getItem("id")!==null &&localStorage.getItem("role")==="student")?'/profile':(localStorage.getItem("id")!==null && localStorage.getItem("role")==="faculty")?"/profile":null}>
              {(localStorage.getItem("id")!==null &&localStorage.getItem("role")==="student")?"Profile":(localStorage.getItem("id")!==null && localStorage.getItem("role")==="faculty")?"Profile":null}
            </a>
          </li>
          <li>
          <a href={(localStorage.getItem("id")!==null &&localStorage.getItem("role")==="student")?'/applied_list':(localStorage.getItem("id")!==null && localStorage.getItem("role")==="faculty")?"/approved_list":null}>
              {(localStorage.getItem("id")!==null &&localStorage.getItem("role")==="student")?"Applied list":(localStorage.getItem("id")!==null && localStorage.getItem("role")==="faculty")?"Approved list":null}
            </a>
          </li>
          <li>
          <a href={"/approve_co_guide"} hidden={(localStorage.getItem("id")!==null && localStorage.getItem("role")==="faculty")?false:true} >
              {"Approve co_guide application"}
            </a>
          </li>
          <li>
          <a href="/home" className='active'>
              Home
            </a>
            </li>
            <li>
            <a href={localStorage.getItem('id')!==null?'/logout':'/login'} onClick={localStorage.getItem('id')!==null?this.handleLogout:null}>
            {localStorage.getItem('id')!==null?'Logout':'Login'}
            </a>
          </li>
        </ul>
      </div>
      <div id="mobile" onClick={this.handleclick}>
        <i id="bar" className={this.state.clicked ? "fas fa-times":"fas fa-bars"}>
        </i>

      </div>
      
    </nav>
    </>
  )
}
}
export default Header

