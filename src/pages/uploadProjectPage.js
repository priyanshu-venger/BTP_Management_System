import React, { Component }from "react";
import {createRoot} from "react-dom/client"
import './index.css';

import FacultyPage from "./facultyPage";

var configSettings = require('./config/configSettings.js');
var config = configSettings.config;

class UploadProjectPage extends Component {

    constructor(props) {
        super(props);

        this.onSubmit = this.onSubmit.bind(this);
    }

    onSubmit(evt) {
        evt.preventDefault();

        var btpNameElem = document.getElementById("btp_name");
        console.log("uploadProjectPage: onSubmit(): btpNameElem.value: ", (btpNameElem) ? btpNameElem.value : "null");
        var projectFileElem = document.getElementById("project_file");
        console.log("uploadProjectPage: onSubmit(): projectFileElem.value: ", (projectFileElem) ? projectFileElem.value : "null");

        var formData = new FormData();
        formData.append("btp_name", btpNameElem.value);
        formData.append("project_file", projectFileElem.files[0]);
        formData.append('id',localStorage.getItem('id'));
        formData.append('role',localStorage.getItem('role'));
        fetch(`${config.btpUploadProjectURL}`,
            {
                method: 'POST',
                mode: 'cors',
                body: formData
            }
        )
        .then((response) => {
            if (response.status !== 200) {
                console.log("uploadProjectPage: onSubmit(): Upload file failed");
                response.json().then((data) => {
                    var errorMessage = document.getElementById("errorMessage");
                    errorMessage.innerHTML = data.error;
                });
            }
            else {
                console.log("uploadProjectPage: onSubmit(): Upload file succeeded");
                const container = document.getElementById('root');
                const root = createRoot(container);
                root.render(<FacultyPage data={this.props.data}/>);
            }
        });
    }

    render() {
        return (
            <div class="forgotContainer">
                <h2>Upload BTP Project</h2>
                <form method="post" enctype="multipart/form-data" onSubmit={this.onSubmit}>
                    <div class="form-group">
                        <label htmlFor="btp_name">BTP Name:</label>
                        <input type="text" class="form-control" id="btp_name" name="btp_name" required/>
                    </div>
                    <div class="form-group">
                        <label htmlFor="project_file">Project File:</label>
                        <input type="file" class="form-control-file" id="project_file" name="project_file" required/>
                    </div>
                    <button type="submit" class="btn btn-primary">Upload</button>
                </form>

                <div class="error">
                    <label id="errorMessage"></label>
                </div>

            </div>
        );
    }
}

export default UploadProjectPage;