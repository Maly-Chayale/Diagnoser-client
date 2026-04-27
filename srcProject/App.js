import logo from './logo.svg';
import './App.css';


import { Link, Route, Routes } from 'react-router-dom';
import { SiCodechef } from "react-icons/si";

import Home from './features/home/Home';
import Login from './features/users/Login';
import Register from './features/users/Register';
import RecipiesList from './features/recipies/RecipiesList';
import AddRecipy from './features/recipies/AddRecipy';
import UserProfile from './features/users/UserProfile';
import { useDispatch, useSelector } from 'react-redux';
import { onUserLoggedOut } from './features/users/usersSlice';
import Details from './features/recipies/DetailsReciepy';
import { useEffect } from 'react';
import axios from 'axios';
import { RecipiesArivvedFromServer } from './features/recipies/recipiesSlice';



function App() {

  const loggedInUser = useSelector(state => state.users.loggedInUser);
  const dispatch = useDispatch();

  useEffect(() => {
   axios.get("http://localhost:8000/Recipies").then (res =>{
        const recipy  = res.data;
        dispatch(RecipiesArivvedFromServer(recipy));
   })
    
  },[])
  return (
    <div className="App" >
      <header>
        <div id="logo">
          {/* <SiCodeshef fontSize={"3rem"} />מיסטר שף */}
          <div fontSize={"3rem"}>מיסטר שף</div>
        </div>
        <nav>
          <Link to="/Home">דף הבית</Link>
          <Link to="/Recipies">מתכונים</Link>
          {loggedInUser == null && <Link to="/Login">התחברות</Link>}
          {loggedInUser == null && <Link to="/Register">הרשמה</Link>}
          {loggedInUser != null && <Link to="/user-profile"> הפרופיל שלי</Link>}
          {loggedInUser != null && <Link to="/add-recipies ">הוספת מתכון</Link>}
          {loggedInUser != null &&  <button onClick={()=>{dispatch(onUserLoggedOut())}}>התנתקות</button>}

          {/* {loggedInUser!=null && <p>שלום ל: {loggedInUser.username}</p>}  */}
        </nav>
      </header>
      <Routes >
        {/* <Route path="/" element={<Home />} /> */}
        <Route path="/Login" element={<Login />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/Recipies" element={<RecipiesList />} />
        <Route path="/add-recipies" element={<AddRecipy />} />
        <Route path="/user-profile" element={<UserProfile />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/Details/:name/:author/:numOfproducts/:time/:level/:desc/:category/:ingredients/:instructions" element={<Details />} />
       
      </Routes>
    {/* <button onClick={()=>{ getAllReciepiesFromServer() }}>לחץ כאן לקבלת המוצרים</button> */}
    </div>


  );
}

export default App;



