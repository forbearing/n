import _ from 'lodash'

let count = 0
let idHidden: any
let idShown: any

const delayShow = 30 // 测试发现,30秒是最佳的
const delayHidden = 300 // 过度效果是300ms

// export const ShowLoading = () => {
//     // console.log('ShowLoading: ', count)
//     if (count <= 0) {
//         count = 0
//     }
//     if (count === 0) {
//         // 延迟显示 loading 图标
//         clearTimeout(idShown)
//         clearTimeout(idHidden)
//         const loading = document.getElementById('asset-platform-loading')
//         loading?.classList.add('loading-blur')
//         loading?.style.setProperty('z-index', '1000')
//         const spin = document.querySelectorAll('.ant-spin-dot.ant-spin-dot-spin')
//         if (spin.length > 0) {
//             // @ts-ignore
//             spin[0].style.setProperty('display', 'block')
//         }
//         // idShown = setTimeout(() => {
//         //     const loading = document.getElementById('asset-platform-loading')
//         //     loading?.style.setProperty('z-index', '1000')
//         // }, 0) // 30ms的请求就不显示 spin
//     }
//     count++
// }

export const ShowLoading = () => {
  // console.log('ShowLoading: ', count)
  if (count <= 0) {
    count = 0
  }
  if (count === 0) {
    // 延迟显示 loading 图标
    clearTimeout(idShown)
    clearTimeout(idHidden)
    idShown = setTimeout(() => {
      const loading = document.getElementById('asset-platform-loading')
      loading?.classList.add('loading-blur')
      loading?.style.setProperty('z-index', '1000')
      const spin = document.querySelectorAll('.ant-spin-dot.ant-spin-dot-spin')
      if (spin.length > 0) {
        // @ts-ignore
        spin[0].style.setProperty('display', 'block')
      }
    }, delayShow)
  }
  count++
}

export const HideLoading = () => {
  // console.log('HideLoading: ', count)
  count--
  if (count === 0) {
    clearTimeout(idShown)
    clearTimeout(idHidden)
    const loading = document.getElementById('asset-platform-loading')
    loading?.classList.remove('loading-blur')
    const spin = document.querySelectorAll('.ant-spin-dot.ant-spin-dot-spin')
    if (spin.length > 0) {
      // @ts-ignore
      spin[0].style.setProperty('display', 'none')
    }

    idHidden = setTimeout(() => {
      const loading = document.getElementById('asset-platform-loading')
      loading?.style.setProperty('z-index', '-1000')
    }, delayHidden + delayShow) // 延迟将 z-index 设置为-1000,用来保持过渡效果
  }
}
