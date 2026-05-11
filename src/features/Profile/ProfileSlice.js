import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const headers = {
    'Content-Type': 'application/json'
};

// AsyncThunk לקבלת תיאור לפי codeType
export const TypeDescription = createAsyncThunk('TypeDescription',
    async (codeType, { rejectWithValue }) => {
        try {
            const res = await axios.post(
                'https://localhost:7082/api/WorkShops/Type', 
                { code: codeType }, 
                { headers }
            );
            return { codeType, description: res.data.description }; // מחזירים גם את codeType
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

const initialState = {
    status: "",
    thisUser: null,
    statusUser: null,
    typeDescriptions: {}, // מפתח: codeType, ערך: description
    loadingType: false,
    errorType: null
};

const ProfileSlice = createSlice({
    name: "profile",
    initialState,
    reducers: {
        ProfilelogIn: (state, action) => {
            state.thisUser = action.payload.user;
            state.statusUser = action.payload.status;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(TypeDescription.pending, (state) => {
                state.loadingType = true;
                state.errorType = null;
            })
            .addCase(TypeDescription.fulfilled, (state, action) => {
                state.loadingType = false;
                const { codeType, description } = action.payload;
                state.typeDescriptions[codeType] = description;
            })
            .addCase(TypeDescription.rejected, (state, action) => {
                state.loadingType = false;
                state.errorType = action.payload;
            });
    }
});

export const { ProfilelogIn } = ProfileSlice.actions;
export default ProfileSlice.reducer;