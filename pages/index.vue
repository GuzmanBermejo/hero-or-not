<template>
  <main class="container">
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
              v-model="heroeAddForm.name"
              class="form-input h5 card-title text-bold"
              type="text"
              placeholder="Name of heroe"
            />
            <button
              class="btn btn-primary input-group-btn"
              :class="{ disabled: !heroeAddForm.name.length }"
              @click="heroeAdd"
            >
              <i class="icon icon-people"></i>+ Add
            </button>
          </div>
        </header>
      </li>
    </ol>
  </main>
</template>

<script>
function createHeroId() {
  // TODO replace by something like UUID 4
  return Math.floor(Math.random() * 99999).toString()
}
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
      heroeAddForm: {
        name: '',
      },
    }
  },
  methods: {
    heroeAdd() {
      const heroe = {
        id: createHeroId(),
        name: this.heroeAddForm.name,
      }
      this.heroes.push(heroe)

      this.heroeAddForm.name = ''
    },
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
