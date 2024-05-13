import { configureStore } from '@reduxjs/toolkit'
import isLoggedInReducer from './isLoggedInSlice';

export default configureStore({
  reducer: {
    logged_in   : isLoggedInReducer,
  },
})
