import { LIST, ListResponse, UPDATE_PARTIAL } from '@/api'
import { CustomDivider } from '@/components/custom-divider'
import { PaginationWrapper } from '@/components/pagination-wrapper'
import { InputReset, InputSearch } from '@/components/table/buttons'
import { handleBulkDelete, handleCreate, handleDelete, handleUpdate } from '@/components/table/handlers'
import {
  fetchTableColumnsData as _fetchTableColumnsData,
  handleFixedChanged,
  handleResetTableSelector,
  handleSequenceChanged,
  handleVisiableChanged,
} from '@/components/table/table-selector'
import { buildTableColumn } from '@/components/table/tables'
import { ToolsHeader } from '@/components/tools-header'
import { StoreType } from '@/store'
import { API_CMDB_MACHINE, API_COLUMN_MACHINE, API_SETTING_PROJECT, API_SETTING_VENDOR } from '@/types/api'
import { defaultPaginationConfig, FUZZY_SEARCH_HEIGHT, MAGIC_HEIGHT } from '@/types/const'
import { FilterDropdownItem, Machine, Project, Sort, TableColumn, Vendor } from '@/types/interfaces'
import { columnByKey, combineSearch } from '@/utils/utils'
import { EditableProTable, ProColumns } from '@ant-design/pro-components'
import { Badge, Button, message, Space, TablePaginationConfig } from 'antd'
import { SorterResult } from 'antd/es/table/interface'
import _ from 'lodash'
import React, { useEffect, useRef, useState } from 'react'
import { AiOutlineDelete } from 'react-icons/ai'
import { CiEdit } from 'react-icons/ci'
import { useSelector } from 'react-redux'
import { MachineForm } from './form'
import { XLSImporter } from '@/components/xls-importer'

