import React, { useState } from "react";
import "./ProfileEditor.css";
import { useSelector, useDispatch } from "react-redux";
import { updateDiagnoser } from "../Diagnosers/DiagnoserSlice";
import { UpdateUser } from "../SignIn/LogInSlice";
import { getType } from "../WorkShop/WorkShopSlice";

const ProfileEditor = () => {
  const customer = useSelector(state => state.LogIn.thisUser);
  const dispatch = useDispatch();



  return (
    <div className="profile-container">
      <div className="profile-header2">שם: <br></br></div>
      <div className="profile-header">{customer.name}</div><br></br>
      <div className="profile-header2">מייל: <br></br></div>
      <div className="profile-header">{customer.mail}</div><br></br>
      <div className="profile-header2">פלאפון: <br></br></div>
      <div className="profile-header">{customer.phone}</div><br></br>
      <div className="profile-header2">סוג קבוצה: <br></br></div>
      

      </div>
  );
};

export default ProfileEditor;