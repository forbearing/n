// const baseURL = 'http://localhost:9000'
// const baseURL = import.meta.env.VITE_BASE_URL

type MODE = 'dev' | 'stg' | 'prod'

let mode: MODE = 'dev'
switch (import.meta.env.MODE) {
  case 'development':
    mode = 'dev'
    break
  case 'staging':
    mode = 'stg'
    break
  case 'production':
    mode = 'prod'
    break
}

// const env = {
//     dev: {
//         baseApi: '/api',
//         baseUrl: 'http://localhost:9000',
//         uploadApi: 'http://localhost:9000/api/upload',
//         cdn: 'http://xxx.cdn.aliyun.com',
//         mock: true,
//         mockApi: 'https://www.fastmock.site/mock/5841b82d5672783b6fd62bb2a06aeblf/api'
//     },
//     stg: {
//         baseApi: '/api',
//         baseUrl: 'http://myapp-stg.example.com',
//         uploadApi: 'http://myapp-stg.example.com/api/upload',
//         cdn: 'http://xxx.cdn.aliyun.com',
//         mock: false,
//         mockApi: 'https://www.fastmock.site/mock/5841b82d5672783b6fd62bb2a06aeblf/api'
//     },
//     prod: {
//         baseApi: '/api',
//         baseUrl: 'http://myapp.example.com',
//         uploadApi: 'http://myapp.example.com/api/upload',
//         cdn: 'http://xxx.cdn.aliyun.com',
//         mock: false,
//         mockApi: 'https://www.fastmock.site/mock/5841b82d5672783b6fd62bb2a06aeblf/api'
//     }
// }
//
// export default { mode, ...env[mode] }

export default {
  mode: mode,
  ...{
    baseApi: import.meta.env.VITE_BASE_API,
    // baseUrl: import.meta.env.VITE_BASE_URL,
    baseUrl: mode === 'dev' ? import.meta.env.VITE_BASE_URL : location.origin,
    cdn: import.meta.env.VITE_CDN,
    mock: import.meta.env.VITE_MOCK,
    mockApi: import.meta.env.VITE_MOCK_API,
    uploadApi: import.meta.env.VITE_UPLOAD_API,
  },
}
