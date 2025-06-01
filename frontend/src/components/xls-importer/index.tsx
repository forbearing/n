import { TOKEN } from '@/types/const'
import storage from '@/utils/storage'
import { Button, message, Tooltip, UploadFile } from 'antd'
import { RcFile, UploadChangeParam } from 'antd/es/upload'
import { Upload } from 'antd/lib'
import { TfiImport } from 'react-icons/tfi'

export const XLSImporter: React.FC<{
  uploadUrl: string
  text?: string
  onSuccess?: () => void
  onFailure?: () => void
}> = ({ uploadUrl, text = '导入', onSuccess, onFailure }) => {
  const beforeUpload = (file: RcFile) => {
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
          onSuccess?.()
        } else {
          message.error(`${info.file.name} 上传失败`)
          onFailure?.()
        }
        // setLoading(false)
        return
      }
      case 'error':
        message.error(`${info.file.name} 上传失败`)
        onFailure?.()
        return
      default:
        console.log(info.file.status)
        message.error(`${info.file.name} 上传失败`)
        // setLoading(false)
        onFailure?.()
        return
    }
  }

  return (
    <Tooltip title="点击导入XLS文件">
      <Upload
        name="file"
        showUploadList={false}
        action={uploadUrl}
        beforeUpload={beforeUpload}
        onChange={handleUpload}
        accept=".xls, .xlsx"
        headers={{
          Authorization: 'Bearer ' + storage.get(TOKEN)?.token,
        }}
      >
        <Button icon={<TfiImport />}>{text}</Button>
      </Upload>
    </Tooltip>
  )
}
