import { CREATE, DELETE, LIST, ListResponse, UPDATE, UPDATE_PARTIAL } from '@/api'
import { base } from '@/types/interfaces'
import { Modal, message } from 'antd'

export function handleCreate<T>(props: {
  api: string
  record: T
  onSuccess?: () => void
  onFailure?: () => void
  successText?: string
  failureText?: string
}) {
  const { api, record, onSuccess, onFailure, successText = '创建成功', failureText = '创建失败' } = props
  CREATE({
    api: api,
    onSuccess: () => {
      message.success(successText)
      onSuccess?.()
    },
    onFailure: () => {
      message.error(failureText)
      onFailure?.()
    },
    options: { data: record },
  })
}

export function handleDelete<T extends base>(props: {
  api: string
  record: T
  onSuccess?: () => void
  title?: string
}) {
  const { api, record, onSuccess, title = '你确认删除吗' } = props
  Modal.confirm({
    title: title,
    onOk: () => {
      DELETE({
        api: api,
        onSuccess: () => {
          message.success('删除成功')
          onSuccess?.()
        },
        onFailure: () => message.error('删除失败'),
        options: { params: { id: record.id } },
      })
    },
  })
}

export function handleBulkDelete(props: {
  api: string
  ids: string[]
  onSuccess?: () => void
  onFailure?: () => void
  title?: string
  successText?: string
  failureText?: string
}) {
  const {
    api,
    ids,
    onSuccess,
    onFailure,
    title = '你确认删除吗',
    successText = '删除成功',
    failureText = '删除失败',
  } = props
  Modal.confirm({
    title: title,
    onOk: () =>
      DELETE({
        api: api + '/' + 'batch',
        onSuccess: () => {
          message.success(successText)
          onSuccess?.()
        },
        onError: () => {
          message.error(failureText)
          onFailure?.()
        },
        options: {
          data: {
            ids: ids,
          },
        },
      }),
  })
}

export function handleUpdate<T extends base>(props: {
  api: string
  record: T
  onSuccess?: () => void
  onFailure?: () => void
  successText?: string
  failureText?: string
}) {
  const { api, record, onSuccess, onFailure, successText = '更新成功', failureText = '更新失败' } = props
  UPDATE({
    api: api + '/' + record.id,
    onSuccess: () => {
      message.success(successText)
      onSuccess?.()
    },
    onFailure: () => {
      message.error(failureText)
      onFailure?.()
    },
    options: {
      data: record,
    },
  })
}
