const API_URL = import.meta.env.VITE_API_URL

import { AxiosError } from "axios"

export function concatApiUrl(endpoint?: string) {
  if(!endpoint){
    return API_URL
  }
  return API_URL + endpoint
}

export function concatApiWebsocketUrl(endpoint?: string) {
  let ws = API_URL.replace('http', 'ws')
  if(!endpoint){
    return ws
  }
  return ws + endpoint
}

interface ErrorResponse {
  message?: string;
  errors?: { msg: string }[];
}

export const handleErrorAxios = (error: AxiosError<ErrorResponse>) => {
  let errorMsg = ""
  if (error.response?.data?.message) {
    errorMsg = error.response.data.message
  }
  if (error.response?.data?.errors) {
    errorMsg = error.response.data.errors[0].msg
  }
  return errorMsg
}

import moment from "moment";

export function howManyTimePassed(date: string) {
  if (!date) return "not being set";
  return moment(date).fromNow();
}
