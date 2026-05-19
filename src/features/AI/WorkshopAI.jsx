// import React, { useState } from "react";
// import styles from './safeAI.module.css'

// const TextInputComponent = () => {
//   const [inputText, setInputText] = useState(""); // שדה קלט
//   const [response, setResponse] = useState("");   // הדיב שמציג תגובה

//   const handleInputChange = (e) => {
//     setInputText(e.target.value);
//   };

//   const handleSend = () => {
//     if (!inputText.trim()) {
//       setResponse("אנא הכנס טקסט לפני שליחה.");
//       return;
//     }

//     // כאן אפשר לשים את הקריאה ל-API או כל לוגיקה אחרת
//     setResponse(`הטקסט נשלח: "${inputText}"`);

//     // איפוס שדה הקלט
//     setInputText("");
//   };

//   return (
//     <div style={styles.container}>
//       <input
//         type="text"
//         value={inputText}
//         onChange={handleInputChange}
//         placeholder="הכנס טקסט כאן..."
//         style={styles.input}
//       />
//       <button onClick={handleSend} style={styles.button}>
//         שלח
//       </button>

//       <div style={styles.responseDiv}>
//         {response}
//       </div>
//     </div>
//   );
// };

// export default TextInputComponent;



// WorkshopAI.jsx
import React, { useState } from 'react';
import style from './safeAI.module.css';
import { useSelector } from 'react-redux';

const WorkshopAI = () => {

  const workshopsList = useSelector(state => state.WorkShop.WorkShops);

  const [showQuestions, setShowQuestions] = useState(false);
  const [answers, setAnswers] = useState({ q1: '', q2: '', q3: '' });
  const [selectedWorkshop, setSelectedWorkshop] = useState(null);

  const handleInputChange = (e) => {
    setAnswers({ ...answers, [e.target.name]: e.target.value });
  };

  const startAIQuestions = () => {
    setShowQuestions(true);
    setSelectedWorkshop(null);
  };

  const submitAnswers = () => {
    // כאן נוכל להכניס לוגיקה של AI, לדוגמה לפי מילות מפתח
    let match = workshopsList[0];

    if (answers.q1.includes('גרפולוגיה') || answers.q2.includes('גרפולוגיה')) {
      match = workshopsList.find(w => w.grafology);
    } else if (answers.q1.includes('כירולוגיה') || answers.q2.includes('כירולוגיה')) {
      match = workshopsList.find(w => w.chirology);
    } else if (answers.q1.includes('מורפולוגיה') || answers.q2.includes('מורפולוגיה')) {
      match = workshopsList.find(w => w.morfology);
    }

    setSelectedWorkshop(match);
    setShowQuestions(false);
  };

  return (
    <div className={style.workshop-container}>
      <button className={`${style.workshop-button} ${style.start-button}`} onClick={startAIQuestions}>
        איזו סדנה הכי מתאימה לי
      </button>

      {showQuestions && (
        <div className={style.question-box}>
          <label>שאלה 1: איזה תחום מעניין אותך?</label>
          <input
            type="text"
            className={style.workshop-input}
            name="q1"
            value={answers.q1}
            onChange={handleInputChange}
          />

          <label>שאלה 2: באיזה סגנון עבודה אתה מעדיף?</label>
          <input
            type="text"
            className={style.workshop-input}
            name="q2"
            value={answers.q2}
            onChange={handleInputChange}
          />

          <label>שאלה 3: מה התקציב שלך?</label>
          <input
            type="text"
            className={style.workshop-input}
            name="q3"
            value={answers.q3}
            onChange={handleInputChange}
          />

          <button className={`${style.workshop-button} ${style.submit-button}`} onClick={submitAnswers}>
            אישור
          </button>
        </div>
      )}

      {selectedWorkshop && (
        <div className={style.result-box}>
          <h3>הסדנה שהכי מתאימה לך:</h3>
          <p>{selectedWorkshop.description}</p>
          <p>מחיר: {selectedWorkshop.price} ₪</p>
          <p>מספר משתתפים: {selectedWorkshop.accontOfPeople}</p>
        </div>
      )}
    </div>
  );
};

export default WorkshopAI;