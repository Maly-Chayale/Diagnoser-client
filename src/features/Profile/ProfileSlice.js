
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// export const UpdateDiagnoser=createAsyncThunk("UpdateDiagnoser",
//     async (diagnoser)=>{
//         axios.put("https://localhost:7082/Diagnosers/Update", )
//     }
// )
 
const initialState = {
    status: "",
    thisUser: null,
    statusUser: null
}

const headers = {
    'Content-Type': 'application/json'
}

const ProfileSlice = createSlice({
    name: "profile",
    initialState,
    reducers: {
        ProfilelogIn: (state, action) => {
            state.thisUser = action.payload.user
            state.statusUser = action.payload.status
        }
    },
    extraReducers: (builder) => {
    }
})

export const { ProfilelogIn } = ProfileSlice.actions
export default ProfileSlice.reducer;
























// import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import axios from "axios";

// const headers = {
//     'Content-Type': 'application/json'
// };

// export const workshop = createAsyncThunk(
//     "profile/workshop",
//     async (code, { rejectWithValue }) => {
//         try {
//             const response = await axios.get(
//                 'https://localhost:7082/References/GetWorkShop',
//                 { params: { code }, headers }
//             );
//             return response.data;
//         } catch (error) {
//             return rejectWithValue(error.response?.data || error.message);
//         }
//     }
// );

// const initialState = {
//     status: "",
//     thisUser: null,
//     statusUser: null,
//     workshop: null,
//     error: null
// };

// const ProfileSlice = createSlice({
//     name: "profile",
//     initialState,
//     reducers: {
//         ProfilelogIn: (state, action) => {
//             state.thisUser = action.payload.user;
//             state.statusUser = action.payload.status;
//         }
//     },
//     extraReducers: (builder) => {
//         builder
//             .addCase(workshop.fulfilled, (state, action) => {
//                 state.workshop = action.payload;
//                 state.error = null;
//             })
//             .addCase(workshop.rejected, (state, action) => {
//                 state.error = action.payload;
//             });
//     }
// });

// export const { ProfilelogIn } = ProfileSlice.actions;
// export default ProfileSlice.reducer;