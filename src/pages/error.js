import { useLocation } from 'react-router-dom';
export default function Error_(){
    const location=useLocation();
    return(
        <>
        <head>
        <meta http-equiv="refresh" content="3;url=/home" />
        </head>
        <body>
        <div style={{ textAlign: "center" }}>
        <h1 hidden={location.state!=="gone"?true:false}>These seats are already taken<br />Your ticket is being cancelled</h1>
        
        <h1 hidden={location.state!=="success"?true:false}>Payment successful</h1>
        <p>Returning to home...</p>
        </div>
        </body>
        </>
    )
}