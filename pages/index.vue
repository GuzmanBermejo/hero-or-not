<template>
  <div class="container">
    <ol>
      <li v-for="heroe in heroes" :key="heroe.id">{{ heroe.name }}</li>
    </ol>
  </div>
</template>

<script>
export default {
  data() {
    return {
      heroes: [
        {
          id: '0',
          name: 'Batman',
        },
        { id: '1', name: 'Robin' },
        { id: '2', name: 'The Joker' },
      ],
    }
  },
}
</script>

<style>
.container {
  margin: 0 auto;
  min-height: 100vh;
  max-width: 960px;
}
</style>
