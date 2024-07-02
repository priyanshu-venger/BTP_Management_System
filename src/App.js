import './App.css';
import Header from './components/header';
import LogoutForm from './pages/logout';
import { BrowserRouter, Routes, Route,Navigate } from 'react-router-dom';
import Approve from './pages/approve';
import Approve_co_guide from './pages/approve_co_guide';
import Approvedlist from './pages/approved_list';
import Error_ from './pages/error';
import Btplist from './pages/btp_list';
import Apply_Co_guide from './pages/apply_for_co_guide';
import Co_guide from './pages/select_co_guide';
import Mylist from './pages/list';
import App1 from './pages/index';
import Signup from './pages/signup';
import ProfilePage from './pages/profilePage';
import ForgotUserPassword from './pages/forgotUserPassword';
import UploadProjectPage from './pages/uploadProjectPage';
function App() {
  return (
    <div className="App">
      <Header />
      <BrowserRouter>
        <Routes>
          <Route path='/login' element={<App1/>}/>
          <Route path='/signup' element={<Signup/>}/>
          {/* <Route path='/profile' element={<ProfilePage/>}/> */}
          <Route path='/forgot' element={<ForgotUserPassword/>}/>
          <Route path='/index' element={<App1/>}/>
          <Route path='/' element={<App1/>}/>
          <Route path='/approve' element={<Approve/>}/>
          <Route path='/approve_co_guide' element={<Approve_co_guide/>}/>
          <Route path='/approved_list' element={<Approvedlist/>}/>
          <Route path='/logout' element={<LogoutForm/>}/>
          <Route path='/applied_list' element={<Mylist/>}/>
          <Route path='/error' element={<Error_ />}/>
          <Route path='/list' element={<Btplist />}/>
          <Route path='/select_co_guides' element={<Co_guide/>}/>
          <Route path='/view_selected_co_guides' element={<Apply_Co_guide/>}/>
          <Route path='/upload' element={<UploadProjectPage/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
