<template>
  <div class="container-fluid px-0 flex-shrink-0">
    <global-header :user="currentUser"></global-header>
    <router-view></router-view>
    <loader v-if="isLoading" text="拼命加载中"  background="rgba(0, 0, 0, 0.8)"></loader>
  </div>
  <footer class="text-center py-4 text-secondary bg-light mt-auto app-footer">
    <small>
      <ul class="list-inline mb-0">
        <li class="list-inline-item">© 2021 OFEII专栏</li>
        <li class="list-inline-item">课程</li>
        <li class="list-inline-item">文档</li>
        <li class="list-inline-item">联系</li>
        <li class="list-inline-item">更多</li>
      </ul>
    </small>
  </footer>
</template>

<script lang="ts">
import { defineComponent, computed, watch } from 'vue'
import { useStore } from 'vuex'
import { GlobalDataProps } from './store/types'
import 'bootstrap/dist/css/bootstrap.min.css'
import GlobalHeader from './components/GlobalHeader.vue'
import Loader from './base/Loader.vue'
import createMessage from './base/createMessage'

export default defineComponent({
  name: 'App',
  components: {
    GlobalHeader,
    Loader
  },
  setup () {
    const store = useStore<GlobalDataProps>()
    const currentUser = computed(() => store.state.user)
    const isLoading = computed(() => store.state.loading)
    const error = computed(() => store.state.error)

    // watch 可以接收一个 getters
    watch(() => error.value.status, () => {
      const { status, message } = error.value
      if (status && message) {
        createMessage(message, 'error')
      }
    })

    return {
      currentUser,
      isLoading,
      error
    }
  }
})
</script>

<style lang="scss">
#app{
  width: 100%;
  height: 100vh;
  .app-footer{
    position: fixed;
    bottom: 0;
    width: 100%;
  }
}
</style>
