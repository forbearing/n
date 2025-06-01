import { TablePaginationConfig } from 'antd'

export const SESSION_ID = 'session_id'
export const NAME = 'name'
export const USER_ROOT = 'user_root'
export const TOKEN = 'token'
export const ID = 'id'
export const FUZZY_SEARCH_HEIGHT = 32
export const MAGIC_HEIGHT = 150

export const defaultPaginationConfig: TablePaginationConfig = {
  current: 1,
  pageSize: 20,
  showSizeChanger: true,
  showQuickJumper: true,
  hideOnSinglePage: false,
  pageSizeOptions: [10, 20, 50, 100],
  total: 0,
}
