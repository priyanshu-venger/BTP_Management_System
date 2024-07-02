import React,{useState} from "react"
import axios from "axios";
import { NavLink,redirect,useLocation,useNavigate } from "react-router-dom";
import './login.css';
import { useEffect } from "react";
import './btp_list.css'
import { BsSearch } from 'react-icons/bs';
function Approve_co_guide(props){
    axios.defaults.headers.post['Content-Type'] = 'application/json';
    axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
    const [list, setlist] = useState([]);
    let [show,setshow]=useState([]);
    const navigate=useNavigate();
    let [type,settype]=useState("");
    let [searchVal, setSearchVal] = useState("");
    useEffect(()=>{
        if(localStorage.getItem("id")===null || localStorage.getItem("role")!=="faculty") navigate('/login');
    },[localStorage.getItem["id"]]);
    useEffect(() => {
        const fetchlist = async () => {
                const response = await axios.post('http://127.0.0.1:5000/co_guide_applications',{id:localStorage.getItem("id"),role:localStorage.getItem("role")})
                    .then((response) => {
                        console.log(response.data);
                        setlist(response.data.applications);
                        setshow(list);
                        settype('Department');
                        }
                    );
            
        };
        fetchlist();

    }, []);
    useEffect(() => {
        handleSearchClick();
    }, [searchVal, type,list]);

    const sendreq = async(project,index) => {
        const updatedProjects = [...list];
        const response= await axios.post(`http://127.0.0.1:5000/approve_application/${project._id}`,{id:localStorage.getItem("id"),application_id:project._id,role:localStorage.getItem("role")})
        .then((response)=>{
            updatedProjects[index] = { ...project, status:response.data.status};
            
        })
        setlist(updatedProjects);
    }
    const sendrej = async(project,index) => {
        const updatedProjects = [...list];
        const response= await axios.post(`http://127.0.0.1:5000/change_application_status/${project._id}`,{action:'reject'})
        .then((response)=>{
            updatedProjects[index] = { ...project, status:response.data.status};
        })
        setlist(updatedProjects);
    }
    const handleSearchClick=()=>{
        if (searchVal === "") { setshow(list); return; }
        const filterBySearch = list.filter((item) => {
            if(type==='Department'){
                if (item.department.toLowerCase()
                    .includes(searchVal.toLowerCase())) { return item; }
            }
            else if(type==='Roll number'){
                if (item.roll_no.toLowerCase()
                    .includes(searchVal.toLowerCase())) { return item; }
            }
            else if(type==="Application ID"){
                if (item.id.toLowerCase()
                    .includes(searchVal.toLowerCase())) { return item; }
            }
        })
        setshow(filterBySearch);
        return;
    }
    return (
        <>
            
            <div class="container1">
            <h1>Applications list</h1>
            <div onChange={e=>settype(e.target.name)} style={{ padding: 50 }}>
                <input type="radio" value="Search by department" name="Department" checked={type==='Department'}/> Search by department
                <input type="radio" value="Search by application ID" name="Project" checked={type==='Project'}/> Search Application ID
                <input type="radio" value="Search by name of student" name="Roll" checked={type==='Roll'}/> Search by student roll
            </div>
            <div>
                <input onChange={e => setSearchVal(e.target.value)}>
                </input>
                <BsSearch onClick={handleSearchClick} />
            </div>
                <table>
                    <tr>
                        <th>Index</th>
                        <th>Application ID</th>
                        <th>BTP ID</th>
                        
                        <th>Faculty name</th>
                        <th>Email</th>
                        <th>BTP name</th>
                        <th>Status</th>
                    </tr>
                        {show.map((project, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{project._id}</td>
                                <td>{project.btp_id}</td>
                                
                                <td>{project.faculty_name}</td>
                                <td>{project.faculty_email}</td>
                                <td>{project.btp_name}</td>
                                <td>{project.status}</td>
                                <td> <button type='button' className='btn btn-primary flex-row-reverse' hidden={project.status!=="Pending" && localStorage.getItem['role']!=="teacher"?true:false} onClick={()=>sendreq(project,index)}>Approve</button></td>
                                
                                <td> <button type='button' className='btn btn-primary flex-row-reverse' onClick={()=>sendrej(project,index)}>Reject</button></td>
                            </tr>

                                ))}
                                                
                </table>
            </div>
                                    
        </>

    );
}
export default Approve_co_guide;

