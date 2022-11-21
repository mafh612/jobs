import { AxiosError, AxiosInstance, AxiosResponse } from 'axios'

export const extractData: <T>(response: AxiosResponse<T>) => T = <T>(response: AxiosResponse<T>): T => response.data
export const extractToken =
  (client: AxiosInstance) =>
  (response: AxiosResponse): AxiosResponse => {
    client.defaults.headers.authorization = response.headers['set-cookie'][0].split(/[=;]/)[1]

    return response
  }
export const handleError: <T>(error: AxiosError<T>) => T = <T>(error: AxiosError<T>): T => error.response.data
