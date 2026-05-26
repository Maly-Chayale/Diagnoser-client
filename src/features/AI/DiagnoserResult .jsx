import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginRequiredModal from "./LoginRequiredModal";
import styles from "./WorkshopResult.module.css";
import remarkGfm from "remark-gfm";
import ReactMarkdown from "react-markdown";
import { useSelector } from "react-redux";

const DiagnoserResult = ({
    thisuser,
    answer
}) => {
    const navigate = useNavigate();

    const [showLoginModal, setShowLoginModal] = useState(false);


    const diagnosers = useSelector((state) => state.Diagnoser.Diagnosers);

    

let cleanResult = answer;

  if (typeof cleanResult === "string") {
    cleanResult = cleanResult
      .replace(/```markdown/g, "")
      .replace(/```/g, "")
      .trim();

    cleanResult =
    answer.split("סיבה לבחירה:")[1]?
      "**מצאתי לך את ההתאמה המדויקת ביותר בשבילך על פי מה שביקשת:" +
      answer.split("סיבה לבחירה:")[1]:answer;
  }

  const code = Number(answer?.match?.(/\d+/)?.[0]);

  let diagnoser

    if (!isNaN(code)) {
        diagnoser = diagnosers.find(
            (d) => d.code === code
        );
    }

    if (!diagnoser) return null;

    return (
        <>
            <div className={styles.resultBox}>

                {/* AI RESPONSE */}
                {cleanResult && (
                    <div className={styles.topSection}>
                        <div className={styles.aiMessage} dir="rtl">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {cleanResult}
                            </ReactMarkdown>
                        </div>

                        <div className={styles.suggestionTitle}>
                            ✨ זו המאבחנת שלך
                        </div>
                    </div>
                )}

                {/* DIAGNOSER CARD */}
                <div className={styles.card}>

                    <div className={styles.header}>
                        <div className={styles.badge}>
                            קוד מאבחנת: {diagnoser.code}
                        </div>

                        <h2 className={styles.title}>
                            👤 {diagnoser.name}
                        </h2>

                        <div className={styles.meta}>
                            <span> 📧 {diagnoser.mail}</span>
                            <span> 📞 {diagnoser.phone}</span>
                            {/* <span> 💰 {diagnoser.precentagePayment}% עמלה</span> */}
                        </div>
                    </div>

                    <div className={styles.infoCard}>
                        <h3 className={styles.sectionTitle}>תחומי התמחות</h3>

                        {diagnoser.morphology && <p>🔬 מורפולוגיה</p>}
                        {diagnoser.graphology && <p>✍️ גרפולוגיה</p>}
                        {diagnoser.chirology && <p>✋ כירולוגיה</p>}
                    </div>

                    <div className={styles.buttonsRow}>
                        <button
                            onClick={() =>
                                navigate(`/DiagnoserDetails/${diagnoser.code}`)
                            }
                        >
                            🔍 מעבר לפרטי מאבחנת
                        </button>

                        <button
                            onClick={() => {
                                if (!thisuser) setShowLoginModal(true);
                                else navigate(`/DiagnoserOrder/${diagnoser.code}`);
                            }}
                        >
                            📅 הזמנת אבחון
                        </button>
                    </div>

                </div>
            </div>

            {showLoginModal && (
                <LoginRequiredModal
                    onClose={() => setShowLoginModal(false)}
                    onLogin={() => {
                        setShowLoginModal(false);
                        navigate("/login");
                    }}
                />
            )}
        </>
    );
};

export default DiagnoserResult;