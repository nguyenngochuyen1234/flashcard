import { createSlice } from '@reduxjs/toolkit'

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    user:{}
  },
  reducers: {
    saveUserData: (state, action) => {
        state.user = action.payload
      },
  },
})

export const { saveUserData } = userSlice.actions

export default userSlice.reducer