export type Method = 'get' | 'post' | 'GET' | 'POST' | 'get' | 'options' | 'put' | 'delete' | 'head' | 'patch'

export interface AxiosRequestConfig {
  url?: string
  method?: Method
  data?: any
  params?: any,
  headers?: any,
  responseType?: XMLHttpRequestResponseType
  timeout?: number
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

export interface AxiosError extends Error {
  isAxiosError: boolean
  config: AxiosRequestConfig
  code?: string | null
  request?: any
  response?: AxiosResponse
}

export interface Axios {
  request(config: AxiosRequestConfig): AxiosPromise
  get(url: string, config?: AxiosRequestConfig): AxiosPromise
  delete(url: string, config?: AxiosRequestConfig): AxiosPromise
  head(url: string, config?: AxiosRequestConfig): AxiosPromise
  options(url: string, config?: AxiosRequestConfig): AxiosPromise
  post(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise
  put(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise
  patch(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise
}

// Axios 混合接口，包含父级类的所有属性/方法
// 函数重载 支持两种参数
export interface AxiosInstance extends Axios {
  (config: AxiosRequestConfig): AxiosPromise
  (url: string, config: AxiosRequestConfig): AxiosPromise
}
