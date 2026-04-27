import React, { useState } from "react";
import "./ProfileEditor.css";
import { useSelector, useDispatch } from "react-redux";
import { updateDiagnoser } from "../Diagnosers/DiagnoserSlice";
import { UpdateUser } from "../SignIn/LogInSlice";

const ProfileEditor = () => {
  const diagnostician = useSelector(state => state.LogIn.thisUser);
  const dispatch = useDispatch();

  const [profile, setProfile] = useState(diagnostician);
  const [editing, setEditing] = useState(false);
  const [tempProfile, setTempProfile] = useState({ ...diagnostician });

  const handleChange = (field, value) => setTempProfile({ ...tempProfile, [field]: value });
  const handleCheckboxChange = (field) => setTempProfile({ ...tempProfile, [field]: !tempProfile[field] });

  const startEditing = () => setEditing(true);
  const cancelEditing = () => {
    setTempProfile({ ...profile });
    setEditing(false);
  };

  const saveEditing = async() => {
    setProfile({ ...tempProfile });
    dispatch(UpdateUser(tempProfile))
    await dispatch(updateDiagnoser(tempProfile))
    setEditing(false);
    console.log("פרופיל מעודכן:", tempProfile);
  };

  const renderField = (label, value, fieldKey, editable = true) => (
    <div className={`field-wrapper ${editing && editable ? "editing" : ""}`}>
      <span className="field-label">{label}:</span>
      {editing && editable ? (
        <input
          className="editable-input"
          value={tempProfile[fieldKey]}
          onChange={(e) => handleChange(fieldKey, e.target.value)}
        />
      ) : (
        <span className="field-value">{value}</span>
      )}
    </div>
  );

  const renderCheckbox = (label, fieldKey) => (
    <div className={`checkbox-container ${editing ? "editing" : ""}`}>
      {editing ? (
        <>
          <input type="checkbox" checked={tempProfile[fieldKey]} onChange={() => handleCheckboxChange(fieldKey)} />
          <span className="checkbox-label">{label}</span>
        </>
      ) : (
        <span className="field-value">{label}: {profile[fieldKey] ? "כן" : "לא"}</span>
      )}
    </div>
  );

  return (
    <div className="profile-container">
      <div className="profile-header">שם: {profile.name}</div>

      {renderField("קוד", profile.code, "code", false)}
      {renderField("אימייל", profile.mail, "mail", false)}
      {renderField("אחוז תשלום", profile.precentagePayment, "precentagePayment", false)}
      {renderField("שם", profile.name, "name")}
      {renderField("טלפון", profile.phone, "phone")}

      {renderCheckbox("מורפולוגיה", "morphology")}
      {renderCheckbox("כירולוגיה", "chirology")}
      {renderCheckbox("גרפולוגיה", "graphology")}
      {renderCheckbox("זמינה", "available")}

      <div className="button-container">
        {editing ? (
          <>
            <button className="profile-button" onClick={saveEditing}>שמירה</button>
            <button className="profile-button cancel-button" onClick={cancelEditing}>ביטול</button>
          </>
        ) : (
          <button className="profile-button" onClick={startEditing}>לשנות פרטים?</button>
        )}
      </div>
    </div>
  );
};

export default ProfileEditor;