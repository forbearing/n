import { LIST, ListResponse } from '@/api'
import { FilterDropdown } from '@/components/filter-dropdown'
import { TableColumn, FilterDropdownItem, Sort } from '@/types/interfaces'
import { ProColumns } from '@ant-design/pro-components'
import { TablePaginationConfig } from 'antd'
import { fetchTableColumnsData } from './table-selector'

export function fetchData<T>(props: {
  api: string
  pagination: TablePaginationConfig
  searchValue: string
  setDataSource: (data: T[]) => void
  setPagination: (pagination: TablePaginationConfig) => void
  fetchTableColumnsData?: () => void
  sorts: Sort[]
}) {
  const { pagination, searchValue, setDataSource, setPagination, sorts, fetchTableColumnsData } = props

  let fuzzy: boolean = false
  if (searchValue.length > 0) fuzzy = true

  LIST({
    api: props.api,
    onSuccess: (data: ListResponse<T>) => {
      setDataSource(data.items)
      setPagination({ ...pagination, total: data.total })
    },
    options: {
      params: {
        page: pagination.current,
        size: pagination.pageSize,
        _fuzzy: fuzzy,
        _sortby: sorts.length === 0 ? 'created_at desc' : sorts.map((item) => `${item.column} ${item.order}`).join(','),

        // // 以下为列筛选
        // name: combineSearch([...nameTags, _searchValue]),
        // version: combineSearch(versionTags),
        // platform: combineSearch(platformTags),
        // purchase_user: combineSearch(puserTags),
        // purchase_method: combineSearch(pmethodTags),
        // purchase_date: combineSearch(pdateTags),
        // expire_date: combineSearch(edateTags),
        // license_type: combineSearch(licenseTypeTags),
        // license_quality: combineSearch(licenseQttyTags),
        // vendor: combineSearch(vendorTags),
        // const: combineSearch(costTags),
      },
    },
  })
  fetchTableColumnsData?.()
}

type props<T> = {
  column: TableColumn
  ellipsis?: boolean
  sorter?: boolean
  editable?: boolean
  copyable?: boolean
  render?: (value: any, record: T, index: number) => React.ReactNode

  items?: FilterDropdownItem[]
  open?: boolean
  tags?: string[]
  setOpen?: (open: boolean) => void
  setTags?: (tags: string[]) => void
}

export function buildTableColumn<T>(props: props<T>): ProColumns<T> & {
  sequence: number
  visiable: boolean
} {
  const {
    column: col,
    ellipsis = true,
    sorter,
    editable = false,
    copyable = false,
    render,
    items = [],
    open,
    setOpen,
    tags = [],
    setTags,
  } = props
  return {
    key: col.key,
    dataIndex: col.key,
    title: col.name,
    width: col.width,
    fixed: col.fixed as any,
    sequence: col.sequence,
    visiable: col.visiable,
    copyable: copyable,
    ellipsis: ellipsis,
    editable: () => editable,
    sorter: sorter,
    render: render,

    filtered: tags?.length > 0,
    // filterDropdownOpen: open,
    // onFilterDropdownOpenChange: () => setOpen?.(!open),
    filterDropdownProps: {
      open: open,
      onOpenChange: () => setOpen?.(!open),
    },
    filterDropdown: items.length > 0 && (
      <FilterDropdown
        items={items}
        tags={tags}
        onReset={() => {
          setOpen?.(false)
          setTags?.([])
        }}
        onFilter={(tags) => {
          setOpen?.(false)
          setTags?.(tags)
        }}
      />
    ),
  }
}
