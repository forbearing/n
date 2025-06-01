import { AppEnvType } from './types'

export interface base {
  id: string

  created_by?: string
  updated_by?: string
  created_at?: Date
  updated_at?: Date
  remark?: string
  order?: string
}

export interface App extends base {
  name: string // 应用名称
  code: string // 应用标识
  category_id: string // 所属分类
  category_name: string
  env: AppEnvType // 环境类型
  url: string // 应用访问地址
  role_id: string // 所属角色
  role_name: string // 所属角色
  icon?: string // 应用图标
}

export interface TableColumn extends base {
  user_id: string
  table_name: string
  name: string
  key: string
  width: number

  sequence: number
  visiable: boolean
  fixed: 'right' | 'left' | ''
}

export interface Sort {
  column: string
  order: 'desc' | 'asc' | ''
}

export interface FilterDropdownItem {
  text: string
  value: string
}

export interface Machine extends base {
  hostname?: string
  ip_address?: string[]
  email?: string
  owner?: string

  cpu?: string
  memory?: string
  storage?: string
  network?: string
  cost?: number

  deployed_apps?: string[]
  project_name?: string
  vendor_name?: string
  project?: Project
  vendor?: Vendor
}

export interface Project extends base {
  name: string
}
export interface Vendor extends base {
  name: string
}
