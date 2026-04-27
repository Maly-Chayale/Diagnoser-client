// import './App.css';
// import DiagnoserList from './features/Diagnosers/DiagnoserList';
// import CustomersList from './features/Customers/CustomersList';
// import { Router, Routes, Route, Link } from "react-router-dom";
// import Home from "./features/Home/Home";
// import Workshop from "./features/WorkShop/WorkShop";
// import DiagnoserDetails from './features/Diagnosers/DiagnoserDetails';
// import SignIn from './features/SignIn/SignIn';
// import LoginPage from './features/Home/LoginPage';
// import LogIn from './features/SignIn/LogIn';
// import { useSelector } from 'react-redux';
// import WorkshopDetails from './features/WorkShop/WorkshopDetails';
// import ProfileWrapper from './features/Profile/ProfileWrapper';
// import OdersAndReferences from './features/References/OdersAndReferences';
// import ManagerPayments from './features/Profile/ManagerPayments';

// function App() {

//   const statusUser = useSelector(state => state.LogIn.statusUser)
//   const user = useSelector(state => state.LogIn.thisUser)

//   return (
//     // <Router>
//     <div className="diagnosticians-page">
//       <nav className='main-nav'>
//         {user && <Link to="/Orders" className="link">הזמנות</Link>}
//         {user && <Link to="/Profile" className="link">פרופיל</Link>}
//         <Link to="/enter" className="link">דף הבית</Link>
//         <Link to="/Workshop" className="link">סדנאות</Link>
//         {(statusUser == "diagnoser" || statusUser == "Esty") && <Link to="/Customers"  className='link'>לקוחות</Link>}
//         {(statusUser == "Esty") && <Link to="/Payments"  className='link'>תשלומים</Link>}
//         <Link to="/Diagnosers" className='link'>מאבחנות</Link>
//       </nav>
//       <Routes>
//         <Route path="/" element={<LoginPage />} />
//         <Route path="/Workshop" element={<Workshop />} />
//         {/* <Route path="Workshop/:code"  element={< Workshop />} /> */}
//         <Route path="/Customers" element={<CustomersList />} />
//         <Route path="/Diagnosers" element={<DiagnoserList />} />
//         <Route path="/DiagnoserDetails/:code" element={<DiagnoserDetails />} />
//         {/* <Route path="/CustomerProfile/:index" element={<CustomerProfile />} /> */}
//         <Route path="/SignIn" element={<SignIn />} />
//         <Route path="/LogIn" element={<LogIn />} />
//         <Route path="/enter" element={<Home />} />
//         <Route path="/Orders" element={<OdersAndReferences />} />
//         <Route path="/Profile" element={<ProfileWrapper />} />
//         <Route path="/WorkshopDetails/:code" element={<WorkshopDetails />} />
//         <Route path="/Payments" element={<ManagerPayments />} />
//       </Routes>
//     </div>
//     // </Router>
//   );
// }

// export default App;


import React from 'react';
import { useSelector } from 'react-redux';
import { Routes, Route, Link } from "react-router-dom";
import DiagnoserList from './features/Diagnosers/DiagnoserList';
import CustomersList from './features/Customers/CustomersList';
import Home from "./features/Home/Home";
import Workshop from "./features/WorkShop/WorkShop";
import DiagnoserDetails from './features/Diagnosers/DiagnoserDetails';
import SignIn from './features/SignIn/SignIn';
import LoginPage from './features/Home/LoginPage';
import LogIn from './features/SignIn/LogIn';
import WorkshopDetails from './features/WorkShop/WorkshopDetails';
import ProfileWrapper from './features/Profile/ProfileWrapper';
import OdersAndReferences from './features/References/OdersAndReferences';
import ManagerPayments from './features/Profile/ManagerPayments';

// יבוא של קובץ ה-CSS מודול
import styles from './App.module.css';

function App() {
  const statusUser = useSelector(state => state.LogIn.statusUser);
  const user = useSelector(state => state.LogIn.thisUser);

  return (
    <div className="diagnosticians-page">
      <nav className={styles.mainNav}>
        {user && <Link to="/Orders" className={styles.link}>הזמנות</Link>}
        {user && <Link to="/Profile" className={styles.link}>פרופיל</Link>}
        <Link to="/enter" className={styles.link}>דף הבית</Link>
        <Link to="/Workshop" className={styles.link}>סדנאות</Link>
        {(statusUser === "diagnoser" || statusUser === "Esty") && <Link to="/Customers" className={styles.link}>לקוחות</Link>}
        {(statusUser === "Esty") && <Link to="/Payments" className={styles.link}>תשלומים</Link>}
        <Link to="/Diagnosers" className={styles.link}>מאבחנות</Link>
      </nav>

      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/Workshop" element={<Workshop />} />
        <Route path="/Customers" element={<CustomersList />} />
        <Route path="/Diagnosers" element={<DiagnoserList />} />
        <Route path="/DiagnoserDetails/:code" element={<DiagnoserDetails />} />
        <Route path="/SignIn" element={<SignIn />} />
        <Route path="/LogIn" element={<LogIn />} />
        <Route path="/enter" element={<Home />} />
        <Route path="/Orders" element={<OdersAndReferences />} />
        <Route path="/Orders/:code" element={<OdersAndReferences />} />
        <Route path="/Profile" element={<ProfileWrapper />} />
        <Route path="/WorkshopDetails/:code" element={<WorkshopDetails />} />
        <Route path="/Payments" element={<ManagerPayments />} />
      </Routes>
    </div>
  );
}

export default App;