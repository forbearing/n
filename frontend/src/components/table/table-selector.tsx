import { LIST, ListResponse, UPDATE_PARTIAL } from '@/api'
import { API_TABLE_COLUMN } from '@/types/api'
import { ID } from '@/types/const'
import { TableColumn } from '@/types/interfaces'
import { message } from 'antd'
import Cookies from 'js-cookie'

export function fetchTableColumnsData(props: {
  tableName: string
  setColumnData: (data: TableColumn[]) => void
  sortBy?: string
}) {
  const { tableName, setColumnData, sortBy = 'sequence' } = props
  let userId = Cookies.get(ID)
  if (!userId) userId = '-'
  if (userId.length === 0) userId = '-'
  LIST({
    api: API_TABLE_COLUMN,
    onSuccess: (data: ListResponse<TableColumn>) => {
      setColumnData(data.items)
    },
    options: {
      params: {
        user_id: userId,
        table_name: tableName,
        _sortby: sortBy,
      },
      config: { showLoading: true },
    },
  })
}

// handleVisiableChanged 列选择器回调函数
export function handleVisiableChanged(props: { columns: TableColumn[]; onSuccess?: () => void }) {
  const { columns, onSuccess } = props
  for (const c of columns) {
    UPDATE_PARTIAL({
      api: API_TABLE_COLUMN,
      onSuccess: () => {
        onSuccess?.()
        if (c.visiable) {
          message.success(`显示列 "${c.name}" 成功`)
        } else {
          message.success(`隐藏列 "${c.name}" 成功`)
        }
      },
      onFailure: () => {
        if (c.visiable) {
          message.error(`显示列 "${c.name}" 失败`)
        } else {
          message.error(`隐藏列 "${c.name}" 失败`)
        }
      },
      options: {
        data: { id: c.id, visiable: c.visiable },
        config: { showLoading: false },
      },
    })
  }
}

// handleSequenceChanged 列选择器回调函数
export function handleSequenceChanged(props: { columns: TableColumn[]; onSuccess?: () => void }) {
  const { columns, onSuccess } = props

  for (const c of columns) {
    UPDATE_PARTIAL({
      api: API_TABLE_COLUMN,
      onSuccess: () => {
        message.success(`更新 "${c.name}" 顺序成功`)
        // 不要立即重新渲染,因为调整列位置可能涉及到很多个字段更新
        // onSuccess()
      },
      onFailure: () => {
        message.error(`更新 "${c.name}" 顺序失败`)
      },
      options: {
        data: { id: c.id, sequence: c.sequence },
        config: { showLoading: false },
      },
    })
  }
  setTimeout(() => onSuccess?.(), 300)
}

// handleFixedChanged 列选择器固定位置变化回调函数
export function handleFixedChanged(props: { columns: TableColumn[]; onSuccess?: () => void }) {
  const { columns, onSuccess } = props
  for (const c of columns) {
    UPDATE_PARTIAL({
      api: API_TABLE_COLUMN,
      onSuccess: () => {
        onSuccess?.()
        message.info(`更新 "${c.name}" 固定成功`)
      },
      onFailure: () => {
        message.error(`更新 "${c.name}" 固定失败`)
      },
      options: {
        data: { id: c.id, fixed: c.fixed },
      },
    })
  }
}

// handleResetColumnSelector  重置列选择器
export function handleResetTableSelector(props: { tableName: string; onSuccess?: () => void }) {
  const { tableName, onSuccess } = props
  LIST({
    api: API_TABLE_COLUMN,
    onSuccess: () => {
      message.success('重置成功')
      onSuccess?.()
    },
    onFailure: () => {
      message.error('重置失败')
    },
    options: {
      params: {
        user_id: Cookies.get(ID),
        table_name: tableName,
        reset: true, // 任意非空值即可
      },
      config: { showLoading: false },
    },
  })
}
