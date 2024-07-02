import React,{useState} from "react"
import axios from "axios";
import { NavLink,useLocation,useNavigate } from "react-router-dom";
// import './login.css';
import { useEffect } from "react";
import './apply_for.css'
import { BsSearch } from 'react-icons/bs';
function Apply_Co_guide(props){
    axios.defaults.headers.post['Content-Type'] = 'application/json';
    axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
    const [list, setlist] = useState([]);
    const navigate=useNavigate();
    const [checkedState, setCheckedState] = useState(
        new Array(1).fill(false)
    );
    const location=useLocation();
    useEffect(()=>{
        if(localStorage.getItem("id")===null) navigate('/login');
        else if(localStorage.getItem("role")!=="student") navigate('/index');
    },[]);
    useEffect(() => {
        console.log(location.state);
        const fetchlist = async () => {
            const baseUrl= `http://127.0.0.1:5000/view_selected_co_guides/${location.state}`;
            const queryParams = {
                id: localStorage.getItem("id"),
                role: localStorage.getItem("role"),
              };
            const url = `${baseUrl}?${new URLSearchParams(queryParams).toString()}`;

            const response = await fetch(url.toString(), {
                method: 'GET',
                mode: 'cors',
                headers: {
                  'Content-Type': 'application/json',
                },
                // body:JSON.stringify({ 'id': localStorage.getItem("id"), 'role': localStorage.getItem("role") }),
              })
            
            .then((response) => {
                response.json().then((data) => {
                    console.log(data.co_guides);
                    setlist(data.co_guides);
                    setCheckedState(new Array(data.co_guides.length).fill(false));
                    console.log(checkedState,list.length);
                })
                }
            );
        };
        fetchlist();

    }, []);

    const handlesubmit = () => {
        console.log(list);
        const selected = list
        .filter((item, index) => checkedState[index]) // Filter based on checkedState
        .map(item => ({ _id: item._id }));

        console.log(selected);
        fetch(`http://127.0.0.1:5000/send_applications_to_co_guides/${location.state}`, {
            method: 'POST',
			mode: 'cors',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ 'id': localStorage.getItem("id"), 'role': localStorage.getItem("role") ,"co_guides":selected}),
        })
        .then((response) => {
            if (response.status !== 200) {
				response.json().then((data) => {
					var errorMessage = document.getElementById("errorMessage");
					errorMessage.innerHTML = data.error;
				});
            }
        })
		.catch((errorResponse) => {
			console.log("errorResponse.status: ", errorResponse);
		});
    }
    const handle = (position) => {
            const updatedCheckedState = [...checkedState];
            updatedCheckedState[position] = !updatedCheckedState[position];
            setCheckedState(updatedCheckedState);
            console.log(checkedState);
        
    };
    
    return (
        <>
            
            <div class="container2">
                <h1 class="title">Select Co-Guide</h1>
                <div>
                    <div class="form-group">

                        <label for="co_guide" class="select">Select Co-Guide:</label>
                        {list.map((guide, index) => (
                            <tr key={index}>
                            <div class="form-check">
                                <input class="form-check-input1" type="checkbox" id={guide['_id']} value={guide['_id']} name="co_guides" onClick={() => handle(index)}/>
                                
                            </div>
                            
                            <label class="form-check-label" for={guide['_id']}>{guide['full_name']}</label>
                            </tr>
                        ))}
                    </div>
                    {/* <div class="form-group">
                    <label for="message" class="select">Message (optional):</label>
                    <textarea id="message" class="form-control" name="message" rows="4"></textarea>
                    </div> */}
                    <button type="submit" class="btn btn-primary" onClick={handlesubmit}>Submit</button>
                </div>
            </div>
                                    
        </>

    );
}
export default Apply_Co_guide;