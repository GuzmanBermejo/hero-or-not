<template>
  <main class="container">
    <ol>
      <li v-for="heroe in heroesSorted" :key="heroe.id" class="card">
        <header class="card-header c-hand" @click="heroeSelect(heroe)">
          <h5 class="card-title text-bold text-ellipsis">{{ heroe.name }}</h5>
          <i
            class="icon text-primary"
            :class="[
              heroe === heroeSelected ? 'icon-arrow-up' : 'icon-arrow-down',
            ]"
          ></i>
        </header>
        <section v-if="heroe === heroeSelected" class="card-body">
          <h6 class="chip">Relations</h6>
          <ul>
            <li
              v-for="relation in getHeroeRelations(heroe)"
              :key="`${relation.from}->${relation.to}`"
            >
              <span
                class="text-ellipsis"
                :class="{ bold: relation.from !== heroe.id }"
                >{{ getHeroe(relation.from).name }}</span
              >
              <span> is </span>
              <span
                class="p-1"
                :style="{
                  background: HeroeRelationToColor[relation.type],
                  color: '#fff',
                }"
                >{{ relation.type }}</span
              >
              <span>
                {{ relation.type !== HeroeRelation.NEUTRAL ? 'of' : 'to' }}
              </span>
              <span
                class="text-ellipsis"
                :class="{ bold: relation.to !== heroe.id }"
                >{{ getHeroe(relation.to).name }}</span
              >
            </li>
          </ul>
        </section>
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

const collatorCompare = new Intl.Collator('en').compare

const HeroeRelation = Object.freeze({
  ALLY: 'ally',
  NEUTRAL: 'neutral',
  ARCHENEMY: 'archenemy',
})

const HeroeRelationToColor = {
  [HeroeRelation.ALLY]: '#32b643',
  [HeroeRelation.NEUTRAL]: '#66758c',
  [HeroeRelation.ARCHENEMY]: '#e85600',
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
      heroesRelations: [
        {
          from: '0',
          to: '1',
          type: HeroeRelation.ALLY,
        },
        {
          from: '1',
          to: '0',
          type: HeroeRelation.NEUTRAL,
        },
        {
          from: '0',
          to: '2',
          type: HeroeRelation.ARCHENEMY,
        },
        {
          from: '2',
          to: '0',
          type: HeroeRelation.ARCHENEMY,
        },
        {
          from: '1',
          to: '2',
          type: HeroeRelation.ARCHENEMY,
        },
        {
          from: '2',
          to: '1',
          type: HeroeRelation.ARCHENEMY,
        },
      ],
      heroeSelected: null,
      heroeAddForm: {
        name: '',
      },
    }
  },
  computed: {
    heroesSorted() {
      return [...this.heroes].sort((heroe1, heroe2) =>
        collatorCompare(heroe1.name, heroe2.name)
      )
    },
  },
  created() {
    this.HeroeRelation = HeroeRelation
    this.HeroeRelationToColor = HeroeRelationToColor
  },
  methods: {
    getHeroe(id) {
      return this.heroes.find((h) => h.id === id)
    },
    getHeroeRelations(heroe) {
      return this.heroesRelations.filter(
        (relation) => relation.to === heroe.id || relation.from === heroe.id
      )
    },
    heroeSelect(heroe) {
      this.heroeSelected = this.heroeSelected !== heroe ? heroe : null
    },
    heroeAdd() {
      const heroe = {
        id: createHeroId(),
        name: this.heroeAddForm.name,
      }
      this.heroes.push(heroe)

      this.heroeAddForm.name = ''

      this.heroeSelect(heroe)
    },
  },
}
</script>

<style>
.bold {
  font-weight: bold;
}

.container {
  margin: 0 auto;
  min-height: 100vh;
  max-width: 600px;
}
ol {
  margin: 0;
}
header {
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: space-between;
}

ul {
  list-style-position: outside;
}
</style>
