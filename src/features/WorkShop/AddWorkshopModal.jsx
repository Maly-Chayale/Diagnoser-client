// import React, { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { addWorkShop, GetDiagnosersOfConditions, InitWorkShops } from './WorkShopSlice';
// import style from './AddWorkshopModal.module.css';
// import { FaUser, FaDollarSign, FaTimes } from 'react-icons/fa';
// import { InitDiagnoser } from '../Diagnosers/DiagnoserSlice';

// function AddWorkshopModal({ open, onClose }) {
//     const dispatch = useDispatch();
//     const diagnosers = useSelector(s => s.Diagnoser.Diagnosers);
//     const status = useSelector(s => s.Diagnoser.status);
//     const [diagnosersCan, setDiagnosersCan] = useState([])
//     const typeGroups = useSelector(s => s.TypeGroup.groups);
//     const statusUser = useSelector(state => state.LogIn.statusUser);
//     const user = useSelector(state => state.LogIn.thisUser);

//     useEffect(() => {
//         if (status === "")
//             dispatch(InitDiagnoser())
//     }, [dispatch, status])

//     const [form, setForm] = useState({
//         code: 0,
//         codeDiagnoser: 0,
//         typeGroup: 0,
//         description: '',
//         morfology: false,
//         grafology: false,
//         chirology: false,
//         price: '',
//         accontOfPeople: ''
//     });

//     const [showPreview, setShowPreview] = useState(false);
//     const [showSuccess, setShowSuccess] = useState(false);

//     const isFormComplete = () => (
//         form.description.trim() &&
//         form.price &&
//         form.accontOfPeople &&
//         form.typeGroup &&
//         form.codeDiagnoser
//     );

//     const handleChange = (e) => {
//         const { name, value, type, checked } = e.target;
//         const updated = { ...form, [name]: type === "checkbox" ? checked : value };
//         setForm(updated);
//         setDiagnosersCan(diagnosers.filter(d => {
//             if ((updated.chirology == true) && (d.chirology == false)) return false;
//             if ((updated.morfology == true) && (d.morphology == false)) return false;
//             if ((updated.grafology == true) && (d.graphology == false)) return false;
//             return true;
//         }

//         ))
//         console.log(diagnosersCan);

//     };

//     const handleContinue = () => setShowPreview(true);
//     const handleBack = () => setShowPreview(false);

//     const handleAdd = () => {
//         setShowPreview(false);
//         setShowSuccess(true);
//         setTimeout(async () => {
//             setShowSuccess(false);
//             await dispatch(addWorkShop(form));
//             await dispatch(InitWorkShops());
//             onClose()
//         }, 2000);
//     };

//     if (!open && !showSuccess) return null;

//     const getInputClass = (fieldName) => `${style.input} ${form[fieldName] ? style.filled : ''}`;

//     return (
//         <div className={style.backdrop}>
//             <div className={style.modal}>
//                 <button className={style.closeBtn} onClick={onClose}><FaTimes /></button>
//                 <h2 className={style.modalTitle}>הוספת סדנא</h2>

//                 {showSuccess && (
//                     <div className={style.successMessage}>
//                         <div>
//                             <svg width="60" height="60" viewBox="0 0 24 24">
//                                 <path fill="none" stroke="#16a34a" strokeWidth="3" d="M20 6L9 17l-5-5" />
//                             </svg>
//                         </div>
//                         הסדנא נוספה בהצלחה !!!
//                     </div>
//                 )}

//                 {!showPreview && !showSuccess && (
//                     <>
//                         <div className={style.field}>
//                             <textarea
//                                 className={`${style.textarea} ${form.description ? style.filled : ''}`}
//                                 name="description"
//                                 value={form.description}
//                                 onChange={handleChange}
//                                 placeholder="תיאור הסדנא"
//                             />
//                         </div>

//                         <div className={style.field}>
//                             <div className={style.iconInputWrapper}>
//                                 <FaDollarSign className={style.icon} />
//                                 <input
//                                     className={getInputClass('price')}
//                                     type="number"
//                                     name="price"
//                                     value={form.price}
//                                     onChange={handleChange}
//                                     placeholder="הכנס מחיר"
//                                 />
//                             </div>
//                         </div>

//                         <div className={style.field}>
//                             <div className={style.iconInputWrapper}>
//                                 <FaUser className={style.icon} />
//                                 <input
//                                     className={getInputClass('accontOfPeople')}
//                                     type="number"
//                                     name="accontOfPeople"
//                                     value={form.accontOfPeople}
//                                     onChange={handleChange}
//                                     placeholder="הכנס מספר משתתפים"
//                                 />
//                             </div>
//                         </div>

