import { useDispatch, useSelector } from "react-redux";
import { GetAIQuestions, ResetAIState, SendAnswersToAI, SetAnswer } from "./WorkshopAISlice";
import { useEffect, useState, useRef } from "react";
import { InitWorkShops } from "../WorkShop/WorkShopSlice";
import { InitDiagnoser } from "../Diagnosers/DiagnoserSlice";
import { TypeGroups } from "../TypeGroup/TypeGroupSlice";
import style from "./safeAI.module.css";
import WorkshopResult from "./WorkshopResult";
import ReactMarkdown from "react-markdown";
import { useNavigate } from "react-router-dom";
import remarkGfm from "remark-gfm";
import OrderWorkshop from "../WorkShop/OrderWorkshop";
import LoginRequiredModal from "./LoginRequiredModal";

const WorkshopAI = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { questions, answers, result, loading } = useSelector((state) => state.WorkshopAI);

  const workshops = useSelector((state) => state.WorkShop.WorkShops);
  const statusW = useSelector((state) => state.WorkShop.status);
  const diagnosers = useSelector((state) => state.Diagnoser.Diagnosers);
  const statusD = useSelector((state) => state.Diagnoser.status);
  const groups = useSelector((state) => state.TypeGroup.groups);
  const statusType = useSelector((state) => state.TypeGroup.statusType);
  const thisuser = useSelector((state) => state.LogIn.thisUser);

  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [history, setHistory] = useState([]);
  const [typing, setTyping] = useState(false);

  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history, step, typing, loading]);

  useEffect(() => {
    const load = async () => {
      try {
        if (statusW === "faild" || statusW === "")
          await dispatch(InitWorkShops()).unwrap();
      }
      catch (err) {
        console.error("InitCustomer ERROR:", err);
      }
    }
    load()
  }, [statusW, dispatch]);

  useEffect(() => {
    const load = async () => {
      try {
        if (statusD === "faild" || statusD === "")
          await dispatch(InitDiagnoser()).unwrap();
      }
      catch (err) {
        console.error("InitCustomer ERROR:", err);
      }
    }
    load()
  }, [statusD, dispatch]);

  useEffect(() => {
    const load = async () => {
      try {
        if (statusType === "faild" || statusType === "")
          await dispatch(TypeGroups()).unwrap();
      }
      catch (err) {
        console.error("InitCustomer ERROR:", err);
      }
    }
    load()
  }, [statusType, dispatch]);


  const loadQuestions = async () => {
    await dispatch(ResetAIState());
    setOpen(true);
    setStep(0);
    setHistory([]);
    dispatch(GetAIQuestions());
  };

  const finish = async () => {
    const payload = questions.map((q, i) => q + " " + answers[i]);
    await dispatch(SendAnswersToAI(payload));
    setOpen(false);
  };

  const nextStep = () => {
    const userAnswer = answers[step] || "";
    setHistory((prev) => [
      ...prev,
      { type: "bot", text: questions[step] },
      { type: "user", text: userAnswer }
    ]);
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      if (step < questions.length - 1) {
        setStep(step + 1);
      } else {
        finish();
      }
    }, 400);
  };

  let workshop = null;

  if (result && typeof result === "string") {
    const match = result.match(/\d+/);
    if (match) {
      workshop = workshops.find((w) => w.code === Number(match[0]));
    }
  }

  let diagnoser = workshop
    ? diagnosers.find((d) => d.code === workshop.codeDiagnoser)
    : null;

  let typeGroup = workshop
    ? groups.find((g) => g.code === workshop.typeGroup)
    : null;

  let cleanResult = result;

  if (typeof cleanResult === "string") {
    cleanResult = cleanResult
      .replace(/```markdown/g, "")
      .replace(/```/g, "")
      .trim();
    cleanResult =
      "**מצאתי לך את הסנא המדויקת ביותר בשבילך על פי מה שביקשת:" +
      cleanResult.split("למה היא מתאימה:")[1];
  }

  if (statusType !== "succesfull" || statusD !== "succesfull" || statusW !== "succesfull") return <>טוען נתונים...</>

  return (
    <div className={style.safeAIPage}>
      <div className={style.chatContainer}>

        {/* ================= LOADING MODE (NEW FIX) ================= */}
        {loading && (
          <div className={style.loadingOverlay}>
            <div className={style.spinner}></div>
            <p>המערכת חושבת...</p>
          </div>
        )}

        {/* ================= CONTENT (hidden while loading) ================= */}
        {!loading && (
          <>
            <div className={style.chatHeader}>
              <h1 className={style.chatTitle}>התאמת סדנה חכמה</h1>
              <p className={style.chatSubtitle}>
                המערכת תעזור לך למצוא את הסדנה המדויקת ביותר עבורך לפי הצרכים, המטרה והקהל שלך.
                פשוט ענה על השאלות — ואנחנו נתאים לך התאמה אישית מתוך כל הסדנאות.
              </p>
            </div>

            {!open && (
              <button className={style.startBtn} onClick={loadQuestions}>
                לעזרה – התאמת סדנה
              </button>
            )}

            {open && questions.length > 0 && (
              <div className={style.chatBox}>
                {history.map((msg, i) => (
                  <div
                    key={i}
                    className={
                      msg.type === "user"
                        ? style.userMsg
                        : style.botMsg
                    }
                  >
                    {msg.text}
                  </div>
                ))}

                <div className={style.botMsg}>
                  {questions[step]}
                </div>

                {typing && (
                  <div className={style.typingBubble}>
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                )}

                <div className={style.inputRow}>
                  <input
                    className={style.input}
                    value={answers[step] || ""}
                    onChange={(e) =>
                      dispatch(
                        SetAnswer({
                          index: step,
                          value: e.target.value
                        })
                      )
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") nextStep();
                    }}
                  />

                  <button className={style.sendBtn} onClick={nextStep}>
                    {step < questions.length - 1 ? "הבא" : "סיום"}
                  </button>
                </div>

                <div ref={chatEndRef} />
              </div>
            )}

            {!open && result && workshop && (
              <WorkshopResult
                workshop={workshop}
                diagnoser={diagnoser}
                typeGroup={typeGroup}
                thisuser={thisuser}
                cleanResult={cleanResult}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default WorkshopAI;