import { useEffect } from 'react'
import _, { debounce } from 'lodash'
import './index.scss'

// https://stackoverflow.com/questions/68415973/hide-scrollbar-when-not-scrolling-mac-like-behaviour
// https://blog.csdn.net/hangGe0111/article/details/81981330 判断上下滚动

// @ts-ignore
const ids: (NodeJS.Timeout | undefined)[] = []
const elements: Element[] = []
const listeners: any[] = []

const showScroll = (idx: number) => {
  return debounce(
    () => {
      elements[idx].classList.remove('hidden')
      console.log('showScroll')
    },
    100,
    { leading: true, trailing: false, maxWait: 500 },
  )
}
const hiddenScroll = (idx: number) => {
  return debounce(
    () => {
      clearTimeout(ids[idx])
      ids[idx] = setTimeout(() => {
        elements[idx].classList.add('hidden')
      }, 500)
      console.log('hiddenScroll')
    },
    100,
    { leading: true, trailing: false, maxWait: 500 },
  )
}
const scrolling = (idx: number) => {
  // leading: 立即触发, 延迟100ms触发一次, maxWait: 500ms內必定触发一次
  return debounce(
    () => {
      elements[idx].classList.remove('hidden')
      clearTimeout(ids[idx])
      ids[idx] = setTimeout(() => {
        elements[idx].classList.add('hidden')
      }, 1000)
      console.log('scrolling')
    },
    100,
    { leading: true, trailing: false, maxWait: 500 },
  )
}

// AutoHiddenScrollbar 只能被使用一次.
// 用法: 给你的组件增加一个 class name, 然后把这个 class name 传入进来
//
// classList: 需要自动隐藏滚动条的组件的 class name. class name 格式为 ".xxxx".
// delay 延迟寻找组件, 有些组件并不会第一时间渲染完全出来, 比如 ant-design Table 组件,
export const AutoHiddenScrollbar: React.FC<{ children: any; classList?: string[]; delay?: number }> = ({
  children,
  classList,
  delay = 1000,
}) => {
  // 内部已经支持的 class name
  let _classList: string[] = [
    '.ant-table-body',
    '.ant-tree-list',
    '.asset-platform-layout-div',
    '.asset-platform-div',
    '.asset-platform-layout-menu',
  ]
  if (classList) _classList.push(...classList)
  _classList = _.uniq(_classList) // 去重
  if (delay < 1000 || delay > 3000) delay = 1000 // 最少延迟1秒.最多延迟3秒

  useEffect(() => {
    // 这里延迟一秒去自动隐藏滚动条
    // 因为有些 ant design table 并不会第一时间渲染出来, 而是等数据有了之后 table 才会出现
    // 即 children 中第一时间没有 table, 需要等 children 组件拿到数据之后才会有 table
    // 这样通过 .ant-table-body 就找不到任何的 table 了
    // 同时也方便用用户知道这里有滚动条.
    setTimeout(() => {
      for (let i = 0; i < _classList.length; i++) {
        const e = document.querySelector(_classList[i])
        if (e) {
          // console.log('================================ e', i, e)
          elements[i] = e
        }
      }
      for (let i = 0; i < elements.length; i++) {
        listeners[i] = scrolling(i)
      }

      // console.log('================ listeners length', listeners.length)
      // console.log('================ elements length', elements.length)

      // antTable.addEventListener('scroll', showScroll) // mouseover 鼠标移动到 Table 上
      // antTable.addEventListener('mouseleave', hiddenScroll) // mouseleave 鼠标从 Table 离开
      for (let i = 0; i < elements.length; i++) {
        // 有些也没有没有 ant table, ant tree 组件,这时候, 其中的 element 也可能就是 undefined
        if (elements[i] !== undefined) {
          elements[i].classList.add('hidden')
          elements[i].addEventListener('scroll', listeners[i])
        }
      }
    }, delay)
    return () => {
      setTimeout(() => {
        for (let i = 0; i < elements.length; i++) {
          if (elements[i] !== undefined) {
            elements[i].removeEventListener('scroll', listeners[i])
          }
        }
      }, delay)
    }
  }, [children])
  return <>{children}</>
}
