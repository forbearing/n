import React, { useState } from 'react'
import { Form, Input, Select, Radio, Checkbox, Upload, Button, message } from 'antd'
import { useNavigate } from 'react-router-dom'
import { AiOutlineUpload } from 'react-icons/ai'

const { TextArea } = Input

const CreateAppForm = () => {
  const [form] = Form.useForm()
  const navigate = useNavigate()
  const [fileList, setFileList] = useState([])

  // 处理表单提交
  const handleSubmit = async (values) => {
    try {
      console.log('提交的表单数据:', values)
      message.success('应用创建成功！')
      navigate('/dashboard') // 假设创建成功后返回到仪表盘页面
    } catch (error) {
      message.error('创建失败，请重试！')
    }
  }

  // 处理取消操作
  const handleCancel = () => {
    navigate(-1) // 返回上一页
  }

  // 图片上传前的检查
  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
    if (!isJpgOrPng) {
      message.error('只能上传 JPG/PNG 文件!')
      return false
    }

    const isLt1M = file.size / 1024 / 1024 < 1
    if (!isLt1M) {
      message.error('图片必须小于 1MB!')
      return false
    }

    return isJpgOrPng && isLt1M
  }

  // 图片上传改变事件
  const handleChange = ({ fileList }) => {
    setFileList(fileList)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-2xl rounded bg-white p-8 shadow-md">
        <h1 className="mb-6 text-2xl font-bold">创建应用</h1>

        <Form form={form} layout="vertical" onFinish={handleSubmit} requiredMark={true}>
          {/* 应用名称 */}
          <Form.Item
            name="appName"
            label={
              <span className="flex items-center">
                应用名称<span className="ml-1 text-red-500">*</span>
              </span>
            }
            rules={[{ required: true, message: '请输入应用名称' }]}
          >
            <Input placeholder="旺旺" />
          </Form.Item>

          {/* 应用标识 */}
          <Form.Item
            name="appIdentifier"
            label={
              <span className="flex items-center">
                应用标识<span className="ml-1 text-red-500">*</span>
              </span>
            }
            rules={[{ required: true, message: '请输入应用标识' }]}
          >
            <Input placeholder="wangwang" />
          </Form.Item>

          {/* 所属分类 */}
          <Form.Item
            name="category"
            label={
              <span className="flex items-center">
                所属分类<span className="ml-1 text-red-500">*</span>
              </span>
            }
            rules={[{ required: true, message: '请选择所属分类' }]}
          >
            <Select placeholder="请选择分类">
              <Select.Option value="communication">通讯工具</Select.Option>
              <Select.Option value="office">办公工具</Select.Option>
              <Select.Option value="development">开发工具</Select.Option>
              <Select.Option value="monitor">监控工具</Select.Option>
              <Select.Option value="other">其他</Select.Option>
            </Select>
          </Form.Item>

          {/* 环境类型 */}
          <Form.Item
            name="envType"
            label={
              <span className="flex items-center">
                环境类型<span className="ml-1 text-red-500">*</span>
              </span>
            }
            rules={[{ required: true, message: '请选择环境类型' }]}
          >
            <Radio.Group>
              <Radio value="dev">开发(dev)</Radio>
              <Radio value="test">测试(test)</Radio>
              <Radio value="pre">预发(pre)</Radio>
              <Radio value="prod">生产(prod)</Radio>
            </Radio.Group>
          </Form.Item>

          {/* URL地址 */}
          <Form.Item name="url" label="Url地址">
            <Input placeholder="https://www.wwtalk.com/" />
          </Form.Item>

          {/* 权限控制 */}
          <Form.Item name="permissions" label="权限控制">
            <Checkbox.Group>
              <Checkbox value="dev">开发</Checkbox>
              <Checkbox value="test">测试</Checkbox>
              <Checkbox value="ops">运维</Checkbox>
            </Checkbox.Group>
          </Form.Item>

          {/* 应用图标 */}
          <Form.Item name="appIcon" label="应用图标" extra="建议使用240*240，1MB以内的jpg、png图片">
            <Upload
              listType="picture"
              maxCount={1}
              fileList={fileList}
              beforeUpload={beforeUpload}
              onChange={handleChange}
              action="/api/upload" // 替换为实际的上传API
            >
              <Button icon={<AiOutlineUpload />}>选择图片</Button>
            </Upload>
          </Form.Item>

          {/* 备注 */}
          <Form.Item name="remark" label="备注">
            <TextArea rows={4} placeholder="请输入备注信息" />
          </Form.Item>

          {/* 操作按钮 */}
          <Form.Item className="mt-6 flex justify-start">
            <div className="flex gap-4">
              <Button type="primary" htmlType="submit" className="w-24">
                创建
              </Button>
              <Button htmlType="button" onClick={handleCancel} className="w-24">
                取消
              </Button>
            </div>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}

export default CreateAppForm
