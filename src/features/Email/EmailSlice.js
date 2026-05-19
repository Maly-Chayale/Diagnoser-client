import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    status: "",
    error: null
};

const headers = {
    'Content-Type': 'application/json'
}

// thunk לשליחת מייל דרך השרת
export const sendEmail = createAsyncThunk(
    "sendEmail",
    async ({ toEmail, subject, body }, { rejectWithValue }) => {
        // try {
            const response = await axios.post('https://localhost:7082/api/Email/SendEmail', {
                ToEmail: toEmail,
                Subject: subject,
                Body: body
            }, { headers });
            return response.data;
        // } catch (error) {
        //     return rejectWithValue(error.response?.data || error.message);
        // }
    }
);

const EmailSlice = createSlice({
    name: "Email",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(sendEmail.pending, (state) => {
                state.status = "loading";
            })
            .addCase(sendEmail.fulfilled, (state) => {
                state.status = "success";
            })
            .addCase(sendEmail.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            });
    }
});

export default EmailSlice.reducer;