import { createSlice } from '@reduxjs/toolkit'

export const categorySlice = createSlice({
  name: 'category',
  initialState: {
    isCategoryModalOpen: false,
    categoryName:'',
    categoryColor:''
  },
  reducers: {
    openModalCategory: (state) => {
      state.isCategoryModalOpen = true
      console.log(state.isCategoryModalOpen)
    },
    closeModalCategory: (state) => {
      state.isCategoryModalOpen = false
    },
    setCategory: (state, action) => {
      state.categoryName = action.payload.name
      state.categoryColor = action.payload.color
    }
  },
})

export const { openModalCategory, closeModalCategory, setCategory } = categorySlice.actions

export default categorySlice.reducer