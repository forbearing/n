import { Button, Checkbox, Popover, Space, Tooltip, Tree, TreeProps } from 'antd'
import { DataNode } from 'antd/es/tree'
import _ from 'lodash'
import { useEffect, useState } from 'react'
import { BsLayoutThreeColumns } from 'react-icons/bs'
import { FaArrowsLeftRightToLine } from 'react-icons/fa6'
import { TbArrowBarToLeft, TbArrowBarToRight } from 'react-icons/tb'
import { useSelector } from 'react-redux'
import { StoreType } from '@/store'
import { TableColumn } from '@/types/interfaces'
import styles from './index.module.scss'
import './index.scss'

function calculateChanged(dataSource: TableColumn[], oldKeys: string[], newKeys: string[]): TableColumn[] {
  const changed: TableColumn[] = []
  const k1 = _.difference(oldKeys, newKeys)
  const k2 = _.difference(newKeys, oldKeys)
  let visiable: boolean = false
  if (newKeys.length > oldKeys.length) {
    visiable = true
  }
  // console.log('====================== changed keys', [...k1, ...k2], visiable)
  const cloned = _.cloneDeep(dataSource)
  for (const c of cloned) {
    for (const k of [...k1, ...k2]) {
      if (c.key === k) {
        c.visiable = visiable
        changed.push(c)
      }
    }
  }
  return changed
}

function fixedColumns(data: TableColumn[]): {
  dataFixedLeft: TableColumn[]
  dataFixedRight: TableColumn[]
  dataUnfixed: TableColumn[]
  dataSource: TableColumn[]
} {
  const dataSource = _.cloneDeep(data)
  const dataFixedLeft = []
  const dataFixedRight = []
  const dataUnfixed = []
  for (const c of dataSource) {
    switch (c.fixed) {
      case 'left':
        dataFixedLeft.push(c)
        break
      case 'right':
        dataFixedRight.push(c)
        break
      default:
        dataUnfixed.push(c)
    }
  }
  return {
    dataFixedLeft,
    dataFixedRight,
    dataUnfixed,
    dataSource,
  }
}

