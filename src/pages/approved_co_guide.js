// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import './btp_list.css';
// import { BsSearch } from 'react-icons/bs';

// function Btplist(props) {

//     const [list, setList] = useState([]);
//     const [show, setShow] = useState([]);

//     useEffect(() => {
//         setType('Department');
//         const fetchList = async () => {
//             axios.defaults.headers.post['Content-Type'] = 'application/json';
//             axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
//             const response = await axios.get(`http://127.0.0.1:5000/view_selected_co_guides/${location.state}`)
//                     .then((response) => {
//                         setList(response.data.co_guides);
//                         setShow(list);
//                         }
//                     );
//         };
//         fetchList();
//     }, []);

//     return (
//         <div className="body1">
//             <div className="container1">
//                 <h1 className="title">BTP Projects List</h1>
//                 <div onChange={e => setType(e.target.name)} className="search-options" style={{ padding: 50 }}>
                    
//                         <input type="radio" className="search-radio" value="Search by department" name="Department" checked={type === 'Department'} /> Search by Department
//                         <br></br>
                    
                    
//                         <input type="radio" className="search-radio" value="Search by project" name="Project" checked={type === 'Project'} /> Search by Project
//                         <br></br>

                    
//                         <input type="radio" className="search-radio" value="Search by professor" name="Professor" checked={type === 'Professor'} /> Search by Professor
//                         <br></br>
//                 </div>
//                 <div className="search-input">
//                     <input className="search-field" placeholder="Search..." onChange={e => setSearchVal(e.target.value)} />
//                     <div className="search-button" onClick={handleSearchClick}>Search</div>
//                 </div>
//                 <table className="project-table">
//                     <thead>
//                         <tr>
//                             <th className="index">Index</th>
//                             <th className="project-id">Professor ID</th>
//                             <th className="professor">Professor</th>
//                         </tr>
//                     </thead>
//                     <tbody className="project-list">
//                         {show.map((project, index) => (
//                             <tr key={index}>
//                                 <td>{index + 1}</td>
//                                 <td>{project._id}</td>
//                                 <td>{project.full_name}</td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>
//         </div>
//     );
// }

// export default Btplist;
// import React,{useState} from "react"
// import axios from "axios";
// import { NavLink,redirect,useLocation,useNavigate } from "react-router-dom";
// import './login.css';
// import { useEffect } from "react";
// import './btp_list.css'
// import { BsSearch } from 'react-icons/bs';
// function Approve_co_guide(props){
//     axios.defaults.headers.post['Content-Type'] = 'application/json';
//     axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
//     const [list, setlist] = useState([]);
//     let [show,setshow]=useState([]);
//     const navigate=useNavigate();
//     let [type,settype]=useState("");
//     let [searchVal, setSearchVal] = useState("");
//     useEffect(()=>{
//         if(localStorage.getItem("id")===null || localStorage.getItem("role")!=="faculty") navigate('/login');
//     },[localStorage.getItem["id"]]);
//     useEffect(() => {
//         const fetchlist = async () => {
//                 const response = await axios.post('http://127.0.0.1:5000/co_guide_applications/',{id:localStorage.getItem("id"),role:localStorage.getItem("role")})
//                     .then((response) => {
//                         console.log(response.data);
//                         setlist(response.data.applications);
//                         setshow(list);
//                         settype('Department');
//                         }
//                     );
            
//         };
//         fetchlist();

//     }, []);
//     useEffect(() => {
//         handleSearchClick();
//     }, [searchVal, type,list]);

//     const sendreq = async(project,index) => {
//         const updatedProjects = [...list];
//         const response= await axios.post(`https://127.0.0.1:5000/approve_application/${project.application_id}`,{application_id:project.application_id})
//         .then((response)=>{
//             updatedProjects[index] = { ...project, status:response.data.status};
//             if(project.department!==localStorage['department']){
//                 navigate('/select_co_guides',{application_id:project.application_id});
//             }
//         })
//         setlist(updatedProjects);
//     }
//     const sendrej = async(project,index) => {
//         const updatedProjects = [...list];
//         const response= await axios.post(`https://127.0.0.1:5000/change_application_status/${project.application_id}`,{action:'reject'})
//         .then((response)=>{
//             updatedProjects[index] = { ...project, status:response.data.status};
//         })
//         setlist(updatedProjects);
//     }
//     const handleSearchClick=()=>{
//         if (searchVal === "") { setshow(list); return; }
//         const filterBySearch = list.filter((item) => {
//             if(type==='Department'){
//                 if (item.department.toLowerCase()
//                     .includes(searchVal.toLowerCase())) { return item; }
//             }
//             else if(type==='Roll number'){
//                 if (item.roll_no.toLowerCase()
//                     .includes(searchVal.toLowerCase())) { return item; }
//             }
//             else if(type==="Application ID"){
//                 if (item.id.toLowerCase()
//                     .includes(searchVal.toLowerCase())) { return item; }
//             }
//         })
//         setshow(filterBySearch);
//         return;
//     }
//     return (
//         <>
            
