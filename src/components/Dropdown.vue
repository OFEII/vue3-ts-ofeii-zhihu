<template>
  <div class="dropdown">
    <a href="#" class="btn btn-outline-light my-2 dropdown-toggle" @click.prevent="toggleOpen">
      {{title}}
    </a>
    <ul class="dropdown-menu" :style="{display: 'block'}" v-if="isOpen">
      <dropdown-item><a href="#" class="dropdown-item">新建文章</a></dropdown-item>
      <dropdown-item :disabled="true"><a href="#" class="dropdown-item">编辑资料</a></dropdown-item>
      <dropdown-item><a href="#" class="dropdown-item">退出登陆</a></dropdown-item>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import DropdownItem from './DropdownItem.vue'
export default defineComponent({
  name: 'Dropdown',
  props: {
    title: {
      type: String,
      required: true
    }
  },
  setup (props) {
    const isOpen = ref(false)
    const toggleOpen = () => {
      isOpen.value = !isOpen.value
    }
    return {
      isOpen,
      toggleOpen
    }
  },
  components: {
    DropdownItem
  }
})
</script>

<style lang="scss" scoped>
.dropdown-menu{
  .dropdown-item{
    a{
      color: #0D6EFD;
      text-decoration: none;
    }
    &:hover{
      background: #e9e9e9;
    }
  }
}
</style>
