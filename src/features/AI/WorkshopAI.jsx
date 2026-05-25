import { useDispatch, useSelector } from "react-redux";
import { GetAIQuestions, ResetAIState, SendAnswersToAI, SetAnswer } from "./WorkshopAISlice";
import ReactMarkdown from "react-markdown";
import { useEffect, useState } from "react";
import { InitWorkShops } from "../WorkShop/WorkShopSlice";
import { InitDiagnoser } from "../Diagnosers/DiagnoserSlice";
import { TypeGroups } from "../TypeGroup/TypeGroupSlice";
import { useNavigate } from "react-router-dom";
import style from "./safeAI.module.css";
import remarkGfm from "remark-gfm";
import OrderWorkshop from "../WorkShop/OrderWorkshop";
import LoginRequiredModal from "./LoginRequiredModal";

const WorkshopAI = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { questions, answers, result, loading } =
    useSelector(state => state.WorkshopAI);

  const workshops = useSelector(state => state.WorkShop.WorkShops);
  const diagnosers = useSelector(state => state.Diagnoser.Diagnosers);
  const groups = useSelector(state => state.TypeGroup.groups);
  const thisuser = useSelector(state => state.LogIn.thisUser);
  const statusW = useSelector(state => state.WorkShop.status);
  const statusD = useSelector(state => state.Diagnoser.status);
  const statusType = useSelector(state => state.TypeGroup.statusType);

  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [isOrderOpen, setIsOrderOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  /* =========================
     RESET + START CHAT
  ========================= */

  const loadQuestions = async () => {
    await dispatch(ResetAIState());
    setOpen(true);
    setStep(0);
    dispatch(GetAIQuestions());
  };


  const finish = async () => {

    const payload =
      questions.map((q, i) => (q + " " + answers[i]));

    await dispatch(SendAnswersToAI(payload));

    setOpen(false);
  };

  /* =========================
     LOAD STORES
  ========================= */

  useEffect(() => {

    if (statusW === "")
      dispatch(InitWorkShops());

    if (statusD === "")
      dispatch(InitDiagnoser());

    if (statusType === "")
      dispatch(TypeGroups());

  }, [dispatch, statusW, statusD, statusType]);

  /* =========================
     PARSE RESULT
  ========================= */

  let workshop = null;

  if (result && typeof result === "string") {
    console.log(result);

    const match = result.match(/\d+/);

    if (match) {

      workshop = workshops.find(
        w => w.code === Number(match[0])
      );
    }
  }

  let diagnoser = workshop
    ? diagnosers.find(d => d.code === workshop.codeDiagnoser)
    : null;

  let typeGroup = workshop
    ? groups.find(g => g.code === workshop.typeGroup)
    : null;

  let cleanResult = result;

  if (typeof cleanResult === "string") {
    cleanResult = cleanResult
      .replace(/```markdown/g, "")
      .replace(/```/g, "")
      .trim();
  }

  /* =========================
     UI
  ========================= */

  return (
    <>
      <div className={style.safeAIPage}>
        <div className={style.chatContainer}>

          {/* START BUTTON */}
          {!open && (
            <button
              className={style.startBtn}
              onClick={loadQuestions}
            >
              לעזרה – התאמת סדנה חכמה
            </button>
          )}

          {/* LOADING OVERLAY */}
          {loading && (
            <div className={style.loadingOverlay}>
              <div className={style.spinner}></div>
              <p>המערכת חושבת...</p>
            </div>
          )}

          {/* CHAT FLOW */}
          {open && questions.length > 0 && (
            <div className={style.chatBox}>

              {/* BOT QUESTION */}
              <div className={style.botMsg}>
                {questions[step]}
              </div>

              {/* USER ANSWER INPUT */}
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

                    if (e.key === "Enter") {

                      if (step < questions.length - 1) {

                        setStep(step + 1);

                      } else {

                        finish();
                      }
                    }
                  }}
                />

                {step < questions.length - 1 ? (
                  <button
                    className={style.sendBtn}
                    onClick={() => setStep(step + 1)}
                  >
                    הבא
                  </button>
                ) : (
                  <button
                    className={style.sendBtn}
                    onClick={finish}
                  >
                    סיום
                  </button>
                )}

              </div>

            </div>
          )}

          {!open && result &&
            (
              <div className={style.aiMessage} dir="rtl">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {cleanResult}
                </ReactMarkdown>
              </div>
            )
          }

          {/* RESULT */}
          {!open && workshop && (
            <div className={style.resultBox}>

              <h2>{workshop.description}</h2>

              <p>מחיר: {workshop.price}</p>
              <p>כמות משתתפים: {workshop.accontOfPeople}</p>

              {typeGroup && (
                <p>סוג קבוצה: {typeGroup.description}</p>
              )}

              {diagnoser && (
                <div>
                  <h3>מאבחנת</h3>
                  <p>{diagnoser.name}</p>
                  <p>{diagnoser.mail}</p>
                </div>
              )}

              <button
                onClick={() =>
                  navigate(`/WorkshopDetails/${workshop.code}`)
                }
              >
                מעבר לפרטי הסדנה
              </button>

              <button
                onClick={() => {
                  if (!thisuser) {
                    setShowLoginModal(true);
                    return;
                  }
                  setIsOrderOpen(true);
                }}
              >
                הזמנת סדנה
              </button>

              {isOrderOpen && workshop && diagnoser && (
                <OrderWorkshop
                  WorkShop={workshop}
                  diagnoser={diagnoser}
                  onClose={() => setIsOrderOpen(false)}
                />
              )}



            </div>
          )}

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

export default WorkshopAI;