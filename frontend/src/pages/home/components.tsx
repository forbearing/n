import { CustomDivider } from '@/components/custom-divider'
import { App } from '@/types/interfaces'
import { Action, AppEnvMap } from '@/types/types'
import {
  Avatar,
  Button,
  Card,
  Checkbox,
  Col,
  Divider,
  Form,
  Input,
  message,
  Modal,
  Row,
  Select,
  Tag,
  Typography,
  Upload,
} from 'antd'
import { useForm } from 'antd/es/form/Form'
import TextArea from 'antd/es/input/TextArea'
import { DefaultOptionType } from 'antd/es/select'
import React, { FC, useState } from 'react'
import { AiOutlineUpload } from 'react-icons/ai'

export const AppCard: React.FC<{
  shortName?: string
  name: string
  onClick?: () => void
  backgroundColor?: string
  color?: string
}> = ({ shortName, name, onClick, backgroundColor, color }) => {
  const short = name.length > 0 && name[0].toUpperCase()
  return (
    <Card hoverable bodyStyle={{ padding: '12px', textAlign: 'center' }} onClick={onClick}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Avatar size={48} style={{ backgroundColor: backgroundColor, color: color }}>
          {shortName ? shortName : short}
        </Avatar>
        <Typography.Text className="mt-2 overflow-hidden text-ellipsis text-nowrap text-sm">{name}</Typography.Text>
      </div>
    </Card>
  )
}

export const AppCol: FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Col xs={6} sm={4} md={3} lg={3}>
      {children}
    </Col>
  )
}

export const AppForm: React.FC<{
  open: boolean
  onOk: () => void
  onCancel: () => void
  onFinish: (app: App) => void
  app?: App
  action: Action
}> = ({ open, onOk, onCancel, onFinish, action }) => {
  const [form] = useForm()

  const [fileList, setFileList] = useState([])
  const categoryOption: DefaultOptionType[] = [
    { value: 'qiliao', label: <Tag color="blue-inverse">起聊</Tag> },
    { value: 'wangwang', label: <Tag color="purple-inverse">旺旺</Tag> },
  ]
  const envOption: DefaultOptionType[] = []
  AppEnvMap.forEach((v, k) => {
    envOption.push({
      value: k,
      label: (
        <Tag color={v.color} bordered={v.bordered}>
          {v.text}
        </Tag>
      ),
    })
  })

  // 图片上传前的检查
  const beforeUpload = (file: any) => {
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
  const handleChange = () => {
    setFileList(fileList)
  }

  return (
    <Modal
      open={open}
      onOk={onOk}
      onCancel={onCancel}
      width={550}
      title={action === 'create' ? '创建应用' : '更新应用'}
      className="top-10"
      footer={null}
    >
      <CustomDivider />

      <Form form={form} onFinish={onFinish} className="mx-6 my-8">
        <Row gutter={[40, 0]}>
          {/* 应用名称 */}
          <Col span={24}>
            <Form.Item
              name="name"
              label="应用名称"
              labelCol={{ span: 5 }}
              rules={[{ required: true, message: '请输入应用名称' }]}
            >
              <Input placeholder="起聊" />
            </Form.Item>
          </Col>

          {/* 应用标识 */}
          <Col span={24}>
            <Form.Item
              name="code"
              label="应用标识"
              labelCol={{ span: 5 }}
              rules={[{ required: true, message: '请输入应用标识' }]}
            >
              <Input placeholder="qiliao" />
            </Form.Item>
          </Col>

          {/* 所属分类 */}
          <Col span={24}>
            <Form.Item
              name="category_id"
              label="所属分类"
              labelCol={{ span: 5 }}
              rules={[{ required: true, message: '请选择应用分类' }]}
            >
              <Select options={categoryOption} placeholder="请选择应用分类"></Select>
            </Form.Item>
          </Col>

          {/* 环境类型 */}
          <Col span={24}>
            <Form.Item
              name="env"
              label="环境类型"
              labelCol={{ span: 5 }}
              rules={[{ required: true, message: '请选择环境类型' }]}
            >
              {/* <Radio.Group options={envOption}></Radio.Group> */}
              <Select options={envOption} placeholder="请选择环境类型" />
            </Form.Item>
          </Col>

          {/* URL地址 */}
          <Col span={24}>
            <Form.Item name="url" label="Url地址" labelCol={{ span: 5 }}>
              <Input placeholder="https://www.example.com" />
            </Form.Item>
          </Col>

          {/* 权限控制 */}
          <Col span={24}>
            <Form.Item name="role_id" label="权限控制" labelCol={{ span: 5 }} rules={[{ required: false }]}>
              <Checkbox.Group>
                <Checkbox value="dev">开发</Checkbox>
                <Checkbox value="test">测试</Checkbox>
                <Checkbox value="ops">运维</Checkbox>
              </Checkbox.Group>
            </Form.Item>
          </Col>

          {/* 应用图标 */}
          <Col span={24}>
            <Form.Item
              name="icon"
              label="应用图标"
              labelCol={{ span: 5 }}
              extra="建议使用240*240，1MB以内的jpg、png图片"
            >
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
          </Col>

          {/* 备注 */}
          <Col span={24}>
            <Form.Item name="remark" label="备注" labelCol={{ span: 3 }}>
              <TextArea rows={4} placeholder="请输入备注信息" maxLength={1000} showCount />
            </Form.Item>
          </Col>

          <Col span={24}>
            <div className="flex justify-end space-x-3">
              <Button type="primary" htmlType="submit" className="w-20">
                创建
              </Button>
              <Button onClick={onCancel} className="w-20">
                取消
              </Button>
            </div>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}
