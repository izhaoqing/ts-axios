type Method = 'get' | 'post' | 'GET' | 'POST'

export interface AxiosRequestConfig {
  url: string
  method?: Method
  data?: any
  params?: any,
  headers?: any,
  responseType?: XMLHttpRequestResponseType
}

export interface AxiosResponse {
  data: any,
  status: number,
  // 状态信息
  statusText: string,
  // 响应头
  headers: any,
  // 请求配置
  config: AxiosRequestConfig,
  // xhr 实例
  request: any
}

export interface AxiosPromise extends Promise<AxiosResponse>{}
