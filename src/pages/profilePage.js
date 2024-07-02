import React, { Component }from "react";
import {createRoot} from "react-dom/client"
import './index.css';

import FacultyPage from "./facultyPage";
import StudentPage from "./studentPage";
import Header from '../components/header';
var configSettings = require('./config/configSettings.js');
var config = configSettings.config;

class ProfilePage extends Component {

    constructor(props) {
        super(props);

        this.onBack = this.onBack.bind(this);
    }

    onBack() {
        if (this.props.from === 'student') {
            const container = document.getElementById('root');
            const root = createRoot(container);
            root.render(<StudentPage data={this.props.data}/>);
        }
        else if (this.props.from === 'faculty') {
            const container = document.getElementById('root');
            const root = createRoot(container);
            root.render(<FacultyPage data={this.props.data}/>);
        }
    }

    render() {
        return (
            <div className="App">
            <Header />
            <div class="forgotContainer">
                <h1>User Profile</h1>
                <div class="profile-info">
                    <h2>Profile of {this.props.data.id}</h2>
                    <p>Name: {this.props.data.full_name}</p>
                    <p>Email: {this.props.data.email}</p>
                    <p>Department: {this.props.data.department}</p>
        
                    <div class="buttons">
                        <button class="button" onClick={this.onBack}>Back</button>
                    </div>
                </div>
            </div>
            </div>
        );
    }
}

export default ProfilePage;