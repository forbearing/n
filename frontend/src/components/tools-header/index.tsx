import { Button, MenuProps, Space, TableColumnType, Tooltip, Upload, message } from 'antd'
import { RxTextAlignJustify } from 'react-icons/rx'
import { TfiImport } from 'react-icons/tfi'
// import { PiExportBold } from 'react-icons/pi'
// import { BsBoxArrowDown, BsBoxArrowDownLeft, BsBoxArrowUp } from 'react-icons/bs'
import { RcFile, UploadChangeParam } from 'antd/es/upload'
import { UploadFile } from 'antd/lib'
import { Base64 } from 'js-base64'
import Cookies from 'js-cookie'
import { debounce } from 'lodash'
import { Dispatch } from 'react'
import { BiExitFullscreen, BiFullscreen } from 'react-icons/bi'
import config from '@/config'
import { FiHelpCircle } from 'react-icons/fi'
import { useDispatch, useSelector } from 'react-redux'
import { layoutSlice, StoreType } from '@/store'
import { NAME, USER_ROOT, TOKEN } from '@/types/const'
import { TableColumnSelector } from '../table-column-selector'
import storage from '@/utils/storage'
import { TableColumn } from '@/types/interfaces'
import { AiOutlineSync } from 'react-icons/ai'
export const ToolsHeader: React.FC<{
  refreshRef: React.RefObject<HTMLElement>
  handleRefresh?: any
  showToggleFullscreen?: boolean
  handleTableResize?: any
  handleImport?: {
    api: string
    callback: any
  }
  disableImport?: boolean
  disableImportMessage?: string
  handleExport?: any

  columnSelectable?: boolean
  columnsData?: TableColumn[]
  onSequenceChanged?: (columns: TableColumn[]) => void
  onVisiableChanged?: (columns: TableColumn[]) => void
  onFixedChanged?: (columns: TableColumn[]) => void
  onColumnsReset?: () => void

  showHelp?: boolean

  helpHref?: string
}> = ({
  refreshRef,
  handleRefresh,
  handleImport,
  handleExport,
  disableImport = false,
  disableImportMessage = '请联系管理员导入数据',

  // TableColumnSelector 组件
  columnSelectable = false,
  columnsData,
  onSequenceChanged,
  onVisiableChanged,
  onFixedChanged,
  onColumnsReset,

  showHelp = false,
  helpHref = '',
}) => {
  const name = Cookies.get(NAME)
  if (name) {
    const decodedName = Base64.decode(name)
    if (decodedName == USER_ROOT) disableImport = false
  }
  const debouncedRefresh = debounce(handleRefresh, 1000, { leading: true, trailing: false, maxWait: 2000 })

  const dispatch: Dispatch<any> = useDispatch()
  const { setEnterFullscreen, setExitFullscreen } = layoutSlice.actions
  const { fullscreen } = useSelector((state: StoreType) => state.layout)

  // const [loading, setLoading] = useState(false)

  const beforeImport = (file: RcFile) => {
    // xlsx: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
    // xls:  application/vnd.ms-excel
    // csv:  text/csv
    const isXlsOrCsv =
      file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      file.type === 'application/vnd.ms-excel' ||
      file.type === 'text/csv'
    if (!isXlsOrCsv) {
      message.warning('仅支持 xlsx, xls, csv 文件类型')
      return false
    }
    const isLt2M = file.size / 1024 / 1024 < 2
    if (!isLt2M) {
      message.warning('导入的文件必须小于2M')
      return false
    }
    // message.success('文件导入成功')
  }
  const handleUpload = (info: UploadChangeParam<UploadFile>) => {
    switch (info.file.status) {
      case 'uploading':
        // setLoading(true)
        return
      case 'done': {
        const { code } = info.file.response
        if (code === 0) {
          message.success(`${info.file.name} 上传成功`)
          handleImport?.callback()
        } else {
          message.error(`${info.file.name} 上传失败`)
        }
        // setLoading(false)
        return
      }
      case 'error':
        message.error(`${info.file.name} 上传失败`)
        return
      default:
        console.log(info.file.status)
        message.error(`${info.file.name} 上传失败`)
        // setLoading(false)
        return
    }
  }
  return (
    <Space direction="horizontal">
      {columnSelectable && columnsData!.length > 0 && (
        <Tooltip title="列展示">
          {/* 不加这个 <></> 似乎不会显示 tooltip 的 title */}
          <></>
          <TableColumnSelector
            columnsData={columnsData as TableColumn[]}
            onVisiableChanged={onVisiableChanged}
            onSequenceChanged={onSequenceChanged}
            onFixedChanged={onFixedChanged}
            onReset={onColumnsReset}
          />
        </Tooltip>
      )}

      {handleRefresh && (
        <Tooltip title="刷新">
          {/* @ts-ignore */}
          <Button icon={<AiOutlineSync ref={refreshRef} />} onClick={debouncedRefresh} />
        </Tooltip>
      )}
      {fullscreen === 1 ? (
        <Tooltip title="全屏">
          <Button icon={<BiFullscreen size="1.2em" />} onClick={() => dispatch(setEnterFullscreen())} />
        </Tooltip>
      ) : (
        <Tooltip title="退出全屏">
          <Button icon={<BiExitFullscreen size="1.2em" />} onClick={() => dispatch(setExitFullscreen())} />
        </Tooltip>
      )}

      {/* {handleTableResize && ( */}
      {/*     <Popover content='排列' > */}
      {/*         <Dropdown */}
      {/*             menu={{ items: tableSizeItems, onClick: handleTableResize }} */}
      {/*             trigger={['click']} */}
      {/*             placement='bottom' */}
      {/*         > */}
      {/*             <Button icon={<TfiLayoutAccordionSeparated />} /> */}
      {/*         </Dropdown> */}
      {/*     </Popover> */}
      {/* )} */}

      {/* {handleExport && ( */}
      {/*     <Popover content='导出'> */}
      {/*         <Dropdown menu={{ items: exportMenu }} trigger={['click']} placement='bottom'> */}
      {/*             <Button icon={<TfiExport />} /> */}
      {/*         </Dropdown> */}
      {/*     </Popover> */}
      {/* )} */}
      {handleImport && !disableImport && (
        <Tooltip title="导入">
          <Upload
            name="file"
            showUploadList={false}
            action={`${config.baseUrl}${handleImport.api}`}
            beforeUpload={beforeImport}
            onChange={handleUpload}
            accept=".xls, .xlsx"
            headers={{
              Authorization: 'Bearer ' + storage.get(TOKEN)?.token,
            }}
          >
            <Button icon={<TfiImport />} />
          </Upload>
        </Tooltip>
      )}
      {disableImport && (
        <Tooltip title="导入">
          <Button icon={<TfiImport />} onClick={() => message.warning(disableImportMessage)} />
        </Tooltip>
      )}
      {showHelp && (
        <Tooltip title="帮助文档">
          <Button
            type="text"
            icon={
              <FiHelpCircle
                size="1.4em"
                onClick={() => {
                  if (helpHref) {
                    if (helpHref.length > 0) {
                      window.open(helpHref)
                    }
                  }
                }}
              />
            }
          />
        </Tooltip>
      )}
    </Space>
  )
}
