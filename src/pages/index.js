import React, { Component } from 'react';
import {createRoot} from "react-dom/client"
import './index.css';

import Header from '../components/header';
import ForgotUserPassword from "./forgotUserPassword";
import Signup from "./signup";
import FacultyPage from "./facultyPage";
import StudentPage from "./studentPage";


var configSettings = require('./config/configSettings.js');
var config = configSettings.config;

class App1 extends Component {
	
    constructor(props) {
        super(props);
		
		this.onForgotUserPassword = this.onForgotUserPassword.bind(this);
		this.onSignup = this.onSignup.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
		
    }

	onForgotUserPassword() {
		const container = document.getElementById('root');
		const root = createRoot(container);
		root.render(<ForgotUserPassword/>);
	}

	onSignup() {
		const container = document.getElementById('root');
		const root = createRoot(container);
		root.render(<Signup/>);
	}
	
	onSubmit(evt) {
        evt.preventDefault();

        console.log("index.js: onSubmit()");

        var loginIdElem = document.getElementById("id");
        var loginPwdElem = document.getElementById("pwd");

		var loginJson = {
			'id': loginIdElem.value,
			'password': loginPwdElem.value,
		};
		
		fetch(`${config.btpLoginURL}`, {
            method: 'POST',
			mode: 'cors',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(loginJson),
        })
        .then((response) => {
			console.log("index.js: onSubmit(): response.status: ", response.status);

            if (response.status !== 200) {
				response.json().then((data) => {
					console.log("index.js: onSubmit(): response.status != 200: ", data);
					var errorMessage = document.getElementById("errorMessage");
					errorMessage.innerHTML = data.error;
				});
            }
            else {
                response.json().then((data) => {
					localStorage.setItem('id',data.id);
					localStorage.setItem('role',data.role);
					localStorage.setItem('department',data.department);
					console.log("index.js: onSubmit(): response.status == 200: ", data);
					if (data.role === 'student') {
						const container = document.getElementById('root');
						const root = createRoot(container);
						root.render(<StudentPage data={data}/>);
					}
					else if (data.role === 'faculty') {
						const container = document.getElementById('root');
						const root = createRoot(container);
						root.render(<FacultyPage data={data}/>);
					}
					else {
						var errorMessage = document.getElementById("errorMessage");
						errorMessage.innerHTML = 'Unknown role ' + data.role + 'for user';
					}
                });
            }
        })
		.catch((errorResponse) => {
			console.log("index.js: onSubmit(): errorResponse.status: ", errorResponse);
		});
	}

    render() {
        return (
			<div class="box">
				
				<div class="container">
					<div class="top">
						<span class="acc">No account?&nbsp;&nbsp;<a class="reg" onClick={this.onSignup}>Sign Up </a></span>
						<header>Sign In</header>
					</div>
					<form method="POST" onSubmit={this.onSubmit}>
						<div class="input-field">
							<input type="text" class="input" placeholder="Institute Id" id="id" name="id" required/>
							<i class='bx bx-user'></i>
						</div>

						<div class="input-field">
							<input type="Password" class="input" placeholder="Password" id="pwd" name="password" required/>
							<i class='bx bx-lock-alt'></i>
						</div>

						<div class="input-field">
							<input type="submit" class="submit" value="Sign In" id="buttonSubmit"/>
						</div>
					</form>

					<div class="error">
						<label id="errorMessage"></label>
					</div>

					<div class="two-col">
						<div class="one">
							<label><a class="clerk" onClick={this.onForgotUserPassword}>Forgot Username or Password?</a></label>
						</div>
					</div>
				</div>
			</div>
        );
    }
}

const container = document.getElementById('root');
const root = createRoot(container);
// root.render(<App1/>);
export default App1;