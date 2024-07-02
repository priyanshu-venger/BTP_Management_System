import { useEffect } from "react";
import { NavLink,useNavigate } from "react-router-dom";

const LogoutForm = () => {
  
  const navigate=useNavigate();
  
  useEffect(()=>{
    console.log("here");
    localStorage.clear();
    console.log("here");
    fetch(`http://127.0.0.1:5000/logout`, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      // body: JSON.stringify(loginJson),
    })
      .then((response) => {
        localStorage.clear();
        // Redirect the user to the login page
        navigate('/login');
      })
      .catch(error => {
        console.log(error);
      });
  },[]);
}
export default LogoutForm;
