// store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slice/authSlice';
import agentReducer from './slice/agentSlice';

// Define RootState and AppDispatch for proper typing
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

const store = configureStore({
  reducer: {
    auth: authReducer,
    agent:agentReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable if you have non-serializable data
    }),
});

export default store;