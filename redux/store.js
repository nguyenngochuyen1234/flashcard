import { configureStore } from '@reduxjs/toolkit'
import categoryReducer from './categorySlice'
import userReducer from './userSlice'
import collectionReducer from './collectionsSlice'
export default configureStore({
  reducer: { userReducer,categoryReducer, collectionReducer },
})