//             <div class="container1">
//             <h1>Applications list</h1>
//             <div onChange={e=>settype(e.target.name)} style={{ padding: 50 }}>
//                 <input type="radio" value="Search by department" name="Department" checked={type==='Department'}/> Search by department
//                 <input type="radio" value="Search by application ID" name="Project" checked={type==='Project'}/> Search Application ID
//                 <input type="radio" value="Search by name of student" name="Roll" checked={type==='Roll'}/> Search by student roll
//             </div>
//             <div>
//                 <input onChange={e => setSearchVal(e.target.value)}>
//                 </input>
//                 <BsSearch onClick={handleSearchClick} />
//             </div>
//                 <table>
//                     <tr>
//                         <th>Index</th>
//                         <th>Application ID</th>
//                         <th>BTP ID</th>
//                         <th>Roll no</th>
//                         <th>Student name</th>
//                         <th>Email</th>
//                         <th>Department</th>
//                         <th>Status</th>
//                     </tr>
//                         {show.map((project, index) => (
//                             <tr key={index}>
//                                 <td>{index + 1}</td>
//                                 <td>{project._id}</td>
//                                 <td>{project.btd_id}</td>
//                                 <td>{project.roll_no}</td>
//                                 <td>{project.student_name}</td>
//                                 <td>{project.email}</td>
//                                 <td>{project.department}</td>
//                                 <td>{project.status}</td>
//                                 <td> <button type='button' className='btn btn-primary flex-row-reverse' hidden={project.status!=="Pending" && localStorage.getItem['role']!=="teacher"?true:false} onClick={()=>sendreq(project,index)}>Approve</button></td>
                                
//                                 <td> <button type='button' className='btn btn-primary flex-row-reverse' onClick={()=>sendrej(project,index)}>Reject</button></td>
//                             </tr>

//                                 ))}
                                                
//                 </table>
//             </div>
                                    
//         </>

//     );
// }
// export default Approve_co_guide;

import React, { useState, useEffect } from "react";
import axios from "axios";
import './btp_list.css';
import { BsSearch } from 'react-icons/bs';

function Btplist(props) {

    const [list, setList] = useState([]);
    const [show, setShow] = useState([]);
    const [type, setType] = useState("");
    const [searchVal, setSearchVal] = useState("");

    useEffect(() => {
        setType('Department');
        const fetchList = async () => {
            axios.defaults.headers.post['Content-Type'] = 'application/json';
            axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
            const response = await axios.post('http://127.0.0.1:5000/co_guide_applications',JSON.stringify({id:localStorage.getItem("id"),role:localStorage.getItem("role")}))
                    .then((response) => {
                        console.log(response.data);
                        setList(response.data.applications);
                        setShow(list);
                        setType('Department');
                        }
                    );
        };
        fetchList();
    }, []);

    useEffect(() => {
        handleSearchClick();
    }, [searchVal, type, list]);

    const sendReq = async (project, index) => {
        // Logic for sending request
        const response = await axios.post(`http://127.0.0.1:5000/approve_application/${project._id}`,JSON.stringify({id:localStorage.getItem("id"),role:localStorage.getItem("role")}))
                    .then((response) => {
                        console.log(response.data);
                        setList(response.data.applications);
                        setShow(list);
                        setType('Department');
                        }
                    );
        const updatedProjects = [...list];
        updatedProjects[index] = { ...project, status: "Accepted" };
        setList(updatedProjects);
    };

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
                <h1 className="title">BTP Projects List</h1>
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
                            <th className="download">Roll</th>
                            <th className="status">Status</th>
                        </tr>
                    </thead>
                    <tbody className="project-list">
                        {show.map((project, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{project._id}</td>
                                <td>{project.btp_id}</td>
                                <td>{project.btp_name}</td>
                                <td>{project.faculty_name}</td>
                                <td>{project.faculty_email}</td>
                                <td>{project.roll_no}</td>
                                <td>
                                    <input type='button' className='btn btn-primary flex-row-reverse' value={project.status} disabled={project.status !== "Applied for Co-Guide"} onClick={() => sendReq(project, index)} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Btplist;
