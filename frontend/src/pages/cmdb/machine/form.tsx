import { CustomDivider } from '@/components/custom-divider'
import { App, Machine, Project, Vendor } from '@/types/interfaces'
import { Action } from '@/types/types'
import { Button, Col, Form, Input, InputNumber, Modal, Row, Select } from 'antd'
import { useForm } from 'antd/es/form/Form'
import TextArea from 'antd/es/input/TextArea'
import React, { useEffect } from 'react'

export const MachineForm: React.FC<{
  open: boolean
  onOk: () => void
  onCancel: () => void
  onFinish: (app: App) => void
  projects?: Project[]
  vendors?: Vendor[]
  machine?: Machine
  action: Action
}> = ({ open, onOk, onCancel, onFinish, action, machine, projects, vendors }) => {
  const [form] = useForm()

  useEffect(() => {
    if (!machine) {
      return
    }
    switch (action) {
      case 'update':
        console.log('machine: ', machine)
        form.setFieldsValue(machine)
    }
  }, [action, machine])

  return (
    <Modal
      open={open}
      onOk={onOk}
      onCancel={onCancel}
      width={900}
      title={action === 'create' ? '创建机器' : '更新机器'}
      className="top-10"
      footer={null}
    >
      <CustomDivider />

      <Form
        form={form}
        onFinish={(value) => {
          onFinish(value)
          form.resetFields()
        }}
        className="mx-6 my-8"
      >
        {/* 这个 id 字段不要显示, 但是 onFinish 时需要传递 id 过去, 后端更新需要ID */}
        <Form.Item name="id" hidden preserve />
        <Row gutter={[40, 0]}>
          <Col span={8}>
            <Form.Item
              name="hostname"
              label="主机名称"
              labelCol={{ span: 24 }}
              rules={[{ required: true, message: '请输入主机名称' }]}
            >
              <Input placeholder="请输入主机名称" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="ip_address"
              label="IP地址"
              labelCol={{ span: 24 }}
              rules={[{ required: true, message: '请输入IP地址' }]}
            >
              <Input placeholder="多个IP用逗号分隔" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="email" label="责任人邮箱" labelCol={{ span: 24 }}>
              <Input placeholder="请输入责任人邮箱" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="email" label="责任人" labelCol={{ span: 24 }}>
              <Input placeholder="请输入责任人" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="cpu" label="CPU配置" labelCol={{ span: 24 }}>
              <InputNumber placeholder="请输入CPU配置,单位个" className="w-full" min={1} max={1024} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="memory" label="内存配置" labelCol={{ span: 24 }}>
              <InputNumber placeholder="请输入内存配置,单位G" className="w-full" min={1} max={10240} />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item name="storage" label="存储配置" labelCol={{ span: 24 }}>
              <InputNumber placeholder="请输入存储配置,单位G" className="w-full" min={1} max={10240} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="network" label="网络配置" labelCol={{ span: 24 }}>
              <Input placeholder="请输入网络配置" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="network" label="成本" labelCol={{ span: 24 }}>
              <InputNumber placeholder="请输入成本,单位元" min={1} className="w-full" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="deployed_app" label="已部署应用" labelCol={{ span: 24 }}>
              <InputNumber placeholder="多个应用用逗号分隔" min={1} className="w-full" />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item name="project_id" label="所属项目" labelCol={{ span: 24 }}>
              <Select placeholder="请选择所属项目" options={projects?.map((p) => ({ label: p.name, value: p.id }))} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="vendor_id" label="提供商" labelCol={{ span: 24 }}>
              <Select placeholder="请选择提供商" options={vendors?.map((v) => ({ label: v.name, value: v.id }))} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="batch" label="批量创建个数" labelCol={{ span: 24 }}>
              <InputNumber placeholder="为空代表只创建一台机器" className="w-full" min={1} />
            </Form.Item>
          </Col>

          {/* 备注 */}
          <Col span={24}>
            <Form.Item name="remark" label="备注" labelCol={{ span: 24 }}>
              <TextArea rows={4} placeholder="请输入备注信息" maxLength={1000} showCount />
            </Form.Item>
          </Col>

          <Col span={24}>
            <div className="flex justify-end space-x-3">
              <Button onClick={onCancel} className="w-20">
                取消
              </Button>
              <Button type="primary" htmlType="submit" className="w-20">
                {action === 'create' ? '创建' : '更新'}
              </Button>
            </div>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}
