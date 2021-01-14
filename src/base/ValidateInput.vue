<template>
  <div class="validate-input-container pb-3">
    <input
      v-if="tag !== textarea"
      :class="{'is-invalid': inputRef.error}"
      class="form-control"
      @blur="validateInput"
      @input="updateValue"
      v-model="inputRef.val"
      v-bind="$attrs"
    >
    <textarea
      v-else
      class="form-control"
      :class="{ 'is-invalid': inputRef.error }"
      >

    </textarea>
    <span v-if="inputRef.error" class="invalid-feedback">{{ inputRef.message }}</span>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, PropType, reactive } from 'vue'
import { RuleProps } from '@/store/types'
import { emitter } from './ValidateForm.vue'
const emailReg = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/

export type RulesProp = RuleProps[]
export type TagType = 'input' | 'textarea' | 'custom'
export default defineComponent({
  name: 'validateInput',
  props: {
    rules: Array as PropType<RulesProp>,
    modelValue: String
  },
  // 禁止attribute 继承
  inheritAttrs: false,
  setup (props, context) {
    const inputRef = reactive({
      // val: props.modelValue || '',
      val: computed({
        get: () => props.modelValue || '',
        set: val => {
          context.emit('update: modelValue', val)
        }
      }),
      error: false,
      message: ''
    })
    // const updateValue = (e: KeyboardEvent) => {
    //   const targetValue = (e.target as HTMLInputElement).value
    //   inputRef.val = targetValue
    //   context.emit('update: modelValue', targetValue)
    // }
    const validateInput = () => {
      if (props.rules) {
        const allPassed = props.rules.every(rule => {
          let passed = true
          inputRef.message = rule.message
          switch (rule.type) {
            case 'required':
              passed = (inputRef.val.trim() !== '')
              break
            case 'email':
              passed = emailReg.test(inputRef.val)
              break
            case 'custom':
              passed = passed = rule.validator ? rule.validator() : true
              break
            default:
              break
          }
          return passed
        })
        inputRef.error = !allPassed
      }
    }
    // 将事件发射出去，其实就是把验证函数发射出去
    onMounted(() => {
      emitter.emit('form-item-created', validateInput)
    })
    return {
      inputRef,
      validateInput
      // updateValue
    }
  }

})
</script>

<style lang="scss" scoped>

</style>
