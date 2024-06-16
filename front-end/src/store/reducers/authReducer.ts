import { Action } from '../../types/index';

const initialState = {
    user: null,
    error: null,
    isAuthenticated: false
  };
  
  const authReducer = (state = initialState, action : Action) => {
    switch (action.type) {
      case 'LOGIN_SUCCESS':
        localStorage.setItem('state', JSON.stringify(state));
        return {
          ...state,
          isAuthenticated: true,
          user: action.payload,
          error: null
        };
      case 'LOGIN_FAILURE':
        return {
          ...state,
          isAuthenticated: false,
          error: action.payload
        };
      case 'LOGOUT':
        return {
          ...state,
          isAuthenticated: false,
          user: null
        };
      case 'CLEAR_ERROR':
        return {
          ...state,
          error: null
        };
      case 'EDIT_SUCCESS':
        return {
          ...state,
          user: action.payload,
          error: null
        };
      case 'EDIT_FAILURE':
        return {
          ...state,
          error: action.payload
        };
      case 'SIGNUP_SUCCESS':
        return{
          ...state,
          error: null
        }
      case 'SIGNUP_FAILURE':
        return{
          ...state,
          error: action.payload
        }
      
      default:
        return state;
    }
  };
  
  export default authReducer;