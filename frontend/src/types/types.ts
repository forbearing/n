export type Action = 'create' | 'update'

export type AppEnvType = 'prod' | 'stg' | 'pre' | 'test' | 'dev'
export const AppEnvMap = new Map<
  AppEnvType,
  { color: string; text: string; bordered?: boolean; icon?: any; onClick?: any }
>()
AppEnvMap.set('prod', {
  color: 'green',
  text: '生产环境(prod)',
  bordered: true,
})
AppEnvMap.set('stg', {
  color: 'blue',
  text: '仿真环境(stg)',
  bordered: true,
})
AppEnvMap.set('pre', {
  color: 'cyan',
  text: '预发环境(pre)',
  bordered: true,
})
AppEnvMap.set('test', {
  color: 'orange',
  text: '测试环境(test)',
  bordered: true,
})
AppEnvMap.set('dev', {
  color: 'gray',
  text: '开发环境(dev)',
  bordered: true,
})