export default function App() {
  // 需要保存的状态
  const [pagination, setPagination] = useState<TablePaginationConfig>(defaultPaginationConfig)
  const [dataSource, setDataSource] = useState<Machine[]>([])
  const [columnData, setColumnData] = useState<TableColumn[]>([])
  const [searchValue, setSearchValue] = useState('')
  const [sorts, setSorts] = useState<Sort[]>([])
  const [openCreate, setOpenCreate] = useState(false)
  const [openUpdate, setOpenUpdate] = useState(false)
  const [editableKeys, setEditableKeys] = useState<React.Key[]>([])
  const [selectedIds, setSelectedIds] = useState<React.Key[]>([])
  const [selectedMachines, setSelectedMachines] = useState<Machine[]>([])
  const [currentMachine, setCurrentMachine] = useState<Machine>()

  // 不需要保存的状态
  const [projects, setProjects] = useState<Project[]>([])
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [columnQuery, setColumnQuery] = useState(new Map<string, string[]>())
  const [hostnameOpen, setHostnameOpen] = useState(false)
  const [ipaddressOpen, setIpaddressOpen] = useState(false)
  const [emailOpen, setEmailOpen] = useState(false)
  const [ownerOpen, setOwnerOpen] = useState(false)
  const [cpuOpen, setCpuOpen] = useState(false)
  const [memoryOpen, setMemoryOpen] = useState(false)
  const [storageOpen, setStorageOpen] = useState(false)
  const [networkOpen, setNetworkOpen] = useState(false)
  const [projectNameOpen, setProjectNameOpen] = useState(false)
  const [vendorNameOpen, setVendorNameOpen] = useState(false)
  const [hostnameTags, setHostnameTags] = useState<string[]>([])
  const [ipaddressTags, setIpaddressTags] = useState<string[]>([])
  const [emailTags, setEmailTags] = useState<string[]>([])
  const [ownerTags, setOwnerTags] = useState<string[]>([])
  const [cpuTags, setCpuTags] = useState<string[]>([])
  const [memoryTags, setMemoryTags] = useState<string[]>([])
  const [storageTags, setStorageTags] = useState<string[]>([])
  const [networkTags, setNetworkTags] = useState<string[]>([])
  const [projectNameTags, setProjectNameTags] = useState<string[]>([])
  const [vendorNameTags, setVendorNameTags] = useState<string[]>([])

  // 非状态
  const refreshRef = useRef<HTMLElement>(null)
  const [filterDropdownMap, setFilterDropdownMap] = useState(new Map<string, FilterDropdownItem[]>())
  const colHostname = columnByKey(columnData, 'hostname')
  const colIpAddress = columnByKey(columnData, 'ip_address')
  const colEmail = columnByKey(columnData, 'email')
  const colOwner = columnByKey(columnData, 'owner')
  const colCpu = columnByKey(columnData, 'cpu')
  const colMemory = columnByKey(columnData, 'memory')
  const colStorage = columnByKey(columnData, 'storage')
  const colNetwork = columnByKey(columnData, 'network')
  const colCost = columnByKey(columnData, 'cost')
  const colProjectName = columnByKey(columnData, 'project_name')
  const colVendorName = columnByKey(columnData, 'vendor_name')
  const colRemark = columnByKey(columnData, 'remark')
  const colOperation = columnByKey(columnData, 'operation')

  const {
    window: { height },
    header,
    footer,
  } = useSelector((store: StoreType) => store.layout)

  // console.log('height: ', height - header.height - footer.height - FUZZY_SEARCH_HEIGHT)

  // 搜索
  const handleSearch = (value: string) => {
    setSearchValue(value)
    fetchData({ searchValue: value })
  }
  // 重置
  const handleReset = () => {
    setSearchValue('')
    setSorts([])
    setColumnQuery(new Map<string, string[]>())
    setPagination({ ...pagination, current: 1 })
    setHostnameTags([])
    setIpaddressTags([])
    setEmailTags([])
    setOwnerTags([])
    setCpuTags([])
    setMemoryTags([])
    setStorageTags([])
    setNetworkTags([])
    setProjectNameTags([])
    setVendorNameTags([])
  }
  // 刷新
  const handleRefresh = () => {
    if (!refreshRef.current) {
      console.warn('not found refresh icon')
      return
    }
    refreshRef.current.style.animation = 'rotate360 linear 0.5s infinite'
    setTimeout(() => {
      if (!refreshRef.current) {
        return
      }
      refreshRef.current.style.animation = ''
    }, 1000)
    fetchData()
  }

  const handleTableChange = (_: any, __: any, sorter: SorterResult<Machine>) => {
    // message.info(sorter.columnKey as string)
    // message.info(sorter.order as any)
    // console.log('-------------------------- ', sorter)
    const _sorts = sorts.filter((item) => item.column !== sorter.columnKey)
    console.log('-------- sorter.order: ', sorter.order)
    switch (sorter.order) {
      case 'ascend':
        _sorts.push({ column: sorter.columnKey as string, order: 'asc' })
        console.log('-------------- _sorts asc: ', _sorts)
        setSorts(_sorts)
        // setSorts([{ column: sorter.columnKey as string, order: 'asc' }])
        break
      case 'descend':
        _sorts.push({ column: sorter.columnKey as string, order: 'desc' })
        console.log('-------------- _sorts desc: ', _sorts)
        setSorts(_sorts)
        // setSorts([{ column: sorter.columnKey as string, order: 'desc' }])
        break
      default:
        setSorts(_sorts) // 默认使用 created_at 字段倒排序
    }
  }
  const handleTableChange2 = (current: number, pageSize: number) => {
    fetchData({ pagination: { ...pagination, current: current, pageSize: pageSize }, searchValue: searchValue })
  }

  // const fetchTableColumnsData = () => {
  //   if (columnData.length > 0) return
  //   LIST({
  //     api: API_TABLE_COLUMN,
  //     onSuccess: (data: ListResponse<TableColumn>) => {
  //       setColumnData(data.items)
  //     },
  //     options: {
  //       params: {
  //         user_id: Cookies.get(ID),
  //         table_name: 'machines',
  //         _sortby: 'sequence',
  //       },
  //       config: { showLoading: true },
  //     },
  //   })
  // }

  const fetchTableColumnsData = () => {
    _fetchTableColumnsData({
      tableName: 'machines',
      setColumnData: setColumnData,
    })
  }

  const fetchData = (props?: { pagination?: TablePaginationConfig; searchValue?: string }) => {
    if (!props) props = { pagination, searchValue }

    let _pagination: TablePaginationConfig = pagination
    let _searchValue: string = ''
    if (props.pagination) _pagination = props.pagination
    if (props.searchValue) _searchValue = props.searchValue

    let fuzzy: boolean = false
    if (_searchValue.length) fuzzy = true

    LIST({
      api: API_CMDB_MACHINE,
      onSuccess: (data: ListResponse<Machine>) => {
        setDataSource(data.items)
        setPagination({ ..._pagination, total: data.total })
      },
      options: {
        params: {
          page: _pagination.current,
          size: _pagination.pageSize,
          _fuzzy: fuzzy,
          _sortby:
            sorts.length === 0 ? 'created_at desc' : sorts.map((item) => `${item.column} ${item.order}`).join(','),

          // 以下为列筛选
          hostname: combineSearch([...hostnameTags, _searchValue]),
          ip_address: combineSearch(ipaddressTags),
          email: combineSearch(emailTags),
          owner: combineSearch(ownerTags),
          cpu: combineSearch(cpuTags),
          memory: combineSearch(memoryTags),
          storage: combineSearch(storageTags),
          network: combineSearch(networkTags),
          project_name: combineSearch(projectNameTags),
          vendor_name: combineSearch(vendorNameTags),
        },
      },
    })
    fetchTableColumnsData()
  }

  // 获取数据
  useEffect(() => {
    fetchData()
  }, [
    sorts,
    hostnameTags,
    ipaddressTags,
    emailTags,
    ownerTags,
    cpuTags,
    memoryTags,
    storageTags,
    networkTags,
    projectNameTags,
    vendorNameTags,
  ])

  // 获取列筛选项
  useEffect(() => {
    LIST({
      api: API_COLUMN_MACHINE,
      onSuccess: (data: any) => {
        const filterDropdownMap: Map<string, FilterDropdownItem[]> = new Map<string, FilterDropdownItem[]>()
        Object.keys(data).forEach((key) => {
          let value: any
          switch (key) {
            // case 'platform':
            //   value = data[key].map((item: SoftwarePurchasedPlatformType) => {
            //     const val = SoftwarePurchasedPlatformMap.get(item)
            //     return {
            //       value: item,
            //       text: (
            //         <Tag color={val?.color} bordered={val?.bordered} style={{ cursor: 'pointer' }}>
            //           {val?.text}
            //         </Tag>
            //       ),
            //     }
            //   })
            //   break
            default:
              value = data[key].map((item: string) => ({ text: item, value: item, id: item }))
              break
          }
          filterDropdownMap.set(key, value)
        })
        setFilterDropdownMap(filterDropdownMap)
      },
      options: {
        params: {
          hostname: columnQuery.get('hostname')?.join(','),
          ip_address: columnQuery.get('ip_address')?.join(','),
          email: columnQuery.get('email')?.join(','),
          owner: columnQuery.get('owner')?.join(','),
          cpu: columnQuery.get('cpu')?.join(','),
          memory: columnQuery.get('memory')?.join(','),
          storage: columnQuery.get('storage')?.join(','),
          network: columnQuery.get('network')?.join(','),
          project_id: columnQuery.get('project_id')?.join(','),
          vendor_id: columnQuery.get('vendor_id')?.join(','),
        },
      },
    })
  }, [columnQuery])

  // 获取项目、厂商
  useEffect(() => {
    LIST({
      api: API_SETTING_PROJECT,
      onSuccess: (data: ListResponse<Project>) => setProjects(data.items),
    })
    LIST({
      api: API_SETTING_VENDOR,
      onSuccess: (data: ListResponse<Vendor>) => setVendors(data.items),
    })
  }, [])

  const columns: ProColumns<Machine>[] = [
    buildTableColumn({
      column: colHostname,
      items: filterDropdownMap.get('hostname'),
      open: hostnameOpen,
      tags: hostnameTags,
      setOpen: setHostnameOpen,
      setTags: setHostnameTags,
    }),
    buildTableColumn({
      column: colIpAddress,
      render: (_, record) => record.ip_address?.join(', '),
      items: filterDropdownMap.get('ip_address'),
      open: ipaddressOpen,
      tags: ipaddressTags,
      setOpen: setIpaddressOpen,
      setTags: setIpaddressTags,
    }),
    buildTableColumn({
      column: colEmail,
      items: filterDropdownMap.get('email'),
      open: emailOpen,
      tags: emailTags,
      setOpen: setEmailOpen,
      setTags: setEmailTags,
    }),
    buildTableColumn({
      column: colOwner,
      items: filterDropdownMap.get('owner'),
      open: ownerOpen,
      tags: ownerTags,
      setOpen: setOwnerOpen,
      setTags: setOwnerTags,
    }),
    buildTableColumn({
      column: colCpu,
      items: filterDropdownMap.get('cpu'),
      open: cpuOpen,
      tags: cpuTags,
      setOpen: setCpuOpen,
      setTags: setCpuTags,
    }),
    buildTableColumn({
      column: colMemory,
      items: filterDropdownMap.get('memory'),
      open: memoryOpen,
      tags: memoryTags,
      setOpen: setMemoryOpen,
      setTags: setMemoryTags,
    }),
    buildTableColumn({
      column: colStorage,
      items: filterDropdownMap.get('storage'),
      open: storageOpen,
      tags: storageTags,
      setOpen: setStorageOpen,
      setTags: setStorageTags,
    }),
    buildTableColumn({
      column: colNetwork,
      items: filterDropdownMap.get('network'),
      open: networkOpen,
      tags: networkTags,
      setOpen: setNetworkOpen,
      setTags: setNetworkTags,
    }),
    buildTableColumn({ column: colCost }),
    buildTableColumn({
      column: colProjectName,
      render: (_, record) => record.project?.name,
      items: filterDropdownMap.get('project_name'),
      open: projectNameOpen,
      tags: projectNameTags,
      setOpen: setProjectNameOpen,
      setTags: setProjectNameTags,
    }),
    buildTableColumn({
      column: colVendorName,
      render: (_, record) => record.vendor?.name,
      items: filterDropdownMap.get('vendor_name'),
      open: vendorNameOpen,
      tags: vendorNameTags,
      setOpen: setVendorNameOpen,
      setTags: setVendorNameTags,
    }),
    buildTableColumn({
      column: colRemark,
    }),
    buildTableColumn({
      column: colOperation,
      render: (_, record) => (
        <Space>
          <Button
            color="primary"
            variant="filled"
            size="small"
            icon={<CiEdit />}
            onClick={() => {
              setCurrentMachine(record)
              setOpenUpdate(true)
            }}
          >
            编辑
          </Button>
          <Button
            color="danger"
            variant="filled"
            size="small"
            icon={<AiOutlineDelete />}
            onClick={() =>
              handleDelete({
                api: API_CMDB_MACHINE,
                record: record,
                onSuccess: () => fetchData(),
              })
            }
          >
            删除
          </Button>
        </Space>
      ),
    }),
  ]

  return (
    <>
      <div className="flex items-center justify-between">
        {selectedIds.length == 0 ? (
          <Space>
            <InputSearch
              value={searchValue}
              setValue={setSearchValue}
              onSearch={handleSearch}
              placeholder="搜索机器名称"
            />
            <InputReset onReset={handleReset} text="重置搜索" />
          </Space>
        ) : (
          <Space>
            <Button color="primary" variant="outlined">
              批量修改
            </Button>
            <Button color="primary" variant="outlined">
              导出选中
            </Button>
            <Button
              color="danger"
              variant="outlined"
              onClick={() =>
                handleBulkDelete({
                  api: API_CMDB_MACHINE,
                  ids: selectedIds as string[],
                  onSuccess: () => {
                    setSelectedIds([])
                    fetchData()
                  },
                  onFailure: () => {
                    setSelectedIds([])
                  },
                })
              }
            >
              批量删除
            </Button>
            <Badge count={selectedIds.length} size="small">
              <Button
                type="text"
                size="small"
                onClick={() => {
                  setSelectedIds([])
                  setSelectedMachines([])
                }}
                className="ml-2"
              >
                取消选中
              </Button>
            </Badge>
          </Space>
        )}
        <Space>
          <Space className="mr-6">
            <Button type="primary" onClick={() => setOpenCreate(true)}>
              新增机器
            </Button>
            <Button color="primary" variant="outlined">
              导出全部
            </Button>
            <Button color="primary" variant="outlined">
              导出搜索
            </Button>
          </Space>
          <ToolsHeader
            refreshRef={refreshRef}
            handleRefresh={handleRefresh}
            columnSelectable
            columnsData={columnData}
            onVisiableChanged={(columns: TableColumn[]) =>
              handleVisiableChanged({ columns, onSuccess: fetchTableColumnsData })
            }
            onSequenceChanged={(columns: TableColumn[]) =>
              handleSequenceChanged({ columns, onSuccess: fetchTableColumnsData })
            }
            onFixedChanged={(columns: TableColumn[]) =>
              handleFixedChanged({ columns, onSuccess: fetchTableColumnsData })
            }
            onColumnsReset={() => handleResetTableSelector({ tableName: 'machines', onSuccess: fetchTableColumnsData })}
          />
          <XLSImporter uploadUrl="http://localhost:8080/api/cmdb/machine/import" onSuccess={() => fetchData()} />
        </Space>
      </div>
      <CustomDivider />
      {columns.filter((item) => {
        // @ts-ignore
        return item.visiable
      }).length > 0 && (
        <EditableProTable
          dataSource={dataSource}
          value={dataSource}
          size="small"
          columns={_.sortBy(
            // @ts-ignore
            columns.filter((item) => item.visiable),
            // @ts-ignore
            (item) => item.sequence,
          )}
          rowKey="id"
          onTableChange={handleTableChange as any}
          recordCreatorProps={false}
          scroll={{ y: height - header.height - footer.height - FUZZY_SEARCH_HEIGHT - MAGIC_HEIGHT }}
          tableAlertRender={false}
          rowSelection={{
            type: 'checkbox',
            selectedRowKeys: selectedIds,
            onChange: (selectedRowKeys: React.Key[]) => {
              setSelectedIds(selectedRowKeys)
              setSelectedMachines([])
            },
          }}
          editable={{
            type: 'multiple',
            editableKeys: editableKeys,
            onChange: setEditableKeys,
            onSave: async (_, data: Machine) => {
              UPDATE_PARTIAL({
                api: API_CMDB_MACHINE,
                onSuccess: () => {
                  message.success('更新成功')
                  fetchData()
                },
                onFailure: () => {
                  message.error('更新失败')
                },
                options: { data: data },
              })
            },
          }}
        />
      )}
      <PaginationWrapper pagination={pagination} onChange={handleTableChange2} />
      <MachineForm
        action="create"
        open={openCreate}
        onOk={() => setOpenCreate(false)}
        onCancel={() => setOpenCreate(false)}
        projects={projects}
        vendors={vendors}
        onFinish={(record) =>
          handleCreate({
            api: API_CMDB_MACHINE,
            record: record,
            onSuccess: () => {
              fetchData()
              setOpenCreate(false)
            },
            successText: '创建成功',
          })
        }
      />
      {currentMachine && (
        <MachineForm
          action="update"
          open={openUpdate}
          machine={currentMachine}
          projects={projects}
          vendors={vendors}
          onOk={() => {
            setOpenUpdate(false)
            setTimeout(() => {
              setCurrentMachine(undefined)
            }, 300)
          }}
          onCancel={() => {
            setOpenUpdate(false)
            setTimeout(() => {
              setCurrentMachine(undefined)
            }, 300)
          }}
          onFinish={(record) =>
            handleUpdate({
              api: API_CMDB_MACHINE,
              record: record,
              onSuccess: () => {
                fetchData()
                setOpenUpdate(false)
                setTimeout(() => {
                  setCurrentMachine(undefined)
                }, 300)
              },
            })
          }
        />
      )}
    </>
  )
}
