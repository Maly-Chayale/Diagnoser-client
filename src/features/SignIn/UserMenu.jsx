// import { useDispatch, useSelector } from "react-redux";
// import { NavLink, useNavigate } from "react-router-dom";
// import { signOut } from "../../features/SignIn/LogInSlice";
// import { UserCircle, LogOut } from "lucide-react";
// import { useEffect, useRef, useState } from "react";

// import styles from "./UserMenu.module.css";

// export default function UserMenu() {

//     const user = useSelector(state => state.LogIn.thisUser);

//     const dispatch = useDispatch();
//     const navigate = useNavigate();

//     const [open, setOpen] = useState(false);
//     const menuRef = useRef();

//     const initials = user.name
//         ?.split(" ")
//         .map(w => w[0])
//         .join("")
//         .slice(0, 2)
//         .toUpperCase();

//     const handleLogout = () => {
//         dispatch(signOut());
//         navigate("/");
//     };

//     useEffect(() => {
//         const handleClickOutside = (e) => {
//             if (menuRef.current && !menuRef.current.contains(e.target)) {
//                 setOpen(false);
//             }
//         };

//         document.addEventListener("mousedown", handleClickOutside);
//         return () => document.removeEventListener("mousedown", handleClickOutside);
//     }, []);

//     if (!user) return null;

//     return (
//         <div className={styles.wrapper} ref={menuRef}>
//             {/* כפתור עיגול */}
//             <button
//                 className={styles.avatar}
//                 onClick={() => setOpen(!open)}
//             >
//                 <UserCircle size={18} />
//                 <span>{initials}</span>
//             </button>
//             {/* dropdown */}
//             {open && (
//                 <div className={styles.dropdown}>
//                     <div className={styles.userInfo}>
//                         <div className={styles.name}>{user.name}</div>
//                         <div className={styles.mail}>{user.mail}</div>
//                     </div>
//                     <NavLink
//                         to="/Profile"
//                         className={styles.item}
//                         onClick={() => setOpen(false)}
//                     >
//                         איזור אישי
//                     </NavLink>
//                     <button
//                         onClick={handleLogout}
//                         className={styles.logout}
//                     >
//                         <LogOut size={18} />
//                         <span>יציאה</span>
//                     </button>
//                 </div>
//             )}
//         </div>
//     );
// }




import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { signOut } from "../../features/SignIn/LogInSlice";
import { UserCircle, LogOut, Settings } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import styles from "./UserMenu.module.css";

export default function UserMenu() {

    const user = useSelector(state => state.LogIn.thisUser);
    const statusUser = useSelector(state => state.LogIn.statusUser);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [open, setOpen] = useState(false);
    const ref = useRef();

    const initials = user.name
        ?.split(" ")
        .map(w => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

    const statusClass =
        statusUser === "Esty"
            ? styles.manager
            : statusUser === "diagnoser"
                ? styles.diagnoser
                : styles.customer;
    const statusText =
        statusUser === "Esty"
            ? "מנהלת"
            : statusUser === "diagnoser"
                ? "מאבחנת"
                : "לקוח";


    const handleLogout = () => {
        dispatch(signOut());
        navigate("/");
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (ref.current && !ref.current.contains(e.target)) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    if (!user) {
        return (
            <div className={styles.skeleton}></div>
        );
    }

    return (
        <div className={styles.wrapper} ref={ref}>

            <button className={styles.avatar} onClick={() => setOpen(!open)}>
                <UserCircle size={18} />
                <span>{initials}</span>
            </button>

            <div className={`${styles.dropdown} ${open ? styles.show : ""}`}>

                {/* USER INFO */}
                <div className={styles.userInfo}>
                    <div className={styles.name}>
                        {user.name}
                    </div>
                    <div className={styles.detailsRow}>

                        <div className={`${styles.status} ${statusClass}`}>
                            {statusText}
                        </div>

                        <div className={styles.mail}>
                            {user.mail}
                        </div>

                    </div>
                </div>

                {/* איזור אישי - באמצע */}
                <NavLink
                    to="/Profile"
                    className={styles.middleItem}
                    onClick={() => setOpen(false)}
                >
                    <>
                        <Settings size={17} />
                        <span>איזור אישי</span>
                    </>
                </NavLink>

                {/* יציאה - ימין */}
                <button
                    onClick={handleLogout}
                    className={styles.logout}
                >
                    <span>יציאה</span>
                    <LogOut size={18} />
                </button>

            </div>
        </div>
    );
}