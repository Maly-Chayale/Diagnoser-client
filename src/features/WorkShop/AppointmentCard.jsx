// import React, { useEffect, useState } from 'react';
// import './AppointmentCard.css'; // ייבוא קובץ העיצוב
// import { useDispatch, useSelector } from 'react-redux';
// import { deleteWorkShop, getType, GetWorkShop, InitWorkShops } from './WorkShopSlice';
// import { useParams } from 'react-router-dom';
// import { GiButterfly } from 'react-icons/gi';
// import { logDOM } from '@testing-library/react';

// function WorkshopCard({ WorkShop }) {
//     const dispatch = useDispatch();
//     const [type, setType] = useState("");

//     const groups = useSelector(state => state.TypeGroup.groups)
//     const diagnosers = useSelector(state => state.WorkShop.Diagnosers);
//     const statusUser = useSelector(state => state.LogIn.statusUser);


//     // useEffect(() => {
//     //     const fetchType = async () => {
//     //         try {
//     //             const res = await dispatch(getType(WorkShop));
//     //             // console.log(res);
//     //             const description = res.payload?.description;
//     //             // console.log(description);
//     //             setType(dispatch(getType(WorkShop)).arg.description);
//     //         }
//     //         catch (err) {
//     //             console.error("Error fetching type:", err);
//     //         }
//     //     };
//     //     fetchType();
//     // }, [dispatch, WorkShop]);

//     //     useEffect(() => {
//     //     const fetchType = async () => {
//     //         try {
//     //             const res = await dispatch(getType(WorkShop)).unwrap();
//     //             setType(res);
//     //         } catch (err) {
//     //             console.error(err);
//     //         }
//     //     };

//     //     fetchType();
//     // }, [dispatch, WorkShop]);

//     // useEffect(() => {
//     //     const fetchType = async () => {
//     //         try {
//     //             const res = await dispatch(getType(WorkShop)).unwrap();
//     //             console.log("TYPE RESPONSE:", res);
//     //             if (res.description)
//     //                 setType(res.description);
//     //             else
//     //                 setType(res)
//     //         } catch (err) {
//     //             console.error(err);
//     //         }
//     //     };

//     //     if (WorkShop?.typeGroup) {
//     //         fetchType();
//     //     }
//     // }, [WorkShop.typeGroup]);



//     // useEffect(() => {
//     //     let isMounted = true;

//     //     const fetchType = async () => {
//     //         try {
//     //             const res = await dispatch(getType(WorkShop)).unwrap();
//     //             console.log(`Workshop code: ${WorkShop.code}`, res); // בדיקה מה הגיע

//     //             if (isMounted) {
//     //                 // אם res הוא אובייקט עם תיאור
//     //                 if (res && res.description) {
//     //                     setType(res.description);
//     //                 } else if (typeof res === "string") {
//     //                     setType(res);
//     //                 } else {
//     //                     setType("לא זמין"); // fallback במקרה של ערך ריק
//     //                 }
//     //             }
//     //         } catch (err) {
//     //             console.error(`Error fetching type for workshop ${WorkShop.code}:`, err);
//     //             if (isMounted) setType("שגיאה");
//     //         }
//     //     };

//     //     if (WorkShop?.typeGroup) {
//     //         fetchType();
//     //     }

//     //     return () => {
//     //         isMounted = false;
//     //     };
//     // }, [WorkShop.typeGroup]);

//     // useEffect(() => {
//     //     let isMounted = true;

//     //     const fetchType = async () => {
//     //         try {
//     //             const res = await dispatch(getType(WorkShop)).unwrap();

//     //             if (isMounted) {
//     //                 setType(res);
//     //             }
//     //         } catch (err) {
//     //             console.error(err);
//     //         }
//     //     };

//     //     if (WorkShop?.typeGroup) {
//     //         fetchType();
//     //     }

//     //     return () => {
//     //         isMounted = false;
//     //     };
//     // }, [WorkShop]);

//     // useEffect(() => {
//     //     let isMounted = true;

//     //     const fetchType = async () => {
//     //         try {
//     //             const res = await dispatch(getType(WorkShop)).unwrap();

