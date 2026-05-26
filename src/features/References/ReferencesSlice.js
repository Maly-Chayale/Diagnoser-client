
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";


const initialState = {
    status: "",
    references: []
}

const headers = {
    'Content-Type': 'application/json'
}

// --- Async Thunks ---
export const InitReferences = createAsyncThunk("InitReferences",
    async () => {
        const res = await axios.get('https://localhost:7082/References/ReadAll');
        return res.data;
    }
)

export const addReference = createAsyncThunk("addReference",
    async (Reference) => {
        const res = await axios.post('https://localhost:7082/References/Add', Reference, { headers });
        return res.data; // מחזיר את מה שהשרת מחזיר
    }
)

export const deleteReference = createAsyncThunk("deleteReference",
    async (Reference) => {
        await axios.delete('https://localhost:7082/References/Delete', {
            headers,
            data: Reference
        });
        return Reference;
    }
)

export const updateReference = createAsyncThunk("updateReference",
    async (Reference) => {
        await axios.put('https://localhost:7082/References/Update', Reference, { headers });
        return Reference;
    }
)

export const closeOrder = createAsyncThunk("closeOrder",
    async (code, { dispatch }) => {
        await axios.put('https://localhost:7082/References/CloseOrder/' + code, { headers });
        // 🔹 תיקן: הוספתי dispatch כדי לרענן את הרשימה
        dispatch(InitReferences());
    }
)

export const pay = createAsyncThunk("pay",
    async (code, { dispatch }) => {
        await axios.put(`https://localhost:7082/References/Pay/${code}`);
        dispatch(InitReferences());
    }
)

// --- תיקון של close reducer ---
const ReferencesSlice = createSlice({
    name: "references",
    initialState,
    reducers: {
        close: (state, action) => {
            // 🔹 קודם היה r.code = action.payload (שגוי), עכשיו נכון:
            const r = state.references.find(r => r.code === action.payload);
            if (r) r.status = 3;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(InitReferences.pending, (state) => { state.status = "loading"; })
            .addCase(InitReferences.fulfilled, (state, action) => {
                state.status = "succesfull";
                state.references = action.payload;
            })
            .addCase(InitReferences.rejected, (state) => { state.status = "failed"; })

            .addCase(addReference.fulfilled, (state, action) => {
                state.status = "succesfull";
                state.references = [...state.references, action.payload];
            })

            .addCase(deleteReference.fulfilled, (state, action) => {
                state.status = "succesfull";
                // 🔹 קודם היה ==, עכשיו משתמשים != כדי למחוק
                state.references = state.references.filter(r => r.code !== action.payload.code);
            })
            .addCase(deleteReference.pending, (state) => {
                state.status = "loading";
            })
            .addCase(deleteReference.rejected, (state) => {
                state.status = "failed";
            })
            .addCase(updateReference.fulfilled, (state, action) => {
                const idx = state.references.findIndex(r => r.code === action.payload.code);
                if (idx !== -1) state.references[idx] = action.payload;
            });
    }
})

export const { close } = ReferencesSlice.actions;
export default ReferencesSlice.reducer;

