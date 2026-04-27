import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios"


export const fetchStatus = createAsyncThunk(
    'StatusSlice/fetchAll',
    async () => {
        const res = await axios.get('https://localhost:7082/Statuses/ReadAll');
        return res.data;
    }
);

const StatusSlice = createSlice({
    name: 'statusSlice',
    initialState: {
        statuss: [],
        status: ''
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchStatus.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchStatus.fulfilled, (state, action) => {
                state.statuss = action.payload;
                state.status = 'success';
            })
            .addCase(fetchStatus.rejected, (state) => {
                state.status = 'failed';
            });
    }
});

export default StatusSlice.reducer;