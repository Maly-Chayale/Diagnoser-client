// import React, { useEffect, useState } from 'react';
// import style from './safeAI.module.css';
// import { useDispatch, useSelector } from 'react-redux';
// import { TypeGroups } from '../TypeGroup/TypeGroupSlice';
// import httpx
// import OpenAI from "openai";

// const WorkshopAI = ({ sendToAI }) => {

//   const dispatch = useDispatch()

//   const workshops = useSelector(state => state.WorkShop.WorkShops);
//   const groups = useSelector(state => state.TypeGroup.groups);

//   const client = new OpenAI({
//     apiKey: "sk-safeai-faab3999e60d8997389cafee6b70c2d971379f5f0330b326",
//   });

//   const [showQuestions, setShowQuestions] = useState(false);
//   const [questions, setQuestions] = useState([]);
//   const [answers, setAnswers] = useState({});
//   const [selectedWorkshop, setSelectedWorkshop] = useState(null);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     dispatch(TypeGroups())
//   }, [])

//   const getType = (code) => {
//     return groups.find(g => g.code === code)?.description;
//   };

//   const string = () => {
//     let str = ""
//     workshops.forEach(w => {
//       let s = "code: " + w.code + " codeDiagnoser: " + w.codeDiagnoser;
//       s += " typeGroup: " + getType(w.typeGroup) + " description: " + w.description
//       if (w.graphology) s += " גרפולוגיה";
//       if (w.morphology) s += " מורפולוגיה";
//       if (w.chirology) s += " כירולוגיה";
//       s += "price: " + w.price + " accontOfPeople: " + w.accountOfPeople
//       str += "{" + s + "}";
//     })
//     return str;
//   }

//   const startAIQuestions = async () => {
//     setLoading(true);
//     setSelectedWorkshop(null);
//     setAnswers({});

//     const SYSTEM_PROMPT = 'אתה מתפקד כיועץ אישי לסדנאות. יש לך רשימת סדנאות שכל אחת מהן כוללת תכונות: "description", "morfology", "grafology", "chirology", "price", "accontOfPeople". המטרה שלך היא: 1. ליצור 5 שאלות שונות למשתמש כדי להבין מה הכי מתאים לו. 2. השאלות צריכות להתמקד בתחומי עניין, סגנון עבודה, תחביבים, תקציב או העדפות אישיות. 3. אחרי שהמשתמש עונה, תנתח את התשובות ותבחר את הסדנה המתאימה ביותר עבורו. 4. תספק את הסדנה הנבחרת עם כל הפרטים שלה: description, typeGroup, morfology, grafology, chirology, price, accontOfPeople. תן את הפלט בצורה ברורה: - מערך השאלות: ["שאלה1", "שאלה2", ..., "שאלה5"] - אובייקט הסדנה המתאימה:{  "description": "...",  "typeGroup": ...,  "morfology": ...,  "grafology": ...,  "chirology": ...,  "price": ...,  "accontOfPeople": ...}'

//     const response = await client.chat.completions.create({
//       model: "gpt-4o-mini",
//       messages =[
//         { "role": "system", "content": SYSTEM_PROMPT },
//         { "role": "user", "content": "הסדנאות שיש לנו: " + string() }
//       ]
//     });

//     console.log(response);
    


//     // קריאה ל-AI שיחזיר מערך של 5 שאלות
//     const aiQuestions = await sendToAI({
//       type: 'generateQuestions',
//       count: 5
//     });

//     setQuestions(aiQuestions); // מציבים את השאלות שה-AI ייצר
//     setShowQuestions(true);
//     setLoading(false);
//   };

//   const handleInputChange = (e, index) => {
//     setAnswers({ ...answers, [index]: e.target.value });
//   };

//   const submitAnswers = async () => {
//     setLoading(true);

//     // שולחים את התשובות ל-AI שיחזיר סדנה מתאימה
//     const workshop = await sendToAI({
//       type: 'matchWorkshop',
//       answers
//     });

//     setSelectedWorkshop(workshop);
//     setShowQuestions(false);
//     setLoading(false);
//   };

//   return (
//     <div className={style.workshopContainer}>
//       <button className={style.workshopButton} onClick={startAIQuestions}>
//         איזו סדנה הכי מתאימה לי
//       </button>

//       {loading && <p>טוען...</p>}

//       {showQuestions && (
//         <div className={style.questionBox}>
//           {questions.map((q, index) => (
//             <div key={index} className={style.questionItem}>
//               <label>{q}</label>
//               <input
//                 type="text"
//                 className={style.workshopInput}
//                 value={answers[index] || ''}
//                 onChange={(e) => handleInputChange(e, index)}
//               />
//             </div>
//           ))}

//           <button className={style.workshopButton} onClick={submitAnswers}>
//             אישור
//           </button>
//         </div>
//       )}

//       {selectedWorkshop && (
//         <div className={style.resultBox}>
//           <h3>הסדנה שהכי מתאימה לך:</h3>
//           {Object.entries(selectedWorkshop).map(([key, value]) => (
//             <p key={key}><strong>{key}:</strong> {value.toString()}</p>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default WorkshopAI;