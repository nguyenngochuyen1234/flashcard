import { createSlice } from '@reduxjs/toolkit'

export const categorySlice = createSlice({
  name: 'category',
  initialState: {
    isCategoryModalOpen: false,
    categoryName:''
  },
  reducers: {
    openModalCategory: (state) => {
      state.isCategoryModalOpen = true
      console.log(state.isCategoryModalOpen)
    },
    closeModalCategory: (state) => {
      state.isCategoryModalOpen = false
    },
    setCategoryName: (state, action) => {
      state.categoryName = action.payload
    }
  },
})

export const { openModalCategory, closeModalCategory, setCategoryName } = categorySlice.actions

export default categorySlice.reducer