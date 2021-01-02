<template>
  <img :src="result && result.url" />
</template>

<script lang="ts">
import axios from "axios";
import { defineComponent } from "vue";
export default defineComponent({
  async setup() {
    const rawData = await axios.get(
      "https://api.thecatapi.com/v1/images/search?limit=1"
    );
    return {
      result: rawData.data[0]
    };
  }
});
</script>
