<template>
  <teleport to="#modal">
    <div id="center">
      <h1>this is a modal</h1>
    </div>
  </teleport>
</template>
<script>
export default {
  name: "modal"
};
</script>
<style>
#center {
  width: 200px;
  height: 200px;
  border: 2px solid black;
  background: white;
  position: fixed;
  left: 50%;
  top: 50%;
  margin-left: -100px;
  margin-top: -100px;
}
</style>
