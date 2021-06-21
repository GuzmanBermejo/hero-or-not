<template>
  <main class="graph-view">
    <div id="svg-container" ref="svg-container">
      <svg
        ref="svg"
        viewBox="0,0,1,1"
        preserveAspectRatio="xMidYMid meet"
        :height="height"
        :width="width"
      >
        <rect width="1" height="1" fill="red" />
      </svg>
    </div>
  </main>
</template>

<script>
import * as d3 from 'd3'

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
      height: 0,
      width: 0,
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
      relationAddForm: {
        from: null,
        to: null,
        type: null,
      },
      whiteBackgroundImage: `url("data:image/svg+xml;charset=utf8,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%204%205'%3E%3Cpath%20fill='%23ffffff'%20d='M2%200L0%202h4zm0%205L0%203h4z'/%3E%3C/svg%3E")`,
    }
  },
  computed: {
    heroesSorted() {
      return [...this.heroes].sort((heroe1, heroe2) =>
        collatorCompare(heroe1.name, heroe2.name)
      )
    },
    isRelationAddFormIncomplete() {
      return Object.values(this.relationAddForm).includes(null)
    },
  },
  created() {
    this.HeroeRelation = HeroeRelation
    this.HeroeRelationToColor = HeroeRelationToColor
  },
  mounted() {
    console.log(d3)
    this.onResize()
  },
  destroyed() {
    window.removeEventListener('resize', this.onResize)
  },
  methods: {
    onResize() {
      window.addEventListener('resize', this.onResize)
      this.height = 0
      this.width = 0
      this.$nextTick(() => {
        const { height, width } =
          this.$refs['svg-container'].getBoundingClientRect()
        this.height = height
        this.width = width
      })
    },
    getHeroe(id) {
      return this.heroes.find((h) => h.id === id)
    },
    getHeroeRelations(heroe) {
      return this.heroesRelations.filter(
        (relation) => relation.to === heroe.id || relation.from === heroe.id
      )
    },
    getHeroeRelationsSorted(heroe) {
      return this.getHeroeRelations(heroe).sort((relation1, relation2) => {
        // Order by type
        if (relation1.type !== relation2.type) {
          const values = Object.values(HeroeRelation)
          return values.indexOf(relation1.type) - values.indexOf(relation2.type)
        }

        const isToEqual = relation1.to === relation2.to
        if (isToEqual && relation1.to === heroe.id)
          collatorCompare(relation1.from, relation2.from)

        const isFromEqual = relation1.from === relation2.from
        if (isFromEqual && relation1.from === heroe.id)
          collatorCompare(relation1.to, relation2.to)

        if (relation1.to === heroe.id) return -1
        else if (relation2.to === heroe.id) return 1
        else if (relation1.from === heroe.id) return 1
        else if (relation2.from === heroe.id) return -1

        return (
          collatorCompare(relation1.from, relation2.from) +
          collatorCompare(relation1.to, relation2.to)
        )
      })
    },
    heroeSelect(heroe) {
      this.heroeSelected = this.heroeSelected !== heroe ? heroe : null

      this.resetHeroeAddForm()
      this.resetRelationAddForm()
    },
    heroeAdd() {
      const heroe = {
        id: createHeroId(),
        name: this.heroeAddForm.name,
      }
      this.heroes.push(heroe)

      this.heroeSelect(heroe)
    },
    relationAdd() {
      const relation = this.relationAddForm

      if (this.isRelationAddFormIncomplete)
        throw new Error(
          `Cannot add a relation with missing values: ${JSON.stringify(
            relation
          )}`
        )
      if (relation.from === relation.to)
        throw new Error(`Cannot add an own relation for id: ${relation.from}`)

      this.heroesRelations = this.heroesRelations.filter(
        (r) => !(r.from === relation.from && r.to === relation.to)
      )
      this.heroesRelations.push(relation)

      this.resetRelationAddForm()
    },
    resetHeroeAddForm() {
      this.heroeAddForm = {
        name: '',
      }
    },
    resetRelationAddForm() {
      this.relationAddForm = {
        from: null,
        to: null,
        type: null,
      }
    },
    isText(relationType) {
      return relationType !== HeroeRelation.NEUTRAL ? 'is an' : 'is'
    },
    ofText(_) {
      return 'to'
    },
  },
}
</script>

<style>
.graph-view {
  height: 100%;
  padding: 0;
  background-color: turquoise;
}
#svg-container {
  height: 100%;
}

/* svg {
  height: 100%;
} */

/* .bold {
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
h5 {
  margin: 0;
}

ul {
  list-style-position: outside;
}

.card-header + .divider {
  margin-top: 0.8rem;
}

.card-body + .divider {
  margin-bottom: 0;
}

.select-white {
  background-image: url("data:image/svg+xml;charset=utf8,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%204%205'%3E%3Cpath%20fill='%23ffffff'%20d='M2%200L0%202h4zm0%205L0%203h4z'/%3E%3C/svg%3E") !important;
} */
</style>
