import { createSlice } from '@reduxjs/toolkit'

export const collectionsSlice = createSlice({
    name: 'collections',
    initialState: {
        collections: []
    },
    reducers: {
        saveCollections: (state, action) => {
            state.collections = action.payload
        }
    },
})

export const { saveCollections } = collectionsSlice.actions

export default collectionsSlice.reducer