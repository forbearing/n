import { Pagination, TablePaginationConfig } from 'antd'

export const PaginationWrapper: React.FC<{
  pagination: TablePaginationConfig
  onChange: (page: number, pageSize: number) => void
}> = ({ pagination, onChange }) => {
  let begin = ((pagination.current as number) - 1) * (pagination.pageSize as number) + 1
  let end = (pagination.current as number) * (pagination.pageSize as number)
  if (end > (pagination.total as number)) end = pagination.total as number

  // 用户进行了搜索, 则会导致开始页大于结束页的情况
  if (pagination.total) {
    if (begin >= end && begin < pagination.total && end < pagination.total) {
      begin = 0
      onChange(1, pagination.pageSize as number)
    }
  }

  if ((pagination.total as number) <= (pagination.pageSize as number)) {
    return (
      <Pagination
        {...pagination}
        onChange={onChange}
        size="small"
        showTotal={() => `总共${pagination.total}条`}
        style={{ position: 'absolute', bottom: 15, right: 25 }}
      />
    )
  }
  return (
    <Pagination
      {...pagination}
      onChange={onChange}
      size="small"
      // showTotal={() => `共${pagination.total}条`}
      showTotal={() => `第 ${begin}-${end} 条 / 总共 ${pagination.total} 条`}
      style={{ position: 'absolute', bottom: 10, right: 25 }}
    />
  )
}
