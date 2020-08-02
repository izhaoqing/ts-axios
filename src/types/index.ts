type Method = 'get' | 'post' | 'GET' | 'POST'

export interface AxiosRequestConfig {
  url: string
  method?: Method
  data?: any
  params?: any
}