//     //             if (isMounted) {
//     //                 setType(res);
//     //             }
//     //         } catch (err) {
//     //             console.error(err);
//     //         }
//     //     };

//     //     if (WorkShop?.typeGroup) {
//     //         fetchType();
//     //     }

//     //     return () => {
//     //         isMounted = false;
//     //     };
//     // }, [WorkShop.typeGroup]);


//     const but = async () => {
//         try {
//             const res = await dispatch(getType(WorkShop));
//             // console.log(res);
//             const description = res.payload?.description;
//             // console.log(description);

//             setType(dispatch(getType(WorkShop)).arg.description);

//         }
//         catch (err) {
//             console.error("Error fetching type:", err);
//         }
//     };



//     const getType = (code) => {
//         return groups.find(g => g.code == code)?.description
//     }

//     const deleteW = async () => {
//         await dispatch(deleteWorkShop(WorkShop))
//         dispatch(InitWorkShops())
//     }

//     return (
//         <>
//             <div className="glow">
//                 <div className="AllCard">
//                     <div className="appointment-card">
//                         {/* <h2 className="card-title" > {WorkShop.code} _ {type} </h2> */}
//                         <h2 className="card-title">{WorkShop.code} _ {getType(WorkShop.typeGroup)}</h2>
//                         <div className="diagnosticians-list">
//                             {WorkShop?.morfology && <span>מורפולוגיה</span>}
//                             <span> | </span>
//                             {WorkShop?.grafology && <span>גרפולוגיה</span>}
//                             <span> | </span>
//                             {WorkShop?.chirology && <span>כירולוגיה</span>}
//                         </div>
//                         <p className="diagnosticians-list">{WorkShop?.description}</p>
//                         <button className="primary"> לצפייה בפרופיל ותורים </button>
//                         {statusUser == "Esty" && <button onClick={deleteW}>למחיקה</button>}
//                     </div>
//                 </div>
//             </div>
//         </>
//     );
// }

// export default WorkshopCard;




























// // import React from 'react';
// // import './AppointmentCard.css'; // ייבוא קובץ העיצוב

// // function WorkshopCard({ WorkShop }) {
// //     return (
// //         <div className="glow">
// //             <div className="AllCard">
// //                 <div className="appointment-card">
// //                     {/* מציג קוד הסדנא + תיאור typeGroup */}
// //                     <h2 className="card-title">
// //                         {WorkShop.code} _ {WorkShop.typeDescription || "לא זמין"}
// //                     </h2>

// //                     <div className="diagnosticians-list">
// //                         {WorkShop?.morfology && <span>מורפולוגיה</span>}
// //                         <span> | </span>
// //                         {WorkShop?.grafology && <span>גרפולוגיה</span>}
// //                     </div>

// //                     <button className="primary">
// //                         לצפייה בפרופיל ותורים
// //                     </button>
// //                 </div>
// //             </div>
// //         </div>
// //     );
// // }

// // export default WorkshopCard;

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteWorkShop, GetDiagnosersOfThisWorkshop, InitWorkShops } from './WorkShopSlice';
import './AppointmentCard.css'; // ייבוא קובץ עיצוב
import { GiButterfly } from 'react-icons/gi';

