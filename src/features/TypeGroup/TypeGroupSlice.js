import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios"


export const fetchTypeGroups = createAsyncThunk(
    'typeGroups/fetchAll',
    async () => {
        const res = await axios.get('https://localhost:7082/ReadAll');
        return res.data;
    }
);

const TypeGroupSlice = createSlice({
    name: 'typeGroups',
    initialState: {
        groups: [],
        status: ''
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTypeGroups.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchTypeGroups.fulfilled, (state, action) => {
                state.groups = action.payload;
                state.status = 'success';
            })
            .addCase(fetchTypeGroups.rejected, (state) => {
                state.status = 'failed';
            });
    }
});

export default TypeGroupSlice.reducer;