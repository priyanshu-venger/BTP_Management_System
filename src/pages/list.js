import React, { useState, useEffect } from "react";
import axios from "axios";
import './btp_list.css';
import { BsSearch } from 'react-icons/bs';
import { useNavigate } from "react-router-dom";
function Mylist(props) {

    const [list, setList] = useState([]);
    const [show, setShow] = useState([]);
    const [type, setType] = useState("");
    const [searchVal, setSearchVal] = useState("");
    const [status, setstatus] = useState(false);
    const navigate=useNavigate();
    useEffect(() => {
        setType('Department');
        const fetchlist = async () => {
            axios.defaults.headers.post['Content-Type'] = 'application/json';
            axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
                const response = await axios.post('http://127.0.0.1:5000/applied_projects',{id:localStorage.getItem("id"),role:localStorage.getItem("role")})
                    .then((response) => {
                        console.log(response.projects);
                        setList(response.data.projects);
                        setShow(list);
                        
                        }
                    );
            
        };
        fetchlist();

    }, []);

    useEffect(() => {
        handleSearchClick();
    }, [searchVal, type, list]);

    const handleSearchClick = () => {
        if (searchVal === "") { setShow(list); return; }
        const filterBySearch = list.filter((item) => {
            if (type === 'Department') {
                return item.department.toLowerCase().includes(searchVal.toLowerCase());
            } else if (type === 'Professor') {
                return item.prof_name.toLowerCase().includes(searchVal.toLowerCase());
            } else {
                return item.btp_name.toLowerCase().includes(searchVal.toLowerCase());
            }
        });
        setShow(filterBySearch);
    };

    return (
        <div className="body1">
            <div className="container1">
                <h1 className="title">Applied List</h1>
                <div onChange={e => setType(e.target.name)} className="search-options" style={{ padding: 50 }}>
                    
                        <input type="radio" className="search-radio" value="Search by department" name="Department" checked={type === 'Department'} /> Search by Department
                        <br></br>
                    
                    
                        <input type="radio" className="search-radio" value="Search by project" name="Project" checked={type === 'Project'} /> Search by Project
                        <br></br>

                    
                        <input type="radio" className="search-radio" value="Search by professor" name="Professor" checked={type === 'Professor'} /> Search by Professor
                        <br></br>
                </div>
                <div className="search-input">
                    <input className="search-field" placeholder="Search..." onChange={e => setSearchVal(e.target.value)} />
                    <div className="search-button" onClick={handleSearchClick}>Search</div>
                </div>
                <table className="project-table">
                    <thead>
                        <tr>
                            <th className="index">Index</th>
                            <th className="project-id">Application ID</th>
                            <th className="project-id">Project ID</th>
                            <th className="name">Name</th>
                            <th className="professor">Professor</th>
                            <th className="email">Email</th>
                            <th className="department">Department</th>
                            <th className="download">Download</th>
                            <th className="status">Status</th>
                        </tr>
                    </thead>
                    <tbody className="project-list">
                        {show.map((project, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{project.application_id}</td>
                                <td>{project.btp_id}</td>
                                <td>{project.btp_name}</td>
                                <td>{project.prof_name}</td>
                                <td>{project.prof_email}</td>
                                <td>{project.department}</td>
                                <td><a href={`http://127.0.0.1:5000/file/${project.project_file_id}`} className="download-link" target="_blank">Download</a></td>
                                <td>{project.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Mylist;
