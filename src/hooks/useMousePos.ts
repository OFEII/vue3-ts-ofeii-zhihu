import {
  computed,
  defineComponent,
  reactive,
  ref,
  toRefs,
  watch,
  onMounted,
  onUnmounted
} from "vue"

interface MousePos {
  x: number
  y: number
}

function useMousePos() {
  // mouse trace model-reactive
  const mouseData: MousePos = reactive({
    x: 0,
    y: 0
  })
  const updateMouse = (e: MouseEvent) => {
    mouseData.x = e.pageX;
    mouseData.y = e.pageY;
  };
  onMounted(() => {
    document.addEventListener("click", updateMouse)
  });
  onUnmounted(() => {
    document.removeEventListener("click", updateMouse)
  })
  const mouseRefData = toRefs(mouseData)
  return {
    ...mouseRefData
  }
  // mouse trace model-ref
  // const x = ref(0);
  // const y = ref(0);
  // const updateMouse = (e: MouseEvent) => {
  //   x.value = e.pageX;
  //   y.value = e.pageY;
  // };
  // onMounted(() => {
  //   document.addEventListener("click", updateMouse);
  // });
  // onUnmounted(() => {
  //   document.removeEventListener("click", updateMouse);
  // })
  // return {x, y}
}

export default useMousePos