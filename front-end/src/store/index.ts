import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import authReducer from './reducers/authReducer';
import webSocketMiddleware from '@/middleware/websocket';
import chatReducer from './reducers/chatReducer';
import notificationReducer from './reducers/notificationReducer';

function loadState() {
  try {
    const serializedState = localStorage.getItem('state');
    if (serializedState === null) {
      return undefined; // No state in localStorage
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
}

const persistedState = loadState();

const rootReducer = combineReducers({
  auth: authReducer,
  chat: chatReducer,
  notification: notificationReducer,
});

const store = configureStore({
  reducer: rootReducer,
  preloadedState: persistedState,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    }).concat(webSocketMiddleware()),
});

store.subscribe(() => {
  try {
    const serializedState = JSON.stringify(store.getState());
    localStorage.setItem('state', serializedState);
  } catch (err) {
    // Handle write errors or implement a more sophisticated error handling
  }
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store;
