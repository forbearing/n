// localStorage 模块封装

export default {
  set(key: string, value: any): void {
    localStorage.setItem(key, JSON.stringify(value))
  },
  get(key: string): any | null {
    const value = localStorage.getItem(key)
    if (!value) {
      return null
    }
    try {
      return JSON.parse(value)
    } catch (error) {
      return value
    }
  },
  remove(key: string): void {
    localStorage.removeItem(key)
  },
  clear(): void {
    localStorage.clear()
  },

  setWithExpiry(key: string, value: any, millSec: number) {
    // localStorage.setItem(key, JSON.stringify({ value, expiry: new Date().getTime() + millSec }))
    this.set(key, { value, expiry: new Date().getTime() + millSec })
  },
  getWithExpiry(key: string): any | null {
    const _value = this.get(key)
    if (!_value) return null
    const { value, expiry } = _value
    if (expiry < new Date().getTime()) {
      this.remove(key)
      return null
    }
    return value
  },
}
