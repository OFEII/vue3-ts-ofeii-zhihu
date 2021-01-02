<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <h1 v-if="loading">Loading!...</h1>
    <!-- <img v-if="loader" :src="res[0].url" /> -->
    <modal :isOpen="modalIsOpen" @close-modal="onModalClose" />
    <button @click="openModal">🤡</button>
    <h1>X:{{ x }} Y:{{ y }}</h1>
    <h1>Title: {{ greetings }}</h1>
    <h1>{{ cnt }}</h1>
    <h1>{{ double }}</h1>
    <ul>
      <li v-for="n in numberArr" :key="n">
        <h1>{{ n }}</h1>
      </li>
      <h1>{{ person.name }}</h1>
    </ul>
    <button @click="increase">🤙+1</button>
    <button @click="updateGreeting">✍update title</button>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  reactive,
  ref,
  toRefs,
  watch,
  onMounted,
  onUnmounted
} from "vue";

import useMousePos from "@/hooks/useMousePos";
import useUrlLoader from "@/hooks/useUrlLoader";
import Modal from "@/components/Modal.vue";
interface Dataprops {
  cnt: number;
  double: number;
  increase: () => void;
  numberArr: number[];
  person: { name?: string };
}
interface DogRes {
  message: string;
  status: string;
}

interface CatRes {
  id: string;
  url: string;
  width: number;
  height: number;
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
    // useUrlLoader
    const { res, loading, loader } = useUrlLoader<CatRes[]>(
      "https://api.thecatapi.com/v1/images/search?limit=1"
    );
    // const { res, loading, loader } = useUrlLoader<DogRes[]>(
    //   "https://dog.ceo/api/breeds/image/random"
    // );
    // useMousePos
    const { x, y } = useMousePos();
    // watch test
    const greetings = ref("");
    const updateGreeting = () => {
      greetings.value += "OFEII!";
    };
    watch([greetings, () => data.cnt, res], (newVal, oldVal) => {
      if (res.value) {
        console.log("value", res.value[0].url);
      }
      console.log("new", newVal);
      console.log("old", oldVal);
      document.title = `updated ${greetings.value}`;
    });
    const refData = toRefs(data);
    const modalIsOpen = ref(false);
    const openModal = () => {
      modalIsOpen.value = true;
    };
    const onModalClose = () => {
      modalIsOpen.value = false;
    };
    return {
      ...refData,
      greetings,
      updateGreeting,
      x,
      y,
      res,
      loading,
      loader,
      openModal,
      onModalClose,
      modalIsOpen
    };
  },
  components: {
    Modal
  }
});
</script>
