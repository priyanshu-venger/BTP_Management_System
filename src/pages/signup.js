import React, { Component } from "react";
var configSettings = require('./config/configSettings.js');
var config = configSettings.config;

class Signup extends Component {

    constructor(props) {
      super(props);
	  this.onSubmit = this.onSubmit.bind(this);
	  this.onVerifyOTP = this.onVerifyOTP.bind(this);
    }

	onSubmit(evt) {
		evt.preventDefault();

		var signupIdElem = document.getElementById("id");
		var signupPwdElem = document.getElementById("password");
		var signupFNElem = document.getElementById("full_name");
		var signupEmailElem = document.getElementById("email");
		var signupDeptElem = document.getElementById("department");

		var signupJson = {
			'id': signupIdElem.value,
			'password': signupPwdElem.value,
			'full_name': signupFNElem.value,
			'email': signupEmailElem.value,
			'department': signupDeptElem.value,
		}

		console.log("signup.js: onSubmit(): signupJson: ", signupJson);
		console.log("signup.js: onSubmit(): btpSignupURL: ", config.btpSignupURL);

		fetch(`${config.btpSignupURL}`, {
            method: 'POST',
			mode: 'cors',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(signupJson),
        })
        .then((response) => {
			console.log("signup.js: onSubmit(): response.status: ", response.status);

            if (response.status !== 200) {
				response.json().then((data) => {
					console.log("signup.js: onSubmit(): response.status != 200: ", data);
					var errorMessage = document.getElementById("errorMessage");
					errorMessage.innerHTML = data.error;
				});
            }
            else {
				console.log("signup.js: onSubmit(): response.status == 200: ", response);
				var signupOTPDivElem = document.getElementById("signupOTPDiv");
				if (signupOTPDivElem != null) {
					signupOTPDivElem.style.display = 'block';
				}
            }
        })
		.catch((errorResponse) => {
			console.log("signup.js: onSubmit(): errorResponse.status: ", errorResponse);
		});
	}

	onVerifyOTP() {
		var signupIdElem = document.getElementById("id");
		var signupPwdElem = document.getElementById("password");
		var signupFNElem = document.getElementById("full_name");
		var signupEmailElem = document.getElementById("email");
		var signupDeptElem = document.getElementById("department");
		var signupOTPElem = document.getElementById("signupOTP");

		var signupOTPJson = {
			'id': signupIdElem.value,
			'password': signupPwdElem.value,
			'full_name': signupFNElem.value,
			'email': signupEmailElem.value,
			'department': signupDeptElem.value,
			'otp': signupOTPElem.value,
		}

		fetch(`${config.btpSignupOTPVerifyURL}`, {
            method: 'POST',
			mode: 'cors',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(signupOTPJson),
        })
        .then((response) => {
			console.log("signup.js: onVerifyOTP(): response.status: ", response.status);

            if (response.status !== 200) {
				response.json().then((data) => {
					console.log("signup.js: onVerifyOTP(): response.status != 200: ", data);
					var errorMessage = document.getElementById("errorMessage");
					errorMessage.innerHTML = data.error;
				});
            }
            else {
				var signupOTPDivElem = document.getElementById("signupOTPDiv");
				if (signupOTPDivElem != null) {
					signupOTPDivElem.style.display = 'none';
				}
            }
        })
		.catch((errorResponse) => {
			console.log("signup.js: onVerifyOTP(): errorResponse.status: ", errorResponse);
		});
	}

    render() {
        return (
			<div className="signupContainer">
				<h2> New Here? Sign Up !!!</h2>

				<form method="POST" onSubmit={this.onSubmit}>
					<div class="form-group">
						<label class="signupLabel" htmlFor="id">Institute ID</label>
						<input type="text" class="form-control" id="id" name="id" required/>
					</div>
					<div class="form-group">
						<label class="signupLabel" htmlFor="password">Password</label>
						<input type="password" class="form-control" id="password" name="password" required/>
					</div>
					<div class="form-group">
						<label class="signupLabel" htmlFor="full_name">Full Name</label>
						<input type="text" class="form-control" id="full_name" name="full_name" required/>
					</div>
					<div class="form-group">
						<label class="signupLabel" htmlFor="email">Email</label>
						<input type="email" class="form-control" id="email" name="email" required/>
					</div>
					<div class="form-group">
						<label class="signupLabel" htmlFor="department">Department</label>
						<input type="text" class="form-control" id="department" name="department" required/>
					</div>
					<button type="submit" class="btn btn-primary">Sign Up</button>
				</form>

				<div class="error">
					<label id="errorMessage"></label>
				</div>

				<div class="signupOTP" id="signupOTPDiv">
					<label class="signupOTPLabel" htmlFor="signupOTP">Verify OTP sent to Email</label>
					<input type="password" class="form-control" id="signupOTP" name="signupOTP" required/>
					<button class="btn btn-primary" onClick={this.onVerifyOTP}>Verify OTP</button>
				</div>
			</div>
        );
    }
}

export default Signup;