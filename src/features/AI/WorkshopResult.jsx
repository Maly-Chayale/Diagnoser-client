import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import OrderWorkshop from "../WorkShop/OrderWorkshop";
import LoginRequiredModal from "./LoginRequiredModal";
import styles from "./WorkshopResult.module.css";
import remarkGfm from "remark-gfm";
import ReactMarkdown from "react-markdown";

const WorkshopResult = ({
    workshop,
    diagnoser,
    typeGroup,
    thisuser,
    cleanResult
}) => {
    const navigate = useNavigate();

    const [isOrderOpen, setIsOrderOpen] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);

    if (!workshop) return null;

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
                            ✨ זו הסדנה שלך
                        </div>
                    </div>
                )}

                {/* WORKSHOP CARD */}
                <div className={styles.card}>

                    <div className={styles.header}>
                        <div className={styles.badge}>
                            קוד סדנה: {workshop.code}
                        </div>

                        <h2 className={styles.title}>
                            📘 {workshop.description}
                        </h2>

                        <div className={styles.meta}>
                            <span> ₪{workshop.price}  :מחיר💰</span>
                            <span> משתתפים:   {workshop.accontOfPeople} איש 👥 </span>
                            {typeGroup && <span> {typeGroup.description} 📌</span>}
                        </div>
                    </div>

                    {diagnoser && (
                        <div className={styles.infoCard}>
                            <h3 className={styles.sectionTitle}> המאבחנת</h3>
                            <p> {diagnoser.name}👤</p>
                            <p> {diagnoser.mail}📧</p>
                        </div>
                    )}

                    <div className={styles.buttonsRow}>
                        <button onClick={() =>
                            navigate(`/WorkshopDetails/${workshop.code}`)
                        }>
                            🔍 מעבר לפרטי הסדנה
                        </button>

                        <button
                            onClick={() => {
                                if (!thisuser) setShowLoginModal(true);
                                else setIsOrderOpen(true);
                            }}
                        >
                            📅 הזמנת סדנה
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

export default WorkshopResult;