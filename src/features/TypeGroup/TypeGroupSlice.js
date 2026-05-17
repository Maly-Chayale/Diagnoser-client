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
                state.status = 'loading';
            })
            .addCase(TypeGroups.fulfilled, (state, action) => {
                state.groups = action.payload;
                state.status = 'success';
            })
            .addCase(TypeGroups.rejected, (state) => {
                state.status = 'failed';
            });
    }
});

export default TypeGroupSlice.reducer;