//                         <div className={style.field}>
//                             <select className={`${style.select} ${form.typeGroup ? style.filled : ''}`} name="typeGroup" value={form.typeGroup} onChange={handleChange}>
//                                 <option value={0}>בחר קטגוריה</option>
//                                 {typeGroups.map(g => <option key={g.code} value={g.code}>{g.description}</option>)}
//                             </select>
//                         </div>

//                         <div className={style.checkboxRow}>
//                             <label><input type="checkbox" name="morfology" onChange={handleChange} /> מורפולוגיה</label>
//                             <label><input type="checkbox" name="grafology" onChange={handleChange} /> גרפולוגיה</label>
//                             <label><input type="checkbox" name="chirology" onChange={handleChange} /> כירולוגיה</label>
//                         </div>

//                         <div className={style.field}>
//                             {statusUser == "Esty" ?
//                                 <select className={`${style.select} ${form.codeDiagnoser ? style.filled : ''}`} name="codeDiagnoser"
//                                     value={form.codeDiagnoser} onChange={handleChange}>
//                                     <option value={0}>בחר מאבחנת</option>
//                                     {diagnosersCan?.map(d => <option key={d.code} value={d.code}>{d.name} - {d.mail}</option>)}
//                                 </select> :
//                                 <p>{user.name}</p>}
//                         </div>

//                         <button
//                             className={style.submitBtn}
//                             onClick={handleContinue}
//                             disabled={!isFormComplete()}
//                         >
//                             המשך
//                         </button>
//                     </>
//                 )}

//                 {showPreview && !showSuccess && (
//                     <div className={style.preview}>
//                         <p><strong>תיאור:</strong> {form.description}</p>
//                         <p><strong>מחיר:</strong> {form.price}</p>
//                         <p><strong>כמות משתתפים:</strong> {form.accontOfPeople}</p>
//                         <p><strong>קטגוריה:</strong> {typeGroups.find(g => g.code === Number(form.typeGroup))?.description}</p>
//                         <p><strong>מאבחנת:</strong> {diagnosers.find(d => d.code === Number(form.codeDiagnoser))?.name}</p>

//                         <div className={style.previewButtons}>
//                             <button className={style.backBtn} onClick={handleBack}>חזרה</button>
//                             <button className={style.submitBtn} onClick={handleAdd}>אישור</button>
//                         </div>
//                     </div>
//                 )}

//             </div>
//         </div>
//     );
// }

// export default AddWorkshopModal;














import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addWorkShop, InitWorkShops } from './WorkShopSlice';
import style from './AddWorkshopModal.module.css';
import { FaUser, FaDollarSign, FaTimes } from 'react-icons/fa';
import { InitDiagnoser } from '../Diagnosers/DiagnoserSlice';
import { useNavigate } from 'react-router-dom';

