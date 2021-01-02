<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <h1>{{ cnt }}</h1>
    <h1>{{ double }}</h1>
    <ul>
      <li v-for="n in numberArr" :key="n">
        <h1>{{ n }}</h1>
      </li>
      <h1>{{ person.name }}</h1>
    </ul>
    <button @click="increase">🤙+1</button>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref, toRefs } from "vue";
interface Dataprops {
  cnt: number;
  double: number;
  increase: () => void;
  numberArr: number[];
  person: { name?: string };
}
export default defineComponent({
  name: "Home",
  setup() {
    // 2.base Reactive 函数
    const data: Dataprops = reactive({
      cnt: 0,
      increase: () => {
        data.cnt++;
      },
      double: computed(() => data.cnt * 2),
      numberArr: [0, 1, 2],
      person: {}
    });
    data.numberArr[0] = 5;
    data.person.name = "ofeii";
    const refData = toRefs(data);
    return {
      ...refData
    };
    // 1：base ref syntax
    // const cnt = ref(0);
    // const double = computed(() => {
    //   return cnt.value * 2;
    // });
    // const increase = () => {
    //   cnt.value++;
    // };
    // return {
    //   cnt,
    //   increase,
    //   double
    // };
  }
});
</script>
