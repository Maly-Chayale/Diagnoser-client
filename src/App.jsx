

import React, { useState } from 'react';
import { Routes, Route, NavLink } from "react-router-dom";
import { useSelector } from 'react-redux';
import styles from './App.module.css';

// דפים
import DiagnoserList from './features/Diagnosers/DiagnoserList';
import CustomersList from './features/Customers/CustomersList';
import Home from "./features/Home/Home";
import Workshop from "./features/WorkShop/WorkShop";
import DiagnoserDetails from './features/Diagnosers/DiagnoserDetails';
import SignIn from './features/SignIn/SignIn';
import LoginPage from './features/Home/LoginPage';
import LogIn from './features/SignIn/LogIn';
import ProfileWrapper from './features/Profile/ProfileWrapper';
import OdersAndReferences from './features/References/OdersAndReferences';
import ManagerPayments from './features/Profile/ManagerPayments';
import LeadsList from './features/Leads/LeadsList';
import { useLocation } from "react-router-dom";
import WorkshopDetails from './features/WorkShop/WorkshopDetails';

function App() {
  const statusUser = useSelector(state => state.LogIn.statusUser);
  const user = useSelector(state => state.LogIn.thisUser);

  const [hasAccess, setHasAccess] = useState(false);
  const location = useLocation();
  const authPaths = ["/enter", "/LogIn", "/SignIn"];

  return (
    <div>
      {/* ניווטים מופיעים רק אחרי לחיצה */}
      {hasAccess && (
        <nav>
          {user && <NavLink to="/Orders" className={({ isActive }) => isActive ? styles.active : styles.link}>הזמנות</NavLink>}
          {user && <NavLink to="/Profile" className={({ isActive }) => isActive ? styles.active : styles.link}>פרופיל</NavLink>}
          {!user && (
            <NavLink
              to="/enter"
              className={({ isActive }) =>
                (isActive || authPaths.includes(location.pathname))
                  ? styles.active
                  : styles.link
              }
            >
              התחברות/הרשמות
            </NavLink>
          )}          {/* {!user && <NavLink to="/SignIn" className={({ isActive }) => isActive ? styles.active : styles.link}>הרשמות </NavLink>} */}
          {user && <NavLink to="/hello" className={({ isActive }) => isActive ? styles.active : styles.link}>דף הבית</NavLink>}
          <NavLink to="/Workshop" className={({ isActive }) => isActive ? styles.active : styles.link}>סדנאות</NavLink>
          {(statusUser === "diagnoser" || statusUser === "Esty") && <NavLink to="/Customers" className={({ isActive }) => isActive ? styles.active : styles.link}>לקוחות</NavLink>}
          {(statusUser === "Esty") && <NavLink to="/Payments" className={({ isActive }) => isActive ? styles.active : styles.link}>תשלומים</NavLink>}
          {(statusUser === "Esty") && <NavLink to="/Leads" className={({ isActive }) => isActive ? styles.active : styles.link}>מתעניינים</NavLink>}
          <NavLink to="/Diagnosers" className={({ isActive }) => isActive ? styles.active : styles.link}>מאבחנות</NavLink>
        </nav>
      )}

      <div className={styles.pageContent}>
        <Routes>
          {/* דף ההשראה */}
          <Route path="/" element={<LoginPage setHasAccess={setHasAccess} />} />

          {/* כל שאר הדפים זמינים רק אחרי לחיצה */}

          <>
            <Route path="/enter" element={<LogIn />} />
            <Route path="/hello" element={<LoginPage setHasAccess={setHasAccess} />} />
            <Route path="/Workshop" element={<Workshop />} />
            <Route path="/Customers" element={<CustomersList />} />
            <Route path="/Diagnosers" element={<DiagnoserList />} />
            <Route path="/DiagnoserDetails/:code" element={<DiagnoserDetails />} />
            <Route path="/SignIn" element={<SignIn />} />
            <Route path="/LogIn" element={<LogIn />} />
            <Route path="/Orders" element={<OdersAndReferences />} />
            <Route path="/Orders/:code" element={<OdersAndReferences />} />
            <Route path="/Profile" element={<ProfileWrapper />} />
            <Route path="/WorkshopDetails/:code" element={<WorkshopDetails />} />
            <Route path="/Payments" element={<ManagerPayments />} />
            <Route path="/Leads" element={<LeadsList />} />
          </>

        </Routes>
      </div>
    </div>
  );
}

export default App;

