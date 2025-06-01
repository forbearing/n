import { Button } from 'antd'
import { LuShieldAlert } from 'react-icons/lu'
import { useNavigate } from 'react-router-dom'

export default function Page403() {
  const navigate = useNavigate()
  return (
    <div className="flex h-full w-full flex-col items-center justify-center space-y-3">
      <div className="rounded-full bg-red-100 p-3.5">
        <LuShieldAlert className="text-4xl text-red-500" />
      </div>
      <p className="animate-pulse text-4xl font-bold">Access Denied</p>
      <div className="flex items-center justify-center space-x-3">
        <Button onClick={() => navigate(-1)}>Go Back</Button>
        <Button type="primary" onClick={() => navigate('/home')}>
          Return to Home
        </Button>
      </div>
    </div>
  )
}
