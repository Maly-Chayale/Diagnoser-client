import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    mode: null,
    resultType: null,
    questions: [],
    answers: [],
    result: null,

    loading: false,
    error: null
};

// ==========================
// קבלת שאלות לפי סוג
// ==========================
export const GetAIQuestions = createAsyncThunk(
    "WorkshopAI/GetAIQuestions",
    async (type) => {
        const res = await axios.get(
            `https://localhost:7082/api/AI/questions/${type}`
        );

        return res.data;
    }
);

// ==========================
// שליחת תשובות לפי סוג
// ==========================
export const SendAnswersToAI = createAsyncThunk(
    "WorkshopAI/SendAnswersToAI",
    async ({ type, answers, data }) => {

        const body = {
            answer1: answers[0],
            answer2: answers[1],
            answer3: answers[2],
            answer4: answers[3],
            answer5: answers[4]
    };
        try {
            const res = await axios.post(
                `https://localhost:7082/api/AI/recommend/${type}`,
                body,
                {
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );

            // ⬅️ סימולציה של "המערכת חושבת"
            // await new Promise(resolve => setTimeout(resolve, 1200));
            console.log("res");
            console.log(res);


            return res.data;
        }
        catch {
            if (type == "workshop") {
                let code = data[Math.floor(Math.random() * data.length)].code
                return "קוד סדנה " + code + "למה היא מתאימה:** כי היא עונה לדרישות שלך"
            }

            else {
                let code = data[Math.floor(Math.random() * data.length)].code
                return "קוד סדנה " + code + "סיבה לבחירה:** כי היא עונה לדרישות שלך"
            }
        }
    }
);

const WorkshopAISlice = createSlice({
    name: "WorkshopAI",
    initialState,

    reducers: {

        SetResultType: (state, action) => {
            state.resultType = action.payload;
        },

        SetAnswer: (state, action) => {
            const { index, value } = action.payload;
            state.answers[index] = value;
        },

        SetMode: (state, action) => {
            state.mode = action.payload;
        },

        ResetAIState: (state) => {
            state.mode = null;
            state.questions = [];
            state.answers = [];
            state.result = null;
            state.loading = false;
            state.error = null;
        }
    },

    extraReducers: (builder) => {
        builder

            .addCase(GetAIQuestions.pending, (state) => {
                state.loading = true;
            })
            .addCase(GetAIQuestions.fulfilled, (state, action) => {
                state.loading = false;
                if (typeof action.payload === "string") {
                    state.questions = action.payload
                        .split("\n")
                        .filter(q => q.trim() !== "");

                    console.log(state.questions);


                } else {

                    state.questions = action.payload;
                })
            .addCase(GetAIQuestions.rejected, (state) => {
                state.loading = false;
                state.error = "error";
            })

            .addCase(SendAnswersToAI.pending, (state) => {
                state.loading = true;
            })
            .addCase(SendAnswersToAI.fulfilled, (state, action) => {
                state.loading = false;
                state.result = action.payload;
            })
            .addCase(SendAnswersToAI.rejected, (state) => {
                state.loading = false;
                state.error = "error";
            });
    }
});

export const { SetAnswer, SetMode, ResetAIState, SetResultType } = WorkshopAISlice.actions;
export default WorkshopAISlice.reducer;