function AddWorkshopModal({ open, onClose }) {

    const dispatch = useDispatch();
    const navigate = useNavigate()

    const diagnosers = useSelector(s => s.Diagnoser.Diagnosers);
    const status = useSelector(s => s.Diagnoser.status);
    const [diagnosersCan, setDiagnosersCan] = useState([]);
    const typeGroups = useSelector(s => s.TypeGroup.groups);
    const statusUser = useSelector(state => state.LogIn.statusUser);
    const user = useSelector(state => state.LogIn.thisUser);

    useEffect(() => {
        if (status === "") dispatch(InitDiagnoser());
    }, [dispatch, status]);

    const [form, setForm] = useState({
        code: 0,
        codeDiagnoser: 0,
        typeGroup: 0,
        description: '',
        morfology: false,
        grafology: false,
        chirology: false,
        price: '',
        accontOfPeople: ''
    });

    const [showPreview, setShowPreview] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showDetails, setShowDetails] = useState(false);
    // const [confetti, setConfetti] = useState(false);

    const isFormComplete = () => (
        form.description.trim() &&
        form.price &&
        form.accontOfPeople &&
        form.typeGroup &&
        form.codeDiagnoser
    );

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const updated = { ...form, [name]: type === "checkbox" ? checked : value };
        setForm(updated);
        setDiagnosersCan(diagnosers.filter(d => {
            if ((updated.chirology === true) && (d.chirology === false)) return false;
            if ((updated.morfology === true) && (d.morphology === false)) return false;
            if ((updated.grafology === true) && (d.graphology === false)) return false;
            return true;
        }));
    };

    const handleContinue = () => setShowPreview(true);
    const handleBack = () => setShowPreview(false);


    const handleAdd = async () => {

        setShowPreview(false);
        setShowSuccess(true);

        setTimeout(async () => {

            // setShowSuccess(false);
            // setConfetti(true);
            // setShowDetails(true);

            // setTimeout(async () => {

            // setConfetti(false);
            // setShowPreview(false);

            await dispatch(addWorkShop(form));
            const w = await dispatch(InitWorkShops()).unwrap();
            navigate(`../WorkshopDetails/${w[w.length - 1].code}`)

            // form.code = w.code
            // onClose();
            // }, 10000);

        }, 2000);
    };

    if (!open && !showSuccess && !showDetails) return null;

    const getInputClass = (fieldName) => `${style.input} ${form[fieldName] ? style.filled : ''}`;

    return (
        <div className={style.backdrop}>
            <div className={style.modal}>
                <button className={style.closeBtn} onClick={onClose}><FaTimes /></button>
                <h2 className={style.modalTitle}>הוספת סדנא</h2>

                {showSuccess && (
                    <div className={style.successMessage}>
                        <div>
                            <svg width="60" height="60" viewBox="0 0 24 24">
                                <path fill="none" stroke="#16a34a" strokeWidth="3" d="M20 6L9 17l-5-5" />
                            </svg>
                        </div>
                        הסדנא נוספה בהצלחה !!!
                    </div>
                )}

                {/* {showDetails && (
                    <div className={style.preview}>
                        {confetti && <Confetti width={window.innerWidth} height={window.innerHeight} />}

                        <WorkshopDetails w={form} />
                    </div>
                )} */}

                {!showPreview && !showSuccess && !showDetails && (
                    <>
                        <div className={style.field}>
                            <textarea
                                className={`${style.textarea} ${form.description ? style.filled : ''}`}
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                placeholder="תיאור הסדנא"
                            />
                        </div>

                        <div className={style.field}>
                            <div className={style.iconInputWrapper}>
                                <FaDollarSign className={style.icon} />
                                <input
                                    className={getInputClass('price')}
                                    type="number"
                                    name="price"
                                    value={form.price}
                                    onChange={handleChange}
                                    placeholder="הכנס מחיר"
                                />
                            </div>
                        </div>

                        <div className={style.field}>
                            <div className={style.iconInputWrapper}>
                                <FaUser className={style.icon} />
                                <input
                                    className={getInputClass('accontOfPeople')}
                                    type="number"
                                    name="accontOfPeople"
                                    value={form.accontOfPeople}
                                    onChange={handleChange}
                                    placeholder="הכנס מספר משתתפים"
                                />
                            </div>
                        </div>

                        <div className={style.field}>
                            <select className={`${style.select} ${form.typeGroup ? style.filled : ''}`} name="typeGroup" value={form.typeGroup} onChange={handleChange}>
                                <option value={0}>בחר קטגוריה</option>
                                {typeGroups.map(g => <option key={g.code} value={g.code}>{g.description}</option>)}
                            </select>
                        </div>

                        <div className={style.checkboxRow}>
                            <label><input type="checkbox" name="morfology" onChange={handleChange} /> מורפולוגיה</label>
                            <label><input type="checkbox" name="grafology" onChange={handleChange} /> גרפולוגיה</label>
                            <label><input type="checkbox" name="chirology" onChange={handleChange} /> כירולוגיה</label>
                        </div>

                        <div className={style.field}>
                            {statusUser === "Esty" ?
                                <select className={`${style.select} ${form.codeDiagnoser ? style.filled : ''}`} name="codeDiagnoser"
                                    value={form.codeDiagnoser} onChange={handleChange}>
                                    <option value={0}>בחר מאבחנת</option>
                                    {diagnosersCan?.map(d => <option key={d.code} value={d.code}>{d.name} - {d.mail}</option>)}
                                </select> :
                                <p>{user.name}</p>}
                        </div>

                        <button
                            className={style.submitBtn}
                            onClick={handleContinue}
                            disabled={!isFormComplete()}
                        >
                            המשך
                        </button>
                    </>
                )}

                {showPreview && (
                    <div className={style.preview}>
                        <p><strong>תיאור:</strong> {form.description}</p>
                        <p><strong>מחיר:</strong> {form.price}</p>
                        <p><strong>כמות משתתפים:</strong> {form.accontOfPeople}</p>
                        <p><strong>קטגוריה:</strong> {typeGroups.find(g => g.code === Number(form.typeGroup))?.description}</p>
                        <p><strong>מאבחנת:</strong> {diagnosers.find(d => d.code === Number(form.codeDiagnoser))?.name}</p>

                        <div className={style.previewButtons}>
                            <button className={style.backBtn} onClick={handleBack}>חזרה</button>
                            <button className={style.submitBtn} onClick={handleAdd}>אישור</button>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}

export default AddWorkshopModal;