import React, { Component }from "react";

var configSettings = require('./config/configSettings.js');
var config = configSettings.config;

class Register extends Component {

    // state = {
    //     username: '',
    //     password: '',
    //     name: '',
    //     email: ''
    // };

    constructor(props) {
      super(props);
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(evt) {
		var userFullNameElem = document.getElementById("userFullName");
		var userEmailElem = document.getElementById("userEmail");
		var userMobileElem = document.getElementById("userMobile");
		var userNameElem = document.getElementById("userName");
		var userPwdElem = document.getElementById("userPwd");
		var registerButtonElem = document.getElementById("registerButton");

		if (userFullNameElem.value && userEmailElem.value && userMobileElem.value
			&& userNameElem.value && userPwdElem.value) {
			registerButtonElem.disabled = false;
		}
		else {
			registerButtonElem.disabled = true;
		}
    }

    handleSubmit(e){
		var userFullNameElem = document.getElementById("userFullName");
		var userEmailElem = document.getElementById("userEmail");
		var userMobileElem = document.getElementById("userMobile");
		var userNameElem = document.getElementById("userName");
		var userPwdElem = document.getElementById("userPwd");

		if ( ! userFullNameElem.value || ! userEmailElem.value || ! userMobileElem.value
			|| ! userNameElem.value || ! userPwdElem.value) {
			var errorRegisterElem = document.getElementById("errorRegister");
			errorRegisterElem.innerHTML = 'Please enter all the required fields.';
			return;
		}

		var registerJson = {
			customerName: userFullNameElem.value,
			customerEmail: userEmailElem.value,
			customerMobile: userMobileElem.value,
			loginUser: userNameElem.value,
			loginPassword: userPwdElem.value
		}

        fetch(`${config.baseURL}/api/user`, {
            method: 'POST',
            mode: 'cors',
            body: JSON.stringify(registerJson),
			json: true
        })
        .then((response) => {
            if (response.status !== 201) {
                response.json().then((data) => {
                    var errorRegisterElem = document.getElementById("errorRegister");
					errorRegisterElem.innerHTML = data.errors[0];
					return;
                });
            }
        });

        this.props.onFormSwitch('Login');
    }

    render() {
        return (
            <div className="auth-form-container">
                <label htmlFor="userFullName">Full Name</label>
                <input id="userFullName" onChange={this.handleChange} type="text" placeholder="Enter Your Full Name"/>
                <label htmlFor="userEmail">Email</label>
                <input id="userEmail" onChange={this.handleChange} type="email" placeholder="Enter your Email" name="email"/>
				<label htmlFor="userMobile">Mobile Number</label>
                <input id="userMobile" onChange={this.handleChange} type="text" placeholder="Enter your Mobile" name="email"/>
                <label htmlFor="userName">Username</label>
                <input id="userName" onChange={this.handleChange} type="text" placeholder="Enter your Username" name="username"/>
                <label htmlFor="userPwd">Password</label>
                <input id="userPwd" onChange={this.handleChange} type="password" placeholder="Enter your Password" name="password"/>
                <label></label>
				<label></label>
                <button className="signInButton" id="registerButton" onClick={this.handleSubmit}>Register</button>
                <button className="link-btn" onClick={() => this.props.onFormSwitch('Login')}>Already have an account? Sign In</button>
				<label className="error" id="errorRegister"></label>
            </div>
        );
    }
}

export default Register;