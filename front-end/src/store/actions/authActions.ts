import { User } from '../../types/index'
import axios from 'axios';
import { concatApiUrl, handleErrorAxios } from '../../utils/index';
import api from '../../api/axios';
import {NavigateFunction} from 'react-router-dom';
import { AxiosError } from 'axios';

export const loginSuccess = (user : User ) => ({
    type: 'LOGIN_SUCCESS',
    payload: user
  });
  
  export const loginFailure = (error : unknown) => ({
    type: 'LOGIN_FAILURE',
    payload: error
  });
  
  export const logout = () => ({
    type: 'LOGOUT'
  });

  export const clearError = () => ({
    type: 'CLEAR_ERROR'
  });

  export const login = (credentials : {
    username: string,
    password: string
  }) => {
    return (dispatch : any) => {
      axios.post(concatApiUrl('user/login'), credentials)
        .then((response : any) => {
          dispatch(loginSuccess(response.data));
        })
        .catch((error: unknown) => {
          if (error instanceof Error) {
            dispatch(loginFailure(error.message));
          } else {
            console.log(error);
            dispatch(loginFailure(String(error)));
          }
        });
    };
  };


  export const signup = (credentials : {
    username: string,
    password: string
  }, navigate : NavigateFunction) => {
    return (dispatch : any) => {
      axios.post(concatApiUrl('user/signup'), credentials)
        .then((response : any) => {
          dispatch(signUpSuccess(response.data));
          navigate('/auth/signin');
        })
        .catch((error: unknown) => {
          if (error instanceof AxiosError) {
            dispatch(signUpFailure(handleErrorAxios(error)));
          } else {
            dispatch(signUpFailure(String(error)));
          }
        });
    };
  };

  export const signUpSuccess = (user : User ) => ({
    type: 'SIGNUP_SUCCESS',
    payload: user
  });

  export const signUpFailure = (error : unknown) => ({
    type: 'SIGNUP_FAILURE',
    payload: error
  });


  export const editSuccess = (user : User ) => ({
    type: 'EDIT_SUCCESS',
    payload: user
  });

  export const editFailure = (error : unknown) => ({
    type: 'EDIT_FAILURE',
    payload: error
  });

  export const editUser = (formData: FormData, user: User) => {
    return (dispatch : any) => {
      api.patch(`user/users/${user.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
        .then((response : any) => {
          dispatch(editSuccess(response.data));
          
        })
        .catch((error: unknown) => {
          if (error instanceof Error) {
            dispatch(editFailure(error.message));
          } else {
            console.log(error);
            dispatch(editFailure(String(error)));
          }
        });
    };
  };



   