export const TableColumnSelector: React.FC<{
  columnsData: TableColumn[]
  onSequenceChanged?: (columns: TableColumn[]) => void
  onVisiableChanged?: (columns: TableColumn[]) => void
  onFixedChanged?: (columns: TableColumn[]) => void
  onReset?: () => void
}> = ({ columnsData, onSequenceChanged, onVisiableChanged, onFixedChanged, onReset }) => {
  const [dataSource, setDataSource] = useState(
    columnsData.map((item) => ({ title: item.name, key: item.key, sequence: item.sequence, fixed: item.fixed })),
  )
  const [checkedKeys, setCheckedKeys] = useState<string[]>([])

  const { height } = useSelector((state: StoreType) => state.layout.window)
  const [maxHeight, setMaxHeight] = useState(600)

  useEffect(() => {
    const antTableBodyElement = document.querySelector('.ant-table-body')
    if (antTableBodyElement) {
      // height: 158px, maxHeight: 575px
      // 这里本来是获取 height 的但是 TableColumnSelector 组件在 ToolHeader 组件中币 ant-table 早出现,
      // 导致获取到的 height 和 maxHeight 总是不相同.
      // 那么在这里先用 maxHeight 吧
      const heightStr = window.getComputedStyle(antTableBodyElement).maxHeight
      // const heightStr = window.getComputedStyle(antTableBodyElement).height
      setMaxHeight(parseInt(heightStr))
      // console.log(window.getComputedStyle(antTableBodyElement).height)
      // console.log(window.getComputedStyle(antTableBodyElement).maxHeight)
    }
  }, [height, columnsData]) // 如果页面高度发生变化则更改下拉筛选的 max-height 值
  useEffect(() => {
    setCheckedKeys(columnsData.filter((item) => item.visiable === true).map((item) => item.key))
    // 重置之后, 顺序可能会变化, 要重设 dataSource.
    setDataSource(
      columnsData.map((item) => ({ title: item.name, key: item.key, sequence: item.sequence, fixed: item.fixed })),
    )
  }, [columnsData])

  const onDragEnter: TreeProps['onDragEnter'] = (info) => {
    console.log(info)
    // expandedKeys, set it when controlled is needed
    // setExpandedKeys(info.expandedKeys)
  }

  // https://www.jianshu.com/p/231807c3b189
  // antd-design中树节点只能平级拖拽
  const onDrop: TreeProps['onDrop'] = (info) => {
    // 禁止当前节点到其他节点下, 作为其其子节点.
    if (info.dropToGap == false) {
      return
    }
    console.log(info)
    const dropKey = info.node.key // 拖拽落下的值
    const dragKey = info.dragNode.key // 被拖拽的值
    const dropPos = info.node.pos.split('-') // 拖拽落下的位置 最外层到最里层
    const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1])

    const loop = (
      data: DataNode[],
      key: React.Key,
      callback: (node: DataNode, i: number, data: DataNode[]) => void,
    ) => {
      for (let i = 0; i < data.length; i++) {
        if (data[i].key === key) {
          return callback(data[i], i, data)
        }
        if (data[i].children) {
          loop(data[i].children!, key, callback)
        }
      }
    }
    const data = [...dataSource]

    // Find dragObject
    let dragObj: DataNode
    loop(data, dragKey, (item, index, arr) => {
      arr.splice(index, 1)
      dragObj = item
    })

    if (!info.dropToGap) {
      // Drop on the content
      loop(data, dropKey, (item) => {
        item.children = item.children || []
        // where to insert. New item was inserted to the start of the array in this example, but can be anywhere
        item.children.unshift(dragObj)
      })
    } else if (
      ((info.node as any).props.children || []).length > 0 && // Has children
      (info.node as any).props.expanded && // Is expanded
      dropPosition === 1 // On the bottom gap
    ) {
      loop(data, dropKey, (item) => {
        item.children = item.children || []
        // where to insert. New item was inserted to the start of the array in this example, but can be anywhere
        item.children.unshift(dragObj)
        // in previous version, we use item.children.push(dragObj) to insert the
        // item to the tail of the children
      })
    } else {
      let ar: DataNode[] = []
      let i: number
      loop(data, dropKey, (_item, index, arr) => {
        ar = arr
        i = index
      })
      if (dropPosition === -1) {
        ar.splice(i!, 0, dragObj!)
      } else {
        ar.splice(i! + 1, 0, dragObj!)
      }
    }

    const changedKeys: { key: string; sequence: number }[] = []
    for (let i = 0; i < data.length; i++) {
      if (columnsData[i].sequence !== data[i].sequence) {
        console.log(i, columnsData[i].key, columnsData[i].sequence, data[i].key, data[i].sequence)
        changedKeys.push({ key: data[i].key, sequence: i })
      }
      data[i].sequence = i // 重新调整顺序
    }
    const changedColumns: TableColumn[] = []
    for (const c of columnsData) {
      for (const k of changedKeys) {
        if (c.key === k.key) {
          const cloned = _.cloneDeep(c)
          cloned.sequence = k.sequence
          changedColumns.push(cloned)
          break
        }
      }
    }
    // console.log('===================== changedKeys:', changedKeys)
    // console.log('==================== changed columns:', changedColumns)
    onSequenceChanged?.(changedColumns)
    setDataSource(data)
  }

  return (
    <>
      <Popover
        trigger={['click']}
        content={
          // 加一个 class "asset-platform-div" 方便让 AutoHiddenScrolling 组件找到我
          <div className="asset-platform-div" style={{ maxHeight: maxHeight, overflow: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
              <a type="text">
                <Checkbox
                  indeterminate={checkedKeys.length < columnsData.length && checkedKeys.length > 0}
                  checked={checkedKeys.length === columnsData.length}
                  onChange={(e) => {
                    switch (e.target.checked) {
                      case true:
                        onVisiableChanged?.(
                          calculateChanged(
                            columnsData,
                            checkedKeys,
                            dataSource.map((item) => item.key),
                          ),
                        )
                        setCheckedKeys(dataSource.map((item) => item.key))
                        break
                      case false:
                        onVisiableChanged?.(calculateChanged(columnsData, checkedKeys, []))
                        setCheckedKeys([])
                        break
                    }
                    console.log(e.target.checked)
                  }}
                  style={{ fontWeight: 'bolder' }}
                >
                  全选
                </Checkbox>
              </a>

              <a
                type="text"
                onClick={() => {
                  // 发送重置的请求给后端
                  onReset?.()
                }}
                style={{ color: 'rgba(0,110,249)', fontWeight: 'bolder' }}
              >
                重置
              </a>
            </div>

            {/* 固定左侧的列, 不能拖拽, 不能点选 */}
            <>
              {fixedColumns(columnsData).dataFixedLeft.length > 0 && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: '0.8em',
                    color: 'rgb(142,142,142)',
                    marginTop: 10,
                    marginLeft: 7,
                  }}
                >
                  <TbArrowBarToLeft />
                  <span style={{ marginLeft: 5 }}>固定在左侧</span>
                </div>
              )}
              <Tree
                className="asset-platform"
                treeData={fixedColumns(columnsData).dataFixedLeft.map((item) => ({
                  title: item.name,
                  key: item.key,
                  sequence: item.sequence,
                  fixed: item.fixed,
                }))}
                titleRender={(node) => (
                  <div
                    className={styles.title}
                    style={{ width: 120, display: 'flex', justifyContent: 'space-between' }}
                  >
                    {/* title 点选 */}
                    <div style={{ flex: 3 }}>{node.title as string}</div>
                    <Space size="small" className={styles.fixed} style={{ flex: 1 }}>
                      <Tooltip title="取消固定">
                        <a
                          onClick={() => {
                            const columns = columnsData.filter((item) => item.key === node.key)
                            for (let i = 0; i < columns.length; i++) {
                              columns[i].fixed = ''
                            }
                            onFixedChanged?.(columns)
                          }}
                        >
                          {/* <BiArrowToLeft /> */}
                          <TbArrowBarToLeft />
                        </a>
                      </Tooltip>
                      <Tooltip>
                        <a onClick={(e) => e.preventDefault()} style={{ color: 'rgb(142,142,142)', cursor: 'no-drop' }}>
                          {/* <BiArrowToRight /> */}
                          <TbArrowBarToRight />
                        </a>
                      </Tooltip>
                    </Space>
                  </div>
                )}
                draggable
                blockNode
                checkable // 支持通过 check 来点选
                checkedKeys={checkedKeys}
                selectable // 支持通过 select 来点选
                selectedKeys={[]} // 永远不要选中
                switcherIcon={() => null}
                style={{ overflow: 'auto', paddingRight: 10 }}
              />
            </>
            {/* 全部列的列, 能拖拽,能点选 */}
            <>
              {fixedColumns(columnsData).dataUnfixed.length !== columnsData.length && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: '0.8em',
                    color: 'rgb(142,142,142)',
                    marginTop: 5,
                    marginLeft: 7,
                  }}
                >
                  <FaArrowsLeftRightToLine />
                  <span style={{ marginLeft: 5 }}>全部列</span>
                </div>
              )}
              <Tree
                className="asset-platform"
                treeData={fixedColumns(columnsData).dataSource.map((item) => ({
                  title: item.name,
                  key: item.key,
                  sequence: item.sequence,
                  fixed: item.fixed,
                }))}
                titleRender={(node) => (
                  <div
                    className={styles.title}
                    style={{ width: 120, display: 'flex', justifyContent: 'space-between' }}
                  >
                    {/* title 点选 */}
                    <div
                      onClick={() => {
                        let isFound = false
                        for (let i = 0; i < checkedKeys.length; i++) {
                          if (node.key === checkedKeys[i]) {
                            isFound = true
                            break
                          }
                        }
                        if (isFound) {
                          // checkedKeys 中已经有了这个 key 则把它删除掉

                          onVisiableChanged?.(
                            calculateChanged(
                              columnsData,
                              checkedKeys,
                              checkedKeys.filter((item) => item !== node.key),
                            ),
                          )
                          setCheckedKeys(checkedKeys.filter((item) => item !== node.key))
                        } else {
                          // checkedKeys 中没有这个 key 则把它加进去
                          onVisiableChanged?.(
                            calculateChanged(columnsData, checkedKeys, [...checkedKeys, node.key as string]),
                          )
                          setCheckedKeys([...checkedKeys, node.key as string])
                        }
                      }}
                      style={{ flex: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                    >
                      {node.title as string}
                    </div>
                    <Space size="small" className={styles.fixed} style={{ flex: 1 }}>
                      <Tooltip title="固定左侧">
                        <a
                          onClick={() => {
                            const columns = columnsData.filter((item) => item.key === node.key)
                            for (let i = 0; i < columns.length; i++) {
                              columns[i].fixed = 'left'
                            }
                            onFixedChanged?.(columns)
                          }}
                        >
                          {/* <BiArrowToLeft /> */}
                          <TbArrowBarToLeft />
                        </a>
                      </Tooltip>
                      <Tooltip title="固定右侧">
                        <a
                          onClick={() => {
                            const columns = columnsData.filter((item) => item.key === node.key)
                            for (let i = 0; i < columns.length; i++) {
                              columns[i].fixed = 'right'
                            }
                            onFixedChanged?.(columns)
                          }}
                        >
                          {/* <BiArrowToRight /> */}
                          <TbArrowBarToRight />
                        </a>
                      </Tooltip>
                    </Space>
                  </div>
                )}
                draggable
                blockNode
                checkable // 支持通过 check 来点选
                checkedKeys={checkedKeys}
                onCheck={(keys) => {
                  onVisiableChanged?.(calculateChanged(columnsData, checkedKeys, keys as string[]))
                  setCheckedKeys(keys as string[])
                }}
                selectable // 支持通过 select 来点选
                selectedKeys={[]} // 永远不要选中
                onDragEnter={onDragEnter}
                onDrop={onDrop}
                switcherIcon={() => null}
                // style={{ maxHeight: maxHeight, overflow: 'auto', paddingRight: 10 }}
                style={{ overflow: 'auto', paddingRight: 10 }}
              />
            </>

            {/* 固定右侧的列,不能拖拽,不能点选 */}
            <>
              {fixedColumns(columnsData).dataFixedRight.length > 0 && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: '0.8em',
                    color: 'rgb(142,142,142)',
                    marginTop: 5,
                    marginLeft: 7,
                  }}
                >
                  <TbArrowBarToRight />
                  <span style={{ marginLeft: 5 }}>固定在右侧</span>
                </div>
              )}
              <Tree
                className="asset-platform"
                treeData={fixedColumns(columnsData).dataFixedRight.map((item) => ({
                  title: item.name,
                  key: item.key,
                  sequence: item.sequence,
                  fixed: item.fixed,
                }))}
                titleRender={(node) => (
                  <div
                    className={styles.title}
                    style={{ width: 120, display: 'flex', justifyContent: 'space-between' }}
                  >
                    {/* title 点选 */}
                    <div style={{ flex: 3 }}>{node.title as string}</div>
                    <Space size="small" className={styles.fixed} style={{ flex: 1 }}>
                      <Tooltip>
                        <a onClick={(e) => e.preventDefault()} style={{ color: 'rgb(142,142,142)', cursor: 'no-drop' }}>
                          {/* <BiArrowToLeft /> */}
                          <TbArrowBarToLeft />
                        </a>
                      </Tooltip>
                      <Tooltip title="取消固定">
                        <a
                          onClick={() => {
                            const columns = columnsData.filter((item) => item.key === node.key)
                            for (let i = 0; i < columns.length; i++) {
                              columns[i].fixed = ''
                            }
                            onFixedChanged?.(columns)
                          }}
                        >
                          {/* <BiArrowToRight /> */}
                          <TbArrowBarToRight />
                        </a>
                      </Tooltip>
                    </Space>
                  </div>
                )}
                draggable
                blockNode
                checkable // 支持通过 check 来点选
                checkedKeys={checkedKeys}
                selectable // 支持通过 select 来点选
                selectedKeys={[]} // 永远不要选中
                switcherIcon={() => null}
                style={{ overflow: 'auto', paddingRight: 10 }}
              />
            </>
          </div>
        }
      >
        <Button icon={<BsLayoutThreeColumns />} />
      </Popover>
    </>
  )
}
