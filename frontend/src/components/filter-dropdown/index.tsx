import { Button, Checkbox, Input, Space } from 'antd'
import _, { parseInt } from 'lodash'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import './index.scss'
import { FilterDropdownItem } from '@/types/interfaces'
import { StoreType } from '@/store'

export const FilterDropdown: React.FC<{
  items: FilterDropdownItem[] | undefined // 下拉筛选内容
  tags?: string[] // 当前筛选选中了哪些,当父组件点击了重置按钮后, filterTags 就会被清空, 此时我们需要将 filterTagsTemp 也清空
  onFilter?: (tags: string[]) => void // 筛选按钮的回到函数
  onReset?: () => void // 重置按钮的回调函数
  showSearch?: boolean
  searchText?: string
  // searchWidth?: number
}> = ({
  items: filterDropdownItems,
  onFilter,
  onReset,
  tags: filterTags,
  showSearch = false,
  searchText = '请搜索',
  // searchWidth = 150
}) => {
  const [dataSource, setDataSource] = useState(_.sortBy(filterDropdownItems, (item) => item))
  const { height } = useSelector((state: StoreType) => state.layout.window)
  const [filterTagsTemp, setFilterTagsTemp] = useState<string[]>([])
  const [maxHeight, setMaxHeight] = useState(300)
  const searchHeight = showSearch ? 40 : 0 // 如果启用了搜索,则设置为40.
  const [searchValue, setSearchValue] = useState('')

  const debouncedSearchValue = _.debounce(
    (value) => {
      // message.info(value)
      setSearchValue(value)
      if (filterDropdownItems) {
        setDataSource(filterDropdownItems?.filter((item) => item.text.toLowerCase().includes(value.toLowerCase())))
      }
    },
    500,
    // { leading: true, trailing: false, maxWait: 1000 }
  )
  useEffect(() => {
    const antTableBodyElement = document.querySelector('.ant-table-body')
    if (antTableBodyElement) {
      const heightStr = window.getComputedStyle(antTableBodyElement).height
      setMaxHeight(parseInt(heightStr))
      // console.log('================= maxHeight: ', heightStr)
      // console.log(window.getComputedStyle(antTableBodyElement).height)
      // console.log(window.getComputedStyle(antTableBodyElement).maxHeight)
    }
  }, [height]) // 如果页面高度发生变化则更改下拉筛选的 max-height 值

  useEffect(() => {
    // 当父组件重置过滤时, 清空 filterTagsTemp 数组
    if (filterTags) {
      if (filterTags.length == 0) {
        if (filterTagsTemp.length > 0) {
          setFilterTagsTemp([])
          setSearchValue('')
        }
      } else {
        setFilterTagsTemp(filterTags)
      }
    }
  }, [filterTags])

  // 如果 filterDropdownItems 变化后,重新设置 dataSource
  useEffect(() => {
    setDataSource(_.sortBy(filterDropdownItems, (item) => item))
  }, [filterDropdownItems])

  if (!filterDropdownItems) return <></>
  if (filterDropdownItems.length === 0) return <></>

  return (
    <>
      <div style={{ padding: 8 }}>
        <div style={{ marginBottom: 10 }}>
          <Space direction="vertical">
            <Checkbox.Group
              onChange={(selectedValues) => {
                setFilterTagsTemp(selectedValues as string[])
              }}
              style={{ display: 'block' }}
              value={filterTagsTemp}
              name="filterTags"
            >
              <Space
                direction={'vertical'}
                size="small"
                // 当搜索框中搜索某一个单一的ID时,此时只有一行数据, 表格的 height 为 47px, 这时候就太小了
                // 在这里确保最小高度为120px
                // style={{ overflow: 'scroll', maxHeight: maxHeight > 120 ? maxHeight : 120 }}
              >
                {showSearch && (
                  <Input.Search
                    enterButton
                    size="small"
                    // value={searchValue}
                    onChange={(e) => {
                      // setSearchValue(e.target.value)
                      debouncedSearchValue(e.target.value)
                    }}
                    // onChange={e => {
                    //     clearTimeout(inputId)
                    //     inputId = setTimeout(() => {
                    //         setDataSource(
                    //             filterDropdownItems?.filter(item =>
                    //                 item.text.toLowerCase().includes(e.target.value.toLowerCase())
                    //             )
                    //         )
                    //     }, timeout)
                    // }}
                    placeholder={searchText}
                    allowClear
                    onSearch={(value) => {
                      setDataSource(
                        filterDropdownItems?.filter((item) => item.text.toLowerCase().includes(value.toLowerCase())),
                      )
                    }}
                    // style={{ width: searchWidth }}
                    // style={{ width: '100%', minWidth: 150 }}
                  />
                )}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    columnGap: 8,
                    rowGap: 8,
                    minWidth: 150,
                    overflow: 'scroll',
                    // 当搜索框中搜索某一个单一的ID时,此时只有一行数据, 表格的 height 为 47px, 这时候就太小了
                    // 在这里确保最小高度为120px
                    maxHeight: maxHeight > 120 ? maxHeight - searchHeight : 120,
                  }}
                >
                  {dataSource?.map((tag: FilterDropdownItem) => (
                    <Checkbox key={tag.value} value={tag.value} className="asset-platform-checkbox">
                      {tag.text}
                    </Checkbox>
                  ))}
                </div>
              </Space>
              {/* <div */}
              {/*     style={{ */}
              {/*         display: 'flex', */}
              {/*         justifyContent: 'center', */}
              {/*         flexDirection: 'column', */}
              {/*         overflow: 'scroll', */}
              {/*         maxHeight: 300 */}
              {/*     }} */}
              {/* > */}
              {/*     {filterDropdownItems.map((tag: FilterDropdownItem) => ( */}
              {/*         <Checkbox key={tag.value} value={tag.value}> */}
              {/*             {tag.text} */}
              {/*         </Checkbox> */}
              {/*     ))} */}
              {/* </div> */}
            </Checkbox.Group>
          </Space>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
          <Space>
            <Button
              size="small"
              // disabled={filterTagsTemp.length === 0}
              onClick={() => {
                // setFilterTagsTemp([...filterTags])
                // setVisible(false)
                // setFilterTags([])
                setFilterTagsTemp([])
                setSearchValue('')
                setDataSource(filterDropdownItems)
                onReset?.()
              }}
              style={{ fontSize: '0.9em', fontWeight: 'bolder' }}
            >
              重置
            </Button>
            <Button
              size="small"
              onClick={() => {
                if (filterTagsTemp.length > 0) {
                  // 如果选中过,则全不选
                  setFilterTagsTemp([])
                } else {
                  // 如果没选中过就全选
                  const temps: string[] = []
                  filterDropdownItems.map((item) => temps.push(item.value))
                  setFilterTagsTemp(temps)
                }
              }}
              style={{ fontSize: '0.9em', fontWeight: 'bolder' }}
            >
              {/* {filterTagsTemp.length === 0 ? '全选' : '全不选'} */}
              全选
            </Button>
          </Space>
          <Button
            type="primary"
            size="small"
            onClick={() => {
              // setVisible(false)
              // setFilterTags([...filterTagsTemp])
              onFilter?.(filterTagsTemp)
            }}
            style={{ fontSize: '0.9em', fontWeight: 'bolder' }}
          >
            筛选
          </Button>
        </div>
      </div>
    </>
  )
}
