import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios"


export const TypeGroups = createAsyncThunk('TypeGroups',
    async () => {
        const res = await axios.get('https://localhost:7082/ReadAll');
        return res.data;
    }
);

const TypeGroupSlice = createSlice({
    name: 'typeGroups',
    initialState: {
        groups: [],
        statusType: ''
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(TypeGroups.pending, (state) => {
                state.statusType = 'loading';
            })
            .addCase(TypeGroups.fulfilled, (state, action) => {
                state.statusType = 'succesfull';
                state.groups = action.payload;
            })
            .addCase(TypeGroups.rejected, (state) => {
                state.statusType = 'failed';
            });
    }
});

export default TypeGroupSlice.reducer;