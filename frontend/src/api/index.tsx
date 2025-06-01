import { AxiosResponse } from 'axios'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import { PAGE_LOGIN } from '@/types/page'
import { TOKEN } from '@/types/const'
import request from '@/utils/request'
dayjs.extend(duration)

// 分页触发方式
// 1.进入页面,默认初始化列表
// 2.点击搜索,初始化列表
// 3.点击重置,初始化列表
// 4.点击页码,更新列表
// 5.点击每页条数,更新列表

// CREATE,UPDATE 会使用 data 字段, data 是 http body 的 payload
// LIST 会使用 params 字段, params 字段是 url query parameter
interface Options<T> {
  data?: T
  params?: T | Pagination
  config?: Config
}

// Config 是传入 Axios 中的配置.
interface Config {
  // showLoading 是否展示loading状态, 目前的 loading 为一个 Spin 组件和毛玻璃效果.
  // 前端如果需要周期刷新页面,一般需要将 showLoading 设置为 false, 默认为ture.
  // 30s以内的请求不展示 loading
  // 超过30s的请求会自动展示 loading
  showLoading?: boolean
  // showError 是否展示错误提示,保留使用
  showError?: boolean
  // reload: 401 未认证是否重定向到首页
  reload?: boolean
}

// Pagination 为分页参数,用来传递给后端进行进行分页
interface Pagination {
  page?: number // 第几页,从1开始算
  size?: number // 每页多少条
}

interface Props<T> {
  // api 为请求的后端接口, 例如 https://asset.cowarobot.com/api/asset/asset
  api: string
  // onSuccess: 后端处理成功后的回调函数
  onSuccess?: Function
  // onFailure: 后端处理失败后的回调函数
  onFailure?: Function
  // onError: axios 报错后的回调函数,如果后端挂了没有响应就会调用 onError.
  onError?: Function
  // onFinished: 后端处理完成后的回调函数,成功或失败都可以调用这个函数
  onFinished?: Function
  // options 包含了 `Config: 传递给axios的配置` `Pagination: 传递给后弹的分页参数` `data: 传递给后端的数据`
  options?: Options<T>
}

// ListResponse 为后端返回的数据, list 的结果.
export interface ListResponse<T> {
  items: T[] // items: 后端返回的数据.
  total: number // total 一共包含了多少条数据.
}

// interface Pagination {
//     page?: number
//     size?: number
// }

// export const defaultOptions: Options = { showLoading: true, showError: true }

// CREATE is a general function to send reqest to create resource in backend.
export function CREATE<T>({ api, onSuccess, onFailure, onError, onFinished, options }: Props<T>): void {
  const begin = new Date().getTime()
  const { data, params, config } = initOptions(options)
  const reload = config?.reload
  request
    .post(api, data, { params, ...(config as any) })
    .then((res) => {
      handleSuccess({ api, res, onSuccess, begin })
    })
    .catch((err) => {
      handleFailure({ api, err, onFailure, onError, begin, reload })
    })
    .finally(() => onFinished && onFinished())
}

// DELETE is a general function to send request to delete resource in backend.
export function DELETE<T>({ api, onSuccess, onFailure, onError, onFinished, options }: Props<T>): void {
  const begin = new Date().getTime()
  const { data, params, config } = initOptions(options)
  const reload = config?.reload
  request
    // .delete(api + `?id=${id}`, { ...(config as any) })
    .delete(api, { data, params, ...(config as any) })
    .then((res) => {
      handleSuccess({ api, res, onSuccess, begin })
    })
    .catch((err) => {
      handleFailure({ api, err, onFailure, onError, begin, reload })
    })
    .finally(() => onFinished && onFinished())
}
// UPDATE is a general function to send request to update resource in backend.
export function UPDATE<T>({ api, onSuccess, onFailure, onError, onFinished, options }: Props<T>): void {
  const begin = new Date().getTime()
  const { data, params, config } = initOptions(options)
  const reload = config?.reload
  request
    .put(api, data, { params, ...(config as any) })
    .then((res) => {
      handleSuccess({ api, res, onSuccess, begin })
    })
    .catch((err) => {
      handleFailure({ api, err, onFailure, onError, begin, reload })
    })
    .finally(() => onFinished && onFinished())
}
// UPDATE_PARTIAL is a general function to send request to update resource in backend.
export function UPDATE_PARTIAL<T>({ api, onSuccess, onFailure, onError, onFinished, options }: Props<T>): void {
  const begin = new Date().getTime()
  const { data, params, config } = initOptions(options)
  const reload = config?.reload
  request
    .patch(api, data, { params, ...(config as any) })
    .then((res) => {
      handleSuccess({ api, res, onSuccess, begin })
    })
    .catch((err) => {
      handleFailure({ api, err, onFailure, onError, begin, reload })
    })
    .finally(() => onFinished && onFinished())
}

