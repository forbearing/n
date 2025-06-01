import { Button, Form, Input, Typography } from 'antd'
import { Logo1, Logo10, Logo11, Logo12, Logo2, Logo3, Logo4, Logo5, Logo6, Logo7, Logo8, Logo9 } from './logo'
import { useForm } from 'antd/es/form/Form'
import { AiOutlineBlock, AiOutlineLock, AiOutlineUser } from 'react-icons/ai'

export default () => {
  const [form] = useForm()

  return (
    <div className="relative h-screen overflow-hidden bg-neutral-100">
      <div className="absolute left-1/2 top-1/2 h-auto w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white px-8 py-10 shadow-[0_3px_6px_#ccc]">
        <div className="mx-auto w-40">
          <Logo9 />
        </div>
        <div className="flex items-center justify-center">
          <Form form={form} className="mt-10 w-72">
            <Form.Item name="name" rules={[{ required: true, message: '请输入用户名' }]}>
              <Input prefix={<AiOutlineUser />} placeholder="用户名" autoComplete="off" />
            </Form.Item>
            <Form.Item name="password" rules={[{ required: true, message: '请输入密码' }]}>
              <Input prefix={<AiOutlineLock />} type="password" placeholder="密码" />
            </Form.Item>
            <Form.Item name="mfa_code" rules={[{ required: true, message: '请输入验证码' }]}>
              <Input prefix={<AiOutlineBlock />} placeholder="身份验证码" />
            </Form.Item>
            <Form.Item>
              <div className="flex justify-end gap-x-2">
                <Typography.Link>注册</Typography.Link>
                <Typography.Link>忘记密码?</Typography.Link>
              </div>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                登录
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  )
}
