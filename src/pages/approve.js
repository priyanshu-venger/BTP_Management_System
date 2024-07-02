import React,{useState} from "react"
import axios from "axios";
import { NavLink,redirect,useLocation,useNavigate } from "react-router-dom";
import './login.css';
import { useEffect } from "react";
import './btp_list.css'
import { BsSearch } from 'react-icons/bs';
function Approve(props){
    const [list, setlist] = useState([]);
    const [Project,setproject]=useState([]);
    const [show,setshow]=useState([]);
    const navigate=useNavigate();
    let [type,settype]=useState("");
    let [searchVal, setSearchVal] = useState("");
    useEffect(()=>{
        if(localStorage.getItem("id")===null) navigate('/login');
        else if(localStorage.getItem("role")!=="faculty") navigate('/index');
    },[localStorage.getItem("id")]);
    axios.defaults.headers.post['Content-Type'] = 'application/json';
    axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
    useEffect(() => {
        settype('Department');
        const fetchlist = async () => {
            console.log(localStorage.getItem('id'),localStorage.getItem('role'))
            fetch('http://127.0.0.1:5000/application_list', {
                method: 'POST',
                mode: 'cors',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({'id':localStorage.getItem("id"),'role':localStorage.getItem("role")}),
              })
              .then((response) => {
                response.json().then((data) => {
                        console.log(data);
                        setshow(data.applications_per_project);
                        setlist(data.applications_per_project);
                        setproject(data.project_name);
                        }
                    );
                });
            
        };
        fetchlist();

    }, []);
    useEffect(() => {
        handleSearchClick();
    }, [searchVal, type,list]);

    const sendreq = async(project,key,index) => {
        const updatedProjects = [...list[key]];
        axios.defaults.headers.post['Content-Type'] = 'application/json';
        axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
        console.log(project.id);
        if(project.department!==localStorage.getItem('department')){
            navigate('/select_co_guides',{state:project.id});
        }
        else{
            const response= await axios.post(`http://127.0.0.1:5000/application_approval/${project.id}`,JSON.stringify({'action':'approve','id':localStorage.getItem('id'),'role':localStorage.getItem('role')}))
            .then((response)=>{
                console.log(response.error);
                updatedProjects[index] = { ...project, status:response.data.status};
                
            })
            setlist(updatedProjects);
        }
    }
    const sendrej = async(project,index) => {
        const response= await axios.post(`http://127.0.0.1:5000/change_application_status/${project.id}`,JSON.stringify({'action':'reject','id':localStorage.getItem('id'),'role':localStorage.getItem('role')}))
        
        .then((response)=>{
            navigate("/approve");
        })
    }
    const handleSearchClick=()=>{
        if (searchVal === "") { setshow(list); return; }
        
        const filterBySearch = Object.fromEntries(Object.entries(list).reduce((result,[key,item]) => {
            if(type==="Project"){
                console.log("here");
                if (Project[key].toLowerCase()
                    .includes(searchVal.toLowerCase())) {
                        result.push([key,item]);
                        return result; 
                    }
            }
            else {
                // Filtering by department or roll number
                const filteredItems = item.filter(item1 => {
                  if (type === "Department") {
                    return item1.department.toLowerCase().includes(searchVal.toLowerCase());
                  } else if (type === "Roll") {
                    return item1.roll_no.toLowerCase().includes(searchVal.toLowerCase());
                  }
                  // Add additional conditions as needed
                  return false; // Default return
                });
                // If any item in the set satisfies the condition, include it
                if (filteredItems.length > 0) {
                  result.push([key, filteredItems]);
                }
              }
              return result;
            }, [])
          );
        
          console.log(filterBySearch);
          setshow(filterBySearch);
        };
    const Handleid=()=>{
        const filterBySearch = Object.fromEntries(Object.entries(Project).filter(([key,value]) => {
            if(key in show){
                console.log(key);
                return [key,value];
            }
        })
    )
        console.log(filterBySearch);
        return filterBySearch;
    }
    return (
        <>
           <div className="body1">
            <div className="container1">
                
                <div onChange={e => settype(e.target.name)} className="search-options" style={{ padding: 50 }}>
                    
                        <input type="radio" className="search-radio" value="Search by department" name="Department" checked={type === 'Department'} /> Search by Department
                        <br></br>
                    
                    
                        <input type="radio" className="search-radio" value="Search by project" name="Project" checked={type === 'Project'} /> Search by Project
                        <br></br>

                    
                        <input type="radio" className="search-radio" value="Search by Roll" name="Roll" checked={type === 'Roll'} /> Search by Roll
                        <br></br>
                </div>
                <div className="search-input">
                    <input className="search-field" placeholder="Search..." onChange={e => setSearchVal(e.target.value)} />
                    <div className="search-button" onClick={handleSearchClick}>Search</div>
                </div>
            <h1>Applications List</h1>
                {Object.keys(Handleid()).map((key)=>(
                <div>
                <h2>Project name:{Project[key]}</h2>
                <table className="project-table">
                    <tr>
                        <th>Index</th>
                        <th>Application ID</th>
                        <th>Roll no</th>
                        <th>Student name</th>
                        <th>Email</th>
                        <th>Department</th>
                        <th>Status</th>
                    </tr>
                        {console.log(key)}
                        {show[key].map((project, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{project.id}</td>
                                <td>{project.roll_no}</td>
                                <td>{project.student_name}</td>
                                <td>{project.email}</td>
                                <td>{project.department}</td>
                                <td>{project.status}</td>
                                <td> <input type='button' className='btn btn-primary flex-row-reverse' value={(project.status==='Pending')?'Approve':project.status} disabled={(project.status==='Pending')?false:true} onClick={()=>sendreq(project,key,index)}/></td>
                                
                                <td> <button type='button' className='btn btn-primary flex-row-reverse' disabled={(project.status==='Pending')?false:true} onClick={()=>sendrej(project,index)}>Reject</button></td>
                            </tr>
                    ))}    
                                                
                </table>
                </div>
                ))}
                </div>
                </div>
                                    
        </>

    );
}
export default Approve;
