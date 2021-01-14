import { createStore, Commit } from 'vuex'
// 从 vuex 导入 createStore 这个函数，我们发现 vue3 以后，这些第三方的官方库，名字出奇的相似，vue-router 也是以create 开头的，看起来非常的清楚。
import { GlobalDataProps, GlobalErrorProps } from './types'
import { axios, AxiosRequestConfig } from '../libs/http'
import { StorageHandler, storageType } from '../libs/storage'
import { arrToObj, objToArr } from '../libs/helper'

const storageHandler = new StorageHandler()
const asyncAndCommit = async (url: string, mutationName: string, commit: Commit,
  config: AxiosRequestConfig = { method: 'get' }, extraData?: any) => {
  const { data } = await axios(url, config)
  if (extraData) {
    commit(mutationName, { data, extraData })
  } else {
    commit(mutationName, data)
  }
  return data
}

const store = createStore<GlobalDataProps>({
  state: {
    error: { status: false },
    token: storageHandler.getItem(storageType, 'token') || '',
    loading: false,
    columns: { data: {}, currentPage: 0, total: 0 },
    posts: { data: {}, loadedColums: {} },
    user: { isLogin: false }
  },
  mutations: {
    fetchColumns (state, rawData) {
      const { data } = state.columns
      const { list, count, currentPage } = rawData.data
      state.columns = {
        data: { ...data, ...arrToObj(list) },
        total: count,
        currentPage: currentPage * 1
      }
    },
    fetchColumn (state, rawData) {
      state.columns.data[rawData.data._id] = rawData.data
    },
    fetchPosts (state, { data: rawData, extraData: columnId }) {
      const { data } = state.posts
      const { list, count, currentPage } = rawData.data
      state.posts.data = { ...data, ...arrToObj(list) }
      state.posts.loadedColums[columnId] = {
        columnId: columnId,
        total: count,
        currentPage: currentPage * 1
      }
    },
    fetchPost (state, rawData) {
      state.posts.data[rawData.data._id] = rawData.data
    },
    createPost (state, newPost) {
      state.posts.data[newPost._id] = newPost
    },
    updatePost (state, { data }) {
      state.posts.data[data._id] = data
    },
    deletePost (state, { data }) {
      delete state.posts.data[data._id]
    },
    setLoading (state, status) {
      state.loading = status
    },
    setError (state, e: GlobalErrorProps) {
      state.error = e
    },
    login (state, rawData) {
      const { token } = rawData.data
      state.token = token
      storageHandler.setItem(storageType, 'token', token)
      axios.defaults.headers.common.Authorization = `Bearer ${token}`
    },
    fetchCurrentUser (state, rawData) {
      state.user = { isLogin: true, ...rawData.data }
    },
    logout (state) {
      state.token = ''
      state.user = { isLogin: false }
      storageHandler.remove(storageType, 'token')
      delete axios.defaults.headers.common.Authorization
    }
  },
  actions: {
    // async fetchColumns ({ commit }) {
    //   const { data } = await axios.get('/api/columns')
    //   commit('fetchColumns', data)
    // },
    // 一步封装优化实现
    fetchColumns ({ state, commit }, params = {}) {
      const { currentPage = 1, pageSize = 6 } = params
      if (state.columns.currentPage < currentPage) {
        return asyncAndCommit(`/api/columns?currentPage=${currentPage}&pageSize=${pageSize}`, 'fetchColumns', commit)
      }
    },
    fetchColumn ({ state, commit }, cid) {
      if (!state.columns.data[cid]) {
        return asyncAndCommit(`/api/columns/${cid}`, 'fetchColumn', commit)
      }
    },
    fetchPosts ({ state, commit }, params = {}) {
      const { columnId, currentPage = 1, pageSize = 3 } = params
      const loadedPost = state.posts.loadedColums[columnId]
      if (!loadedPost) {
        return asyncAndCommit(`/api/columns/${columnId}/posts?currentPage=${currentPage}&pageSize=${pageSize}`, 'fetchPosts', commit, { method: 'get' }, columnId)
      } else {
        const loadedPostCurrentPage = loadedPost.currentPage || 0
        if (loadedPostCurrentPage < currentPage) {
          return asyncAndCommit(`/api/columns/${columnId}/posts?currentPage=${currentPage}&pageSize=${pageSize}`, 'fetchPosts', commit, { method: 'get' }, columnId)
        }
      }
    },
    fetchPost ({ state, commit }, id) {
      const currentPost = state.posts.data[id]
      // 没有获取过 或者 没有详细内容的话就要发送请求
      if (!currentPost || !currentPost.content) {
        return asyncAndCommit(`/api/posts/${id}`, 'fetchPost', commit)
      } else {
        return Promise.resolve({ data: currentPost })
      }
    },
    createPost ({ commit }, payload) {
      return asyncAndCommit('api/post', 'createPost', commit, { method: 'post', data: payload })
    },
    updatePost ({ commit }, { id, payload }) {
      return asyncAndCommit(`/api/posts/${id}`, 'updatePost', commit, {
        method: 'patch',
        data: payload
      })
    },
    login ({ commit }, payload) {
      return asyncAndCommit('/api/user/login', 'login', commit, { method: 'post', data: payload })
    },
    fetchCurrentUser ({ commit }) {
      return asyncAndCommit('/api/user/current', 'fetchCurrentUser', commit)
    },
    // 登录并获取用户信息
    async loginAndFetch ({ dispatch }, loginData) {
      await dispatch('login', loginData)
      return await dispatch('fetchCurrentUser')
    },
    register ({ commit }, payload) {
      return asyncAndCommit('/api/users', 'register', commit, { method: 'post', data: payload })
    }
  },
  getters: {
    getColumns: state => {
      return objToArr(state.columns.data)
    },
    getColumnById: state => (id: string) => {
      return state.columns.data[id]
    },
    getPostByCid: state => (cid: string) => {
      return objToArr(state.posts.data).filter(post => post.column === cid)
    },
    // 根据columnId 获得已加载的记录
    getLoadedPost: state => (id: string) => {
      return state.posts.loadedColums[id]
    }
  }
})

export default store
