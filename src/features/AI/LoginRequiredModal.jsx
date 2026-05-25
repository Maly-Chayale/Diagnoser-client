import style from "./LoginRequiredModal.module.css";

function LoginRequiredModal({ onLogin, onClose }) {

    return (
        <div className={style.backdrop}>

            <div className={style.modal}>

                <button
                    className={style.closeBtn}
                    onClick={onClose}
                >
                    ✕
                </button>
<div className={style.icon}>🔒</div>
                <div className={style.h2}>נדרשת התחברות</div>

                <div className={style.p}>
                    כדי להזמין סדנה צריך להתחבר למערכת
                </div>

                <div className={style.buttons}>

                    <button
                        className={style.loginBtn}
                        onClick={onLogin}
                    >
                        התחברות
                    </button>

                    <button
                        className={style.cancelBtn}
                        onClick={onClose}
                    >
                        ביטול
                    </button>

                </div>

            </div>

        </div>
    );
}

export default LoginRequiredModal;