function WorkshopCard({ WorkShop }) {
    const dispatch = useDispatch();
    const [isModalOpen, setIsModalOpen] = useState(false); // מצב לפתיחת הפופ-אפ של המאבחנות
    const [selectedDiagnoser, setSelectedDiagnoser] = useState(null); // המאבחנת הנבחרת
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // מצב לפתיחת הפופ-אפ של מחיקת הסדנא
    const groups = useSelector(state => state.TypeGroup.groups);
    const diagnosers = useSelector(state => state.WorkShop.Diagnosers);
    const statusUser = useSelector(state => state.LogIn.statusUser);

    const openModal = () => {
        setIsModalOpen(true); // פותח את הפופ-אפ של המאבחנות
        dispatch(GetDiagnosersOfThisWorkshop(WorkShop));
    }

    const closeModal = () => {
        setIsModalOpen(false); // סוגר את הפופ-אפ של המאבחנות
        setSelectedDiagnoser(null); // מאפס את המאבחנת שנבחרה
    }

    const openDeleteModal = () => {
        setIsDeleteModalOpen(true); // פותח את הפופ-אפ לאישור מחיקה
    }

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false); // סוגר את הפופ-אפ לאישור מחיקה
    }

    const handleDelete = async () => {
        await dispatch(deleteWorkShop(WorkShop));
        await dispatch(InitWorkShops());
        closeDeleteModal(); // סוגר את הפופ-אפ אחרי מחיקה
    }

    const getType = (code) => {
        return groups.find(g => g.code === code)?.description;
        // let data = ( dispatch(getType(code)))
        // console.log(data);
        
        // return "name"
    }

    const handleBooking = (diagnoser) => {
        // שליחה למייל של המאבחנת
        const mailBody = `שלום ${diagnoser.name}, \n\n יש הזמנה חדשה לסדנא.`;
        const mailSubject = `הזמנה לסדנא ${WorkShop.code}`;
        
        window.location.href = `mailto:${diagnoser.mail}?subject=${mailSubject}&body=${mailBody}`;

        // הודעה ללקוחה (הצגת פופ-אפ או התראה)
        alert(`ההזמנה למאבחנת ${diagnoser.name} נשלחה בהצלחה!`);
    }

    const openDetails = (diagnoser) => {
        setSelectedDiagnoser(diagnoser); // מעדכן את המאבחנת שנבחרה להציג את פרטיה
    }

    return (
        <>
            <div className="glow">
                <div className="AllCard">
                    <div className="appointment-card">
                        <h2 className="card-title">{getType(WorkShop.typeGroup)}</h2>
                        <div className="diagnosticians-list">
                            {WorkShop?.morfology && <span>מורפולוגיה</span>}
                            <span> | </span>
                            {WorkShop?.grafology && <span>גרפולוגיה</span>}
                            <span> | </span>
                            {WorkShop?.chirology && <span>כירולוגיה</span>}
                        </div>
                        <p className="diagnosticians-list">{WorkShop?.description}</p>
                        <button className="primary" onClick={openModal}>לצפייה בפרופיל ותורים</button>
                        {statusUser === "Esty" && <button onClick={openDeleteModal}>למחיקה</button>}
                    </div>
                </div>
            </div>

            {/* פופ-אפ למאבחנות */}
            {isModalOpen && (
                <div className="popup-overlay">
                    <div className="popup-content">
                        <h3>מאבחנות</h3>
                        <button className="close-btn" onClick={closeModal}>X</button>
                        {diagnosers && diagnosers.map((diagnoser, index) => (
                            <div key={index} className="diagnoser-card">
                                <h4>{diagnoser.name}</h4>
                                <p>מייל: {diagnoser.mail}</p>
                                <button className="profile-button" onClick={() => handleBooking(diagnoser)}>הזמנה</button>
                                <button className="profile-button" onClick={() => openDetails(diagnoser)}>פרטים</button>
                            </div>
                        ))}

                        {/* תיבת טקסט נגללת שמציגה את פרטי המאבחנת */}
                        {selectedDiagnoser && (
                            <div className="details-modal">
                                <div className="details-content">
                                    <h3>פרטי המאבחנת</h3>
                                    <button className="close-btn" onClick={() => setSelectedDiagnoser(null)}>סגור</button>
                                    <div className="scrollable-text">
                                        <p><strong>שם:</strong> {selectedDiagnoser.name}</p>
                                        <p><strong>מייל:</strong> {selectedDiagnoser.mail}</p>
                                        <p><strong>טלפון:</strong> {selectedDiagnoser.phone}</p>
                                        <p><strong>תיאור:</strong> {selectedDiagnoser.description}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* פופ-אפ לאישור מחיקה */}
            {isDeleteModalOpen && (
                <div className="popup-overlay">
                    <div className="popup-content">
                        <h3>האם אתה בטוח שברצונך למחוק את הסדנא?</h3>
                        <button className="confirm-btn" onClick={handleDelete}>אישור</button>
                        <button className="cancel-btn" onClick={closeDeleteModal}>ביטול</button>
                    </div>
                </div>
            )}
        </>
    );
}

export default WorkshopCard;