import { combineReducers, configureStore, createSlice } from '@reduxjs/toolkit'
import logger from 'redux-logger'
import { FLUSH, PAUSE, PERSIST, persistReducer, PURGE, REGISTER, REHYDRATE } from 'redux-persist'
import persistStore from 'redux-persist/es/persistStore'
import storage from 'redux-persist/lib/storage'
import { thunk } from 'redux-thunk'

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: {},
    url: '',
  },
  reducers: {
    setUser(state, action) {
      state.user = action.payload
    },
    setUrl(state, action) {
      state.url = action.payload
    },
  },
})
// tableSlice 用来保存表格的状态, 比如菜单管理页面中展开了哪些行.
export const tableSlice = createSlice({
  name: 'table',
  initialState: {
    menuExpandedRowKeys: [], // menu 页面中 table的展开项
  },
  reducers: {
    setMenuExpandedRowKeys(state, action) {
      state.menuExpandedRowKeys = action.payload
    },
  },
})

// layoutSlice 保存了整个页面的布局信息. 响应式布局需要用到这个.
export const layoutSlice = createSlice({
  name: 'layout',
  initialState: {
    window: { height: 0, width: 0 }, // browser
    header: { height: 0 }, // browser
    footer: { height: 0 }, // browser
    navbar: { height: 0 }, // mobile
    swiper: { height: 0 }, // mobile
    tabbar: { height: 0 }, // mobile
    collapsed: false,
    openKeys: [],
    pathname: '/',
    fullscreen: 0, // 1 表示非全屏,2表示全屏
  },
  reducers: {
    setWindow(state, action) {
      state.window = action.payload
    },
    setHeader(state, action) {
      state.header = action.payload
    },
    setFooter(state, action) {
      state.footer = action.payload
    },
    setNavbar(state, action) {
      state.navbar = action.payload
    },
    setSwiper(state, action) {
      state.swiper = action.payload
    },
    setTabbar(state, action) {
      state.tabbar = action.payload
    },
    setCollapsed(state, action) {
      state.collapsed = action.payload
    },
    setOpenKeys(state, action) {
      state.openKeys = action.payload
    },
    setPathname(state, action) {
      state.pathname = action.payload
    },
    setFullscreen(state, action) {
      state.fullscreen = action.payload
    },
    setEnterFullscreen(state) {
      state.fullscreen = 2
    },
    setExitFullscreen(state) {
      state.fullscreen = 1
    },
  },
})

const rootReducer = combineReducers({
  user: userSlice.reducer,
  layout: layoutSlice.reducer,
  table: tableSlice.reducer,
})

export const store = configureStore({
  // reducer: rootReducer,
  reducer: persistReducer({ key: 'root', version: 1.2, storage }, rootReducer),
  // FIX: A non-serializable value was detected in an action
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(logger), // includes default middleware
  // }).concat(thunk) // includes default middleware
})

export const persistor = persistStore(store)
export type StoreType = ReturnType<typeof store.getState>
