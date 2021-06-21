<template>
  <div class="container">
    <ol>
      <li v-for="heroe in heroes" :key="heroe.id" class="card">
        <header class="card-header c-hand">
          <h5 class="card-title text-bold text-ellipsis">{{ heroe.name }}</h5>
        </header>
      </li>
      <li class="card">
        <header class="card-header">
          <div class="input-group">
            <input
              class="form-input h5 card-title text-bold"
              type="text"
              placeholder="Name of heroe"
            />
            <button class="btn btn-primary input-group-btn">
              <i class="icon icon-people"></i>+ Add
            </button>
          </div>
        </header>
      </li>
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
  max-width: 600px;
}
ol {
  margin: 0;
}
</style>
