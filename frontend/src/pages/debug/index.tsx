import { Modal } from 'antd'
import CreateAppForm from './form'

export default function Debug() {
  return (
    <Modal open={true}>
      <CreateAppForm />
    </Modal>
  )
}
