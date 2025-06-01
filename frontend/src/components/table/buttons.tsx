import { Button, Input } from 'antd'
import React from 'react'

export const InputSearch: React.FC<{
  value: string
  setValue: (value: string) => void
  onSearch: (value: string) => void
  placeholder?: string
  width?: number
}> = ({ value, setValue, onSearch, placeholder = '搜索', width = 200 }) => {
  return (
    <Input.Search
      enterButton
      allowClear
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onSearch={onSearch}
      placeholder={placeholder}
      style={{ width: `${width}` }}
    />
  )
}

export const InputReset: React.FC<{ onReset?: () => void; text?: string }> = ({ onReset, text = '重置' }) => {
  return (
    <Button type="text" color="primary" variant="filled" onClick={onReset}>
      {text}
    </Button>
  )
}
