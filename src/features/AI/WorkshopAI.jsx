import { useDispatch, useSelector } from "react-redux";
import {
  GetAIQuestions,
  ResetAIState,
  SendAnswersToAI,
  SetAnswer
} from "./WorkshopAISlice";

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
import DiagnoserResult from "./DiagnoserResult ";


const WorkshopAI = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

    const { questions, answers, result, loading, mode } = useSelector((state) => state.WorkshopAI);


  const workshops = useSelector((state) => state.WorkShop.WorkShops);
  const statusW = useSelector((state) => state.WorkShop.status);
  const diagnosers = useSelector((state) => state.Diagnoser.Diagnosers);
  const statusD = useSelector((state) => state.Diagnoser.status);
  const groups = useSelector((state) => state.TypeGroup.groups);
  const statusType = useSelector((state) => state.TypeGroup.statusType);
  const thisuser = useSelector((state) => state.LogIn.thisUser);
  const resultType = useSelector((state) => state.WorkshopAI.resultType);

  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [history, setHistory] = useState([]);
  const [typing, setTyping] = useState(false);

  const [loadingMode, setLoadingMode] = useState(false);


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


  // =========================
  // בחירת סוג חיפוש
  // =========================
  const loadQuestions = async (selectedMode) => {
    setLoadingMode(true);

    dispatch(ResetAIState());
    dispatch(SetMode(selectedMode));

    dispatch(SetResultType(selectedMode)); // 👈 חדש

    setStep(0);
    setHistory([]);

    await dispatch(GetAIQuestions(selectedMode));

    setLoadingMode(false);
    setOpen(true);
  };

  // =========================
  // סיום ושליחה
  // =========================
  const finish = async () => {
    const payload = questions.map((q, i) => q + "? " + answers[i]);

    await dispatch(
      SendAnswersToAI({
        type: mode,
        answers: payload,
        data: mode == "workshop" ? workshops : diagnosers
      })
    );

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

  // =========================
  // התאמת תוצאה
  // =========================
  // let workshop = null;

  // if (result && typeof result === "string") {
  //   const match = result.match(/\d+/);
  //   if (match) {
  //     workshop = workshops.find((w) => w.code === Number(match[0]));
  //   }
  // }

  // let diagnoser = workshop
  //   ? diagnosers.find((d) => d.code === workshop.codeDiagnoser)
  //   : null;

  // let workshop = null;
  // let diagnoser = null;

  // let typeGroup = workshop
  //   ? groups.find((g) => g.code === workshop.typeGroup)
  //   : null;

  // let cleanResult = result;

  // if (typeof cleanResult === "string") {
  //   cleanResult = cleanResult
  //     .replace(/```markdown/g, "")
  //     .replace(/```/g, "")
  //     .trim();

  //   cleanResult =
  //     "**מצאתי לך את הסנא המדויקת ביותר בשבילך על פי מה שביקשת:" +
  //     cleanResult.split("למה היא מתאימה:")[1];
  // }



  // const code = Number(result?.match?.(/\d+/)?.[0]);

  // if (resultType === "workshop" && !isNaN(code)) {
  //   workshop = workshops.find(
  //     (w) => w.code === code
  //   );

  //   diagnoser = workshop
  //     ? diagnosers.find(
  //       (d) => d.code === workshop.codeDiagnoser
  //     )
  //     : null;
  // }

  // if (resultType === "diagnoser" && !isNaN(code)) {
  //   diagnoser = diagnosers.find(
  //     (d) => d.code === code
  //   );
  // }

  // =========================
  // UI
  // =========================
  return (
    <div className={style.safeAIPage}>
      <div className={style.chatContainer}>

        {/* ================= בחירה ראשונית ================= */}
        {(
          <div className={style.chatHeader}>
            <h1 className={style.chatTitle}>בחר סוג חיפוש</h1>

            <div className={style.modeButtons}>

              <button
                className={`${style.modeBtn} ${style.modeBtnWorkshop}`}
                onClick={() => loadQuestions("workshop")}
              >
                🔍 חיפוש מהיר של סדנה
              </button>

              <button
                className={`${style.modeBtn} ${style.modeBtnDiagnoser}`}
                onClick={() => loadQuestions("diagnoser")}
              >
                👤 חיפוש מהיר של מאבחנת
              </button>

            </div>
          </div>
        )}

        {/* ================= מערכת חושבת ================= */}
        {loadingMode && (
          <div className={style.loadingOverlay}>
            <div className={style.spinner}></div>
            <p>המערכת חושבת...</p>
          </div>
        )}
        {!loadingMode && loading && (
          <div className={style.loadingOverlay}>
            <div className={style.spinner}></div>
            <p> מחפש</p>
          </div>
        )}


        {/* ================= צ׳אט ================= */}
        {!loadingMode && mode && open && questions.length > 0 && (
          <>
            <div className={style.chatHeader}>
              <h1 className={style.chatTitle}>
                התאמת {mode === "workshop" ? "סדנה" : "מאבחנת"}
              </h1>
            </div>

            <div className={style.chatBox}>
              {history.map((msg, i) => (
                <div
                  key={i}
                  className={
                    msg.type === "user" ? style.userMsg : style.botMsg
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
                  <span></span><span></span><span></span>
                </div>
              )}

              {!loading && <div className={style.inputRow}>
                <input
                  className={style.input}
                  value={answers[step] || ""}
                  onChange={(e) =>
                    dispatch(SetAnswer({ index: step, value: e.target.value }))
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") nextStep();
                  }}
                />

                <button className={style.sendBtn} onClick={nextStep}>
                  {step < questions.length - 1 ? "הבא" : "סיום"}
                </button>
              </div>}

              <div ref={chatEndRef} />
            </div>
          </>
        )}

        {/* ================= תוצאה ================= */}
        {!open && result && resultType === "workshop" && (
          <WorkshopResult
            thisuser={thisuser}
            answer={result}
          />
        )}

        {!open && result && resultType === "diagnoser" && (
          <DiagnoserResult
            thisuser={thisuser}
            answer={result}
          />
        )}
      </div>
    </div>
  );
};

export default WorkshopAI;