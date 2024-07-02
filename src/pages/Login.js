import React, { Component } from "react";
import {createRoot} from "react-dom/client"
var configSettings = require('./config/configSettings.js');
var config = configSettings.config;


class Login extends Component {
	state = {
		Username: '',
		Password: '',
	}
	constructor(props) {
		super(props);
		this.handleChange = this.handleChange.bind(this);
		this.validateLogin = this.validateLogin.bind(this);
	}
	
	handleChange(evt) {
        var loginIdElem = document.getElementById("loginId");
        var loginPwdElem = document.getElementById("loginPwd");
        var validateLoginButtonElem = document.getElementById("validateLoginButton");
        validateLoginButtonElem.disabled = (loginIdElem.value && loginPwdElem.value) ? false : true;
	}
		
    validateLogin(evt) {
        var loginIdElem = document.getElementById("loginId");
        var loginPwdElem = document.getElementById("loginPwd");
		
		if ( ! loginIdElem.value || ! loginPwdElem.value) {
			var errorColumn = document.getElementById("errorColumn");
			errorColumn.innerHTML = 'Please enter username and password';    
			return;
		}
		
        var loginJson = {
            loginUser: loginIdElem.value,
            loginPassword: loginPwdElem.value
        }

        fetch(`${config.baseURL}/api/validateLogin`, {
            method: 'POST',
            mode: 'cors',
            body: JSON.stringify(loginJson),
			json: true
        })
        .then((response) => {
            if (response.status !== 200) {
                response.json().then((data) => {
                    var errorColumn = document.getElementById("errorColumn");
                    errorColumn.innerHTML = data.errors[0];  
                    localStorage.setItem('id',data.id);  
                    localStorage.setItem('role',data.role);  
                    localStorage.setItem('department',data.department);  
                });
            }
            else {
                response.json().then((data) => {
                    const container = document.getElementById('root');
                    const root = createRoot(container);
                    // root.render(<MainPanel data={data}/>);
                });
            }
        });
    }

	render() {
		return (
			<div className="auth-form-container">
				<label htmlFor="Username">Username</label>
				<input onChange={this.handleChange} type="text" placeholder="Enter your Username" id="loginId" name="Username" required/>
				<label htmlFor="Password">Password</label>
				<input onChange={this.handleChange} type="password" placeholder="Enter your Password" id="loginPwd" name="Password" required />
				<label>     </label>
				<button className="signInButton" id="validateLoginButton" onClick={this.validateLogin}>Sign In</button>
				<button className="link-btn" onClick={() => this.props.onFormSwitch('Register')}>Not Registered yet? Sign Up</button>
				<label className="error" id="errorColumn"></label>
			</div>    
		);
	}
}

export default Login;
