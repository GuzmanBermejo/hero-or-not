<template>
  <main id="graph-view">
    <div id="svg-container" ref="svg-container">
      <svg
        ref="svg"
        viewBox="0,0,1,1"
        preserveAspectRatio="xMidYMid meet"
        :height="height"
        :width="width"
        @mousemove="
          relationAddForm.from && relationAddForm.type && mouseMove($event)
        "
        @click="relationAddForm.from && mouseClick()"
      >
        <!-- https://observablehq.com/@d3/mobile-patent-suits -->
        <marker
          v-for="[relationId, relationType] in Object.entries(HeroRelation)"
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
            :fill="HeroRelationToColor[relationType]"
            d="M0,-5L10,0L0,5"
          ></path>
        </marker>
        <g>
          <rect width="1" height="1" fill="white" />
          <path
            v-for="relation in heroRelations"
            :key="JSON.stringify(relation)"
            :d="linkArc(getHero(relation.from), getHero(relation.to))"
            :stroke="HeroRelationToColor[relation.type]"
            :marker-end="`url(#arrow-${relation.type}`"
            stroke-width="0.005"
            fill="none"
          ></path>

          <path
            v-if="relationAddForm.from && cursor"
            :d="linkArc(getHero(relationAddForm.from), cursor)"
            :stroke="HeroRelationToColor[relationAddForm.type]"
            :marker-end="`url(#arrow-${relationAddForm.type}`"
            stroke-width="0.005"
            fill="none"
          ></path>

          <g
            v-for="hero in heroes"
            :key="hero.id"
            class="hero-node"
            :class="[relationAddForm.from && cursor ? 'c-hand' : 'c-move']"
            :hero-id="hero.id"
            @click.stop="
              relationAddForm.from && cursor && clickNode(hero, $event)
            "
          >
            <circle :cx="hero.x" :cy="hero.y" fill="#303742" r="0.012"></circle>
            <text
              text-anchor="middle"
              fill="#303742"
              class="bold"
              :x="hero.x"
              :y="hero.y - (0.012 + 0.01)"
              :style="{
                fontSize: 0.001 + 'rem',
              }"
            >
              {{ hero.name }}
            </text>
            <!-- Plus arrow by Roundicons.com from the Noun Project -->
            <g
              v-if="!(relationAddForm.from && relationAddForm.type)"
              :transform="`translate(${hero.x - 0.025},${
                hero.y + 0.015
              }) scale(0.02)`"
              class="c-hand"
              @click.stop="clickNode(hero, $event)"
            >
              <path
                d="M0.587096 1.38101L0.587096 0.323995C0.587096 0.230134 0.666033 0.125061 0.771636 0.125061L1.6904 0.125061C1.796 0.125061 1.87494 0.230134 1.87494 0.323995L1.87494 1.38101C1.87494 1.42821 1.85388 1.47555 1.81706 1.51086L1.35503 1.95001C1.28511 2.01668 1.17556 2.01668 1.10572 1.94994L0.645048 1.51101C0.608156 1.47555 0.587096 1.42821 0.587096 1.38101Z"
                fill="#5755D9"
              />
              <path
                d="M0.85224 0.844736C0.85224 0.823827 0.869209 0.806858 0.890117 0.806858L1.57192 0.806858C1.59283 0.806858 1.60979 0.823827 1.60979 0.844736C1.60979 0.865644 1.59283 0.882614 1.57192 0.882614L0.890117 0.882614C0.869209 0.882614 0.85224 0.865644 0.85224 0.844736Z"
                fill="white"
              />
              <path
                d="M1.19314 1.18563L1.19314 0.503835C1.19314 0.482927 1.21011 0.465958 1.23102 0.465958C1.25193 0.465958 1.26889 0.482927 1.26889 0.503835L1.26889 1.18563C1.26889 1.20654 1.25193 1.22351 1.23102 1.22351C1.21011 1.22351 1.19314 1.20654 1.19314 1.18563Z"
                fill="white"
              />
            </g>
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
      <button
        v-if="!heroes.length"
        class="btn btn-link"
        @click="loadDefaultData"
      >
        Load default heroes
      </button>

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
        v-for="[relationId, relationType] in Object.entries(HeroRelation)"
        :key="relationId"
        class="p-2 chip"
        :style="{
          background: HeroRelationToColor[relationType],
          color: '#fff',
        }"
        >{{ relationType }}</span
      >
    </aside>
    <aside
      v-if="relationAddForm.from && relationAddForm.type === null"
      id="relation-add"
      :style="relationAddStyle"
      class="accordion card"
    >
      <input
        id="accordion"
        type="checkbox"
        name="accordion-checkbox"
        hidden=""
        checked=""
      />
      <label class="accordion-header c-hand" for="accordion"
        >New relation</label
      >
      <div class="accordion-body">
        <ul class="menu menu-nav">
          <li
            v-for="[relationId, relationType] in Object.entries(HeroRelation)"
            :key="relationId"
            class="menu-item"
          >
            <button
              class="btn btn-sm"
              :style="{
                color: HeroRelationToColor[relationType],
                'border-color': HeroRelationToColor[relationType],
              }"
              @click="relationAddForm.type = relationType"
            >
              {{ relationType }}
            </button>
          </li>
        </ul>
      </div>
    </aside>
  </main>
</template>

<script>
import { select, pointer } from 'd3-selection'
import { zoom } from 'd3-zoom'
import { drag } from 'd3-drag'
import { scaleLinear } from 'd3-scale'

import { createHero } from '~/js/utils'
import {
  HeroRelation,
  HeroRelationToColor,
  defaultHeroes,
  defaultHeroRelations,
} from '~/js/constants'

const clamp = scaleLinear().domain([0, 1]).range([0, 1]).clamp(true)
export default {
  data() {
    return {
      height: 0,
      width: 0,
      d3Svg: null,
      d3Zoom: null,
      d3G: null,
      heroes: [],
      heroRelations: [],
      heroAddForm: {
        name: '',
      },
      relationAddForm: {
        from: null,
        to: null,
        type: null,
      },
      relationAddStyle: {},
      cursor: null,
    }
  },
  computed: {
    isRelationAddFormIncomplete() {
      return Object.values(this.relationAddForm).includes(null)
    },
  },
  created() {
    this.HeroRelation = HeroRelation
    this.HeroRelationToColor = HeroRelationToColor
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

        const svg = select('svg')
        this.d3Svg = svg

        const g = svg.select('g')
        this.d3G = g

        const that = this
        function zoomed({ transform }) {
          g.attr('transform', transform)
          that.update()
        }

        const d3Zoom = zoom()
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

        svg.call(d3Zoom)
        svg.call(d3Zoom.scaleTo, 1)

        this.d3Zoom = d3Zoom

        this.update()
      })
    },
    update() {
      function dragstarted() {
        select(this).raise()
      }

      const that = this
      function dragged(event) {
        const hero = that.getHero(this.parentNode.getAttribute('hero-id'))
        hero.x = clamp(event.x)
        hero.y = clamp(event.y)
      }

      function dragended() {
        that.update()
      }

      this.d3G
        .selectAll('.hero-node text, .hero-node circle')
        .call(
          drag()
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
    linkArc(from, to) {
      // https://observablehq.com/@d3/mobile-patent-suits
      const r = Math.hypot(to.x - from.x, to.y - from.y)
      return `
    M${from.x},${from.y}
    A${r},${r} 0 0,1 ${to.x},${to.y}
  `
    },
    clickNode(hero, event) {
      if (
        this.relationAddForm.from &&
        this.relationAddForm.type &&
        hero.id !== this.relationAddForm.from
      ) {
        this.relationAddForm.to = hero.id
        this.relationAdd()
        this.resetCursor()
      } else if (
        !this.relationAddForm.from ||
        (hero.id !== this.relationAddForm.from && !this.relationAddForm.type)
      ) {
        this.relationAddStyle = {
          top: `${event.clientY}px`,
          left: `${event.clientX}px`,
        }
        this.relationAddForm.from = hero.id
      } else {
        this.resetRelationAddForm()
        this.resetCursor()
      }

      this.updateNextTick()
    },
    mouseMove(event) {
      const [x, y] = pointer(event, this.d3G.node())
      this.cursor = { x, y }
    },
    mouseClick() {
      this.resetRelationAddForm()
      this.resetCursor()
    },
    resetCursor() {
      this.cursor = null
    },
    getHero(id) {
      return this.heroes.find((hero) => hero.id === id)
    },
    heroAdd() {
      const hero = createHero(this.heroAddForm.name)

      this.heroes.push(hero)

      this.resetHeroAddForm()

      this.updateNextTick()
    },
    relationAdd() {
      const relation = this.relationAddForm

      if (this.isRelationAddFormIncomplete)
        // TODO show error on UI
        throw new Error(
          `Cannot add a relation with missing values: ${JSON.stringify(
            relation
          )}`
        )
      if (relation.from === relation.to)
        // TODO show error on UI
        throw new Error(`Cannot add an own relation for id: ${relation.from}`)

      this.heroRelations = this.heroRelations.filter(
        (r) => !(r.from === relation.from && r.to === relation.to)
      )
      this.heroRelations.push(relation)

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
    loadDefaultData() {
      this.heroes = [...defaultHeroes]
      this.heroRelations = [...defaultHeroRelations]
    },
  },
}
</script>

<style>
.bold {
  font-weight: bold;
}

#graph-view {
  height: 100%;
  padding: 0;
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

#relation-legend {
  position: absolute;
  top: 1rem;
  left: 1rem;
  display: flex;
  flex-flow: column nowrap;
  align-items: flex-start;
  padding: 0.2rem;
  background-color: #f7f8f9;
}

#hero-add {
  position: absolute;
  bottom: 2rem;
  right: 1rem;
}

#hero-add button:first-of-type {
  align-self: flex-end;
}

#relation-add {
  position: absolute;
  z-index: 1;
  transform: translate(-50%, -33%);
  border-color: #5755d9;
}
</style>
