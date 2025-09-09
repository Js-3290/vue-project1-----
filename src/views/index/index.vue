<script setup>

</script>

<template>
  <div class="hero">
    <img src="@/assets/back.png" class="hero-img">
  </div>
</template>

<style scoped>
.hero {
  width: 100%;
  height: calc(100vh - 100px);
  overflow: hidden;
}

.hero-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  display: block;
}
</style>
