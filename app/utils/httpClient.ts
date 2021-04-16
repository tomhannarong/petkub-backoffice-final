import axios from 'axios'

import { getCookie } from './cookie';


const httpClient = axios.create({
  baseURL: "http://localhost:3000/"
})

export const setInterceptor = () => {
  httpClient.interceptors.request.use((req) => {
    const accessToken = getCookie("accessToken")
    const refreshToken = getCookie("refreshToken")
    if (accessToken) req.headers = { 'Authorization': "Bearer " + accessToken }
    return req
  })


  httpClient.interceptors.response.use(function (response) {
    return response;
  }, function (error) {
    if (403 === error.response.status || 401 === error.response.status || 500 === error.response.status) {
      // dispatch(actions.logout());
    } else {
      return Promise.reject(error);
    }
  });

}

export default httpClient
