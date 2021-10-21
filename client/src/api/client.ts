import axios, { AxiosResponse } from 'axios'

import { FetchState, FetchingState } from '../models'
import { ServerSuccessResp } from './models'
import { parseErrorMessage } from './parser'

const client = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/',
})

export default client

type AxiosSuccessResp<T> = AxiosResponse<ServerSuccessResp<T>>

export const getData = <T>(
  ...args: Parameters<typeof client.get>
): Promise<Exclude<FetchState<T>, FetchingState>> => client
    .get(...args)
    .then(
      ({ data }: AxiosSuccessResp<T>) => ({
        type: 'success',
        data: data.data,
        timestamp: new Date(data.timestamp),
      }),
      (err) => ({
        type: 'error',
        message: parseErrorMessage(err),
      }),
    )
