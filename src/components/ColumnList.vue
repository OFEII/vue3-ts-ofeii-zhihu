<template>
  <div class="row">
    <div v-for="col in columnList" :key="col._id" class="col-4">
      <div class="card h-100 shadow-sm">
        <div class="card-body text-center">
          <img :src="col.avatar && col.avatar.fitUrl" :alt="col.title" class="rounded-circle border border-light w-25 my-3">
          <h5 class="card-title">{{ col.title }}</h5>
          <p class="card-text text-left">{{ col.description }}</p>
          <router-link :to="`/column/${col._id}`" class="btn btn-outline-primary">进入专栏</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { addColumnAvatar } from '@/libs/helper'
import { ColumnProps } from '@/store/types'
import { computed, defineComponent, PropType } from 'vue'
export default defineComponent({
  name: 'ColumnList',
  props: {
    list: {
      // 这里特别有一点，我们现在的 Array 是没有类型的，只是一个数组，我们希望它是一个 ColomnProps 的数组，那么我们是否可以使用了类型断言直接写成 ColomnProps[]，显然是不行的 ，
      // 因为 Array 是一个数组的构造函数不是类型，我们可以使用 PropType 这个方法，它接受一个泛型，讲 Array 构造函数返回传入的泛型类型。
      type: Array as PropType<ColumnProps[]>,
      required: true
    }
  },
  setup (props) {
    const columnList = computed(() => {
      return props.list.map(column => {
        addColumnAvatar(column, 50, 50)
        return column
      })
    })
    return {
      columnList
    }
  }
})
</script>

<style lang="scss" scoped>
.card-body img {
  width: 50px;
  height: 50px;
}
</style>
