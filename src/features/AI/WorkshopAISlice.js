import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    questions: [],
    answers: [],
    result: null,
    loading: false,
    error: null
};

export const GetAIQuestions = createAsyncThunk(
    "WorkshopAI/GetAIQuestions",
    async () => {

        const res = await axios.get(
            "https://localhost:7082/api/WorkshopAI/questions"
        );

        return res.data;
    }
);

export const SendAnswersToAI = createAsyncThunk(
    "WorkshopAI/SendAnswersToAI",
    async (answers) => {

        const body = {
            answer1: answers[0],
            answer2: answers[1],
            answer3: answers[2],
            answer4: answers[3],
            answer5: answers[4]
        };

        const res = await axios.post(
            "https://localhost:7082/api/WorkshopAI/recommend",
            body,
            {
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );

        return res.data;
    }
);

const WorkshopAISlice = createSlice({
    name: "WorkshopAI",
    initialState,
    reducers: {
        SetAnswer: (state, action) => {
            const { index, value } = action.payload;
            state.answers[index] = value;
        },
        ResetAIState: (state) => {
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
                } 
                else 
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

export const { SetAnswer, ResetAIState } = WorkshopAISlice.actions;
export default WorkshopAISlice.reducer;