// LIST is a general function to to get all resource from backend.
export function LIST<T>({ api, onSuccess, onFailure, onError, onFinished, options }: Props<T>): void {
  const begin = new Date().getTime()
  const { params, config } = initOptions(options)
  const reload = config?.reload
  request
    // 注意: 如果 params 展开 { ...params } 则无法在 url 中加入 query parameters.
    // 则导致在请求后端数据的时,无法进行查询
    .get(api, { params, ...config })
    .then((res) => {
      handleSuccess({ api, res, onSuccess, begin })
    })
    .catch((err) => {
      handleFailure({ api, err, onFailure, onError, begin, reload })
    })
    .finally(() => onFinished && onFinished())
}

// GET is a general function to get one resource from backend.
export function GET<T>({ api, onSuccess, onFailure, onError, onFinished, options }: Props<T>): void {
  const begin = new Date().getTime()
  const { params, config } = initOptions(options)
  const reload = config?.reload
  request
    // .get(`${api}/${id}`, { ...(config as any) })
    .get(api, { params, ...(config as any) })
    .then((res) => {
      handleSuccess({ api, res, onSuccess, begin })
    })
    .catch((err) => {
      handleFailure({ api, err, onFailure, onError, begin, reload })
    })
    .finally(() => onFinished && onFinished())
}

function handleSuccess({
  api,
  res,
  onSuccess,
  begin,
}: {
  api: string
  res: AxiosResponse<any, any>
  onSuccess?: Function
  begin: number
}) {
  const cost = dayjs.duration(new Date().getTime() - begin).asMilliseconds() + 'ms'
  switch (res.status) {
    case 200:
      console.log(`[${res.status} | ${cost} | ${api}] `, res.data.data)
      if (onSuccess) {
        onSuccess(res.data.data, res.status)
      }
      break
    default:
      console.warn(`[${res.status} | ${cost} | ${api}]: `, res)
  }
}

function handleFailure({
  api,
  err,
  onFailure,
  onError,
  begin,
  reload,
}: {
  api: string
  err: any
  onFailure?: Function
  onError?: Function
  begin: number
  reload?: boolean
}) {
  const cost = dayjs(new Date().getTime() - begin).millisecond() + 'ms'
  if (err.response) {
    switch (err.response.status) {
      case 401:
        console.error(`[${err.response.status} | ${cost} | ${api}]: `, err.response)
        // message.error('未登录')
        sessionStorage.removeItem(TOKEN)
        switch (window.location.pathname) {
          case '/': // 如果是根路径,不要加 redirect
            if (reload === true) {
              location.href = `${PAGE_LOGIN}`
            } else {
              onFailure?.(err, err.response.status)
            }
            return
          case PAGE_LOGIN: // 如果本来就是 login 页面, 不要加 redirect
            if (reload === true) {
              location.href = `${PAGE_LOGIN}`
            } else {
              onFailure?.(err, err.response.status)
            }
            return
          default:
            if (reload == true) {
              location.href = `${PAGE_LOGIN}?redirect=${window.location.pathname}`
            } else {
              onFailure?.(err, err.response.status)
            }
            return
        }
        break
      case 403: // 后端使用了权限系统, 例如 casbin
        console.error(`[${err.response.status} | ${cost} | ${api}]: `, err.response)
        // message.error('没有权限')
        break
      case 404:
        console.error(`[${err.response.status} | ${cost} | ${api}]: `, err.response)
        // message.error('找不到页面')
        break
      case 500:
        console.error(`[${err.response.status} | ${cost} |${api}]: `, err.response)
        // message.error('服务器错误')
        break
      default:
        console.error(`[${err.response.status} | ${cost} | ${api}]: `, err.response)
        // message.error('请求错误')
        break
    }
  } else {
    console.error(`[${api}]: `, err)
    // 服务端可能挂了, 没有 err.response 了
    // 此时没有 err.response.status 属性
    onError?.(err)
    return
  }
  if (onFailure) {
    onFailure(err, err.response.status)
  }
}

function initOptions<Params>(options?: Options<Params>): Options<Params> {
  let params: any = {}
  let config: Config = {}
  if (options) {
    params = options.params
    if (options.config) {
      config = options.config
      if (config.reload === undefined) {
        config.reload = true
      }
      if (config.showLoading === undefined) {
        config.showLoading = true
      }
      if (config.showError === undefined) {
        config.showError = true
      }
    } else {
      config = { showLoading: true, showError: true, reload: true }
    }
  } else {
    config = { showLoading: true, showError: true, reload: true }
  }

  return { data: options?.data, params: params, config: config }
}
