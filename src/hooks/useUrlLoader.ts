import {ref} from 'vue'
import axios from 'axios'
// 添加一个参数作为要使用的地址

const useUrlLoader = (url: string) => {
  const res = ref(null)
  const loading = ref(true)
  const loader = ref(false)
  const err = ref(null)
  // 发送异步请求，获得data
  // 由于 axios 都有定义，所以rawData 可以轻松知道其类型
  axios.get(url).then((raw) => {
    loading.value = false
    loader.value = true
    res.value = raw.data
  }).catch(e => {
    err.value = e
  })
  return {
    res, 
    loading,
    loader,
    err
  }
}

export default useUrlLoader