import { useEffect, useState } from "react";
import styles from "./LoginPage.module.css";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function LoginPage({ setHasAccess }) {
  const [logoLoaded, setLogoLoaded] = useState(false);
  const [showContent, setShowContent] = useState(false);
      const thisuser = useSelector(state => state.LogIn.thisUser);
    const statusUser = useSelector(state => state.LogIn.statusUser);

  const navigate = useNavigate()

  const cards = [
    { emoji: "🧠", title: "מורפולוגיה", text: "ניתוח תווי פנים ותנועות גוף", info: "כאן תקבלי את האבחון הנכון והמדויק ביותר על פי תווי הפנים שלך!" },
    { emoji: "✋", title: "כירולוגיה", text: "קריאת כפות ידיים ופרטים מוטוריים", info: "קריאת כפות ידיים ופרטים מוטוריים" },
    { emoji: "✍️", title: "גרפולוגיה", text: "ניתוח כתב יד ואישיות", info: "ניתוח כתב יד ואישיות" },
  ];

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), cards.length * 400 + 600);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setLogoLoaded(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleEnter = () => {
    // if (onEnter) onEnter();
        // ניווט ל-Home
        setHasAccess(true)
    navigate("/enter");
  };

   

  return (
    <div className={styles["landing-page"]}>
      <div className={styles["bg-animated"]} />
      <div className={styles["landing-shell"]}>
        <header className={`${styles["landing-header"]} ${logoLoaded ? styles["logo-small"] : styles["logo-big"]}`}>
          <div className={`${styles.logo} ${styles["logo-badge-animate"]}`}>⚕️ AI Diagnose ⚕️</div>
          {logoLoaded && (
            <div className={`${styles["landing-badge"]} ${styles["slide-up"]}`}>
              <div className={styles["logo-types"]}>🧠 מורפולוגיה | ✋ כירולוגיה | ✍️ גרפולוגיה</div>
              מערכת חכמה לניהול אבחוני מורפולוגיה וגרפולוגיה – במקום אחד מסודר
            </div>
          )}
        </header>

        {logoLoaded && (
          <main className={`${styles["landing-content"]} ${styles["main-content-animate"]}`}>
            <div className={styles.cards}>
              {cards.map((card, idx) => (
                <div key={idx} className={`${styles.card} ${styles["card-animate"]}`} style={{ animationDelay: `${idx * 0.4}s` }}>
                  <div className={styles.emoji}>{card.emoji}</div>
                  <span>{card.title}</span>
                  <span>{card.text}</span>
                  <div className={styles["card-info"]}>{card.info}</div>
                </div>
              ))}
            </div>

            {showContent && (
              <section className={styles.left}>
                <h1 className={styles["slide-up-delayed"]} style={{ animationDelay: `${cards.length * 0.4 + 0.2}s` }}>
                  ברוך הבא לעולם האבחונים החכם
                </h1>
                <p className={styles["slide-up-delayed"]} style={{ animationDelay: `${cards.length * 0.4 + 0.4}s` }}>
                  במקום לרדוף אחרי תורים – אתה בוחר אבחון, שעה וסוג – והכול נסגר בשתי דקות.
                </p>
                <div className={styles["landing-bullets"]}>
                  <p className={styles["slide-up-delayed"]} style={{ animationDelay: `${cards.length * 0.4 + 0.6}s` }}>• מאבחנות מקצועיות – שנבחרו בקפידה.</p>
                  <p className={styles["slide-up-delayed"]} style={{ animationDelay: `${cards.length * 0.4 + 0.8}s` }}>• תורים פנויים בזמן אמת – בלי טלפונים.</p>
                  <p className={styles["slide-up-delayed"]} style={{ animationDelay: `${cards.length * 0.4 + 1.0}s` }}>• כל האבחונים שלך במקום אחד.</p>
                </div>
                <div className={styles["landing-steps"]}>
                  <div className={`${styles["step-pill"]} ${styles["slide-up-delayed"]}`} style={{ animationDelay: `${cards.length * 0.4 + 1.2}s` }}>1. בוחר אבחון</div>
                  <div className={`${styles["step-pill"]} ${styles["slide-up-delayed"]}`} style={{ animationDelay: `${cards.length * 0.4 + 1.4}s` }}>2. מאשר – מקבל תזכורת</div>
                </div>
                <div>
                  {!thisuser && <button className={styles["primary-btn"]} onClick={handleEnter}>להיכנס למערכת</button>}
                </div>
              </section>
            )}
          </main>
        )}

        {logoLoaded && (
          <footer className={styles["landing-footer"]}>
            <span>✔ שמירה על הפרטיות שלך</span>
            <span>✔ גישה מכל מכשיר</span>
            <span>✔ חוויית שימוש פשוטה וברורה</span>
          </footer>
        )}
      </div>
    </div>
  );
}