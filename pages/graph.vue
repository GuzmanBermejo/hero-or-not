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
        <!-- https://observablehq.com/@d3/mobile-patent-suits -->
        <marker
          v-for="[relationId, relationType] in Object.entries(HeroeRelation)"
          :id="`arrow-${relationType}`"
          :key="relationId"
          viewBox="0 -5 10 10"
          refX="15"
          refY="-0.5"
          markerWidth="4"
          markerHeight="4"
          orient="auto"
        >
          <path
            :fill="HeroeRelationToColor[relationType]"
            d="M0,-5L10,0L0,5"
          ></path>
        </marker>
        <g>
          <rect width="1" height="1" fill="darkslateblue" />
          <path
            v-for="relation in heroesRelations"
            :key="JSON.stringify(relation)"
            :d="linkArc(getHeroe(relation.from), getHeroe(relation.to))"
            :stroke="HeroeRelationToColor[relation.type]"
            :marker-end="`url(#arrow-${relation.type}`"
            stroke-width="0.005"
            fill="none"
          ></path>
          <g
            v-for="hero in heroes"
            :key="hero.id"
            class="hero-node c-move"
            :hero-id="hero.id"
          >
            <circle :cx="hero.x" :cy="hero.y" fill="white" r="0.012"></circle>
            <text
              text-anchor="middle"
              fill="white"
              class="bold"
              :x="hero.x"
              :y="hero.y - (0.012 + 0.01)"
              :style="{
                fontSize: 0.001 + 'rem',
              }"
            >
              {{ hero.name }}
            </text>
            <text
              class="c-hand"
              text-anchor="middle"
              fill="white"
              :x="hero.x"
              :y="hero.y + (0.012 + 0.03)"
              :style="{
                fontSize: 0.002 + 'rem',
              }"
              @click.stop="clickNode(hero)"
            >
              +
            </text>
          </g>
        </g>
      </svg>
    </div>
    <aside id="zoom-controls">
      <button class="btn btn-sm" @click="zoomIn">
        <i class="icon icon-plus"></i>
      </button>
      <button class="btn btn-sm" @click="zoomOut">
        <i class="icon icon-minus"></i>
      </button>
    </aside>
    <aside id="hero-add" class="card">
      <header class="card-header">
        <div class="input-group">
          <input
            v-model="heroAddForm.name"
            class="form-input h5 card-title text-bold"
            type="text"
            placeholder="Name of hero"
          />
          <button
            class="btn btn-primary input-group-btn"
            :class="{ disabled: !heroAddForm.name.length }"
            @click="heroAdd"
          >
            <i class="icon icon-people"></i>+ Add
          </button>
        </div>
      </header>
    </aside>
    <aside id="relation-legend" class="card">
      <span
        v-for="[relationId, relationType] in Object.entries(HeroeRelation)"
        :key="relationId"
        class="p-2 chip"
        :style="{
          background: HeroeRelationToColor[relationType],
          color: '#fff',
        }"
        >{{ relationType }}</span
      >
    </aside>
  </main>
</template>

<script>
import * as d3 from 'd3'

function random(min, max) {
  return Math.random() * (max - min) + min
}

function createHeroId() {
  // TODO replace by something like UUID 4
  return Math.floor(random(0, 99999)).toString()
}

function createHeroPoint() {
  return {
    x: random(0.25, 0.75),
    y: random(0.25, 0.75),
  }
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

const clamp = d3.scaleLinear().domain([0, 1]).range([0, 1]).clamp(true)
export default {
  data() {
    return {
      height: 0,
      width: 0,
      d3Svg: null,
      d3Zoom: null,
      d3G: null,
      heroes: [
        {
          id: '0',
          name: 'Batman',
          x: 0.2,
          y: 0.3,
        },
        { id: '1', name: 'Robin', x: 0.8, y: 0.3 },
        { id: '2', name: 'The Joker', x: 0.5, y: 0.7 },
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
      heroAddForm: {
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

        const svg = d3.select('svg')
        this.d3Svg = svg

        const g = svg.select('g')
        this.d3G = g

        const that = this
        function zoomed({ transform }) {
          g.attr('transform', transform)
          that.update()
        }

        const zoom = d3
          .zoom()
          .extent([
            [0, 0],
            [1, 1],
          ])
          .scaleExtent([0.5, 1.5])
          .translateExtent([
            [-0.1, -0.1],
            [1.1, 1.1],
          ])
          .on('zoom', zoomed)

        svg.call(zoom)
        svg.call(zoom.scaleTo, 1)

        this.d3Zoom = zoom

        this.update()
      })
    },
    update() {
      function dragstarted() {
        d3.select(this).raise()
      }

      const that = this
      function dragged(event) {
        const hero = that.getHeroe(this.getAttribute('hero-id'))
        hero.x = clamp(event.x)
        hero.y = clamp(event.y)
      }

      function dragended() {
        that.update()
      }

      this.d3G
        .selectAll('.hero-node')
        .call(
          d3
            .drag()
            .on('start', dragstarted)
            .on('drag', dragged)
            .on('end', dragended)
        )
    },
    updateNextTick() {
      this.$nextTick(() => {
        this.update()
      })
    },
    zoomBy(amount) {
      if (this.d3Svg && this.d3Zoom)
        this.d3Svg.transition().call(this.d3Zoom.scaleBy, amount)
    },
    zoomIn() {
      this.zoomBy(1.25)
    },
    zoomOut() {
      this.zoomBy(0.8)
    },
    linkArc(point1, point2) {
      // https://observablehq.com/@d3/mobile-patent-suits
      const r = Math.hypot(point1.x - point2.x, point1.y - point2.y)
      return `
    M${point2.x},${point2.y}
    A${r},${r} 0 0,1 ${point1.x},${point1.y}
  `
    },
    clickNode(hero) {
      console.log(hero)
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

      this.resetHeroAddForm()
      this.resetRelationAddForm()
    },
    heroAdd() {
      const heroe = {
        id: createHeroId(),
        name: this.heroAddForm.name,
        ...createHeroPoint(),
      }
      this.heroes.push(heroe)

      this.heroeSelect(heroe)

      this.updateNextTick()
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
    resetHeroAddForm() {
      this.heroAddForm = {
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
.bold {
  font-weight: bold;
}

.graph-view {
  height: 100%;
  padding: 0;
  background-color: turquoise;
  position: relative;
}

#svg-container {
  height: 100%;
}

#zoom-controls {
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: flex;
  flex-flow: column nowrap;
}

#hero-add {
  position: absolute;
  bottom: 2rem;
  right: 1rem;
}

#relation-legend {
  position: absolute;
  top: 1rem;
  left: 1rem;
  display: flex;
  flex-flow: column nowrap;
  align-items: flex-start;
  padding: 0.2rem;
}

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
