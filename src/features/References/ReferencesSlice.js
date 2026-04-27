
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios"

const initialState = {
    status: "",
    references: []
}

const headers = {
    'Content-Type': 'application/json'
}

export const InitReferences = createAsyncThunk("InitReferences",
    async () => {
        let data
        await axios.get('https://localhost:7082/References/ReadAll').then(res => {
            data = res.data
        })
        return data
    })

export const addReference = createAsyncThunk("addReference",
    async (Reference) => {
        await axios.post('https://localhost:7082/References/Add', Reference,
            {
                headers: headers
            }).then(res => { })
        return Reference
    })

export const deleteReference = createAsyncThunk("deleteReference",
    async (Reference) => {
        await axios.delete('https://localhost:7082/References/Delete',
            {
                headers: headers,
                data: Reference
            }
        ).then(res => { })
        return Reference
    })

export const updateReference = createAsyncThunk("updateReference",
    async (Reference) => {
        await axios.put('https://localhost:7082/References/Update', Reference,
            {
                headers: headers
            }
        ).then(res => { })
        return Reference
    })

export const closeOrder = createAsyncThunk("closeOrder",
    async (code) => {
        await axios.put('https://localhost:7082/References/CloseOrder/' + code,
            {
                headers: headers
            }).then(res => { })
    }
)

export const pay = createAsyncThunk("pay",
    async (code) => {
        await axios.put('https://localhost:7082/References/Pay', code,
            {
                headers: headers
            }).then(res => { })
    }
)

export const deleteOrder = createAsyncThunk("pay",
    async (code) => {
        await axios.put('https://localhost:7082/References/Pay', code,
            {
                headers: headers
            }).then(res => { })
    }
)

export const workshop = createAsyncThunk("workshop",
    async (code) => {
        let workshop
        await axios.get('https://localhost:7082/References/GetWorkShop',
            {
                params: { code },
                headers: headers
            }).then(res => {
                workshop = res.data
            })
        return workshop
    }
)

export const diagnoser = createAsyncThunk("diagnoser",
    async (code) => {
        let diagnoser
        await axios.get('https://localhost:7082/References/GetDiagnoser',
            {
                params: { code },
                headers: headers
            }).then(res => {
                diagnoser = res.data
            })
        return diagnoser
    }
)


const ReferencesSlice = createSlice({
    name: "references",
    initialState,
    reducers: {
        close: (state, action) => {
            const r = state.references.find(r => r.code = action.payload)
            r.status = 3
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(InitReferences.pending, (state) => {
                state.status = "loading"
            })
            .addCase(InitReferences.fulfilled, (state, action) => {
                state.status = "succesfull"
                state.references = action.payload;
            })
            .addCase(InitReferences.rejected, (state) => {
                state.status = "faild"
            })
            .addCase(addReference.fulfilled, (state, action) => {
                const Reference = action.payload;
                state.status = "succesfull";
                state.references = state.references.push(Reference)
            })
            .addCase(deleteReference.fulfilled, (state, action) => {
                const Reference = action.payload;
                state.status = "succesfull";
                state.references = state.references.filter(r => r.code == Reference.code)
            })
            .addCase(deleteReference.pending, (state) => {
                state.status = "loading"
            })
            .addCase(deleteReference.rejected, (state) => {
                state.status = "faild"
            })
            .addCase(updateReference.fulfilled, (state, action) => {
                const Reference = action.payload;
                let i = state.references.findIndex(r => r.code == Reference.code)
                state.references[i] = Reference
            })
            .addCase(closeOrder.fulfilled, (state) => {
                InitReferences()
            })
            .addCase(pay.fulfilled, (state) => {
                InitReferences()
            });
    }
})

export const { close } = ReferencesSlice.actions
export default ReferencesSlice.reducer;