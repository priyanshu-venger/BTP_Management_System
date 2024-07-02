import React, { Component } from 'react'
import logo from './assets/img/Air-India-logo.png'
import './footer.css'
class Footer extends Component{
    render(){
        return (
            <>
            <footer>
                <div>
			<h4>Indian Airlines 2023 &copy; All Rights Reserved.</h4>
			<img src={logo} alt =" logo" height="8%" width="8%"/>
		</div>
        </footer>
            </>
        )
    }
}

export default Footer