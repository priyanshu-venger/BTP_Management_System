import React, { Component }from "react";
var configSettings = require('./config/configSettings.js');
var config = configSettings.config;

class ForgotUserPassword extends Component {

    constructor(props) {
      super(props);
	  this.onSubmit = this.onSubmit.bind(this);
    }

	onSubmit(evt) {
		evt.preventDefault();

        console.log("forgotUserPassword.js: onSubmit()");

        var emailElem = document.getElementById("email");
		var forgotFormData = new FormData();
		forgotFormData.set('email', emailElem.value);
        
		fetch(`${config.btpForgotURL}`, {
            method: 'POST',
            mode: 'cors',
            body: forgotFormData,
        })
        .then((response) => {
            if (response.status !== 200) {
                response.json().then((data) => {
                    var errorColumn = document.getElementById("errorColumn");
                    errorColumn.innerHTML = data.errors[0];    
                });
            }
            else {
                response.json().then((data) => {
					console.log("forgotUserPassword.js: onSubmit(): Success Response");
                });
            }
        });
	}

    render() {
        return (
			<div class="forgotContainer">

				<h2 class="forgotH2">Forgot Password ? No Worry !!!</h2>

				<form method="POST" onSubmit={this.onSubmit}>
					<label class="forgotLabel" for="email">Enter your email address:</label>
					<input class="forgotEmail" type="email" id="email" name="email" required/>
					<input class="forgotSubmit" type="submit" value="Submit"/>
				</form>

                <div class="error">
                    <label id="errorMessage"></label>
                </div>

			</div>
        );
    }
}

export default ForgotUserPassword;