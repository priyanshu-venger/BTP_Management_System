import React, { Component }from "react";
import {createRoot} from "react-dom/client"
import './index.css';

import ProfilePage from "./profilePage";

var configSettings = require('./config/configSettings.js');
var config = configSettings.config;

class StudentPage extends Component {

    constructor(props) {
        super(props);

        this.onViewProfile = this.onViewProfile.bind(this);
    }

    onViewProfile() {
        const container = document.getElementById('root');
        const root = createRoot(container);
        root.render(<ProfilePage data={this.props.data} from="student"/>);
    }

    render() {
        return (
			<div class="forgotContainer">
				<h2 class="forgotH2">Student Page</h2>
                <label><a class="reg" onClick={this.onViewProfile}>View Profile</a></label>
			</div>
        );
    }
}

export default StudentPage;