<template>
  <main id="list-view">
    <section v-if="!heroes.length" class="empty">
      <div class="empty-icon">
        <i class="icon icon-people"></i>
      </div>
      <p class="empty-title h5">You have no heroes</p>
      <p class="empty-subtitle">
        Go ahead and add one now or
        <button class="btn btn-link" @click="loadDefaultData">
          load some defaults
        </button>
      </p>
    </section>
    <ol>
      <li v-for="hero in heroesSorted" :key="hero.id" class="card">
        <header class="card-header c-hand" @click="heroSelect(hero)">
          <h5 class="card-title text-bold text-ellipsis">{{ hero.name }}</h5>
          <i
            class="icon text-primary"
            :class="[
              hero === heroSelected ? 'icon-arrow-up' : 'icon-arrow-down',
            ]"
          ></i>
        </header>
        <template v-if="hero === heroSelected">
          <div class="divider"></div>
          <section class="card-body">
            <h6 class="p-2 chip bg-dark">Relations</h6>
            <ul>
              <li
                v-for="relation in getHeroRelationsSorted(hero)"
                :key="`${relation.from}->${relation.to}`"
              >
                <span
                  class="text-ellipsis"
                  :class="{ bold: relation.from !== hero.id }"
                  >{{ getHero(relation.from).name }}</span
                >
                <span> {{ isText(relation.type) }} </span>
                <span
                  class="p-2 chip"
                  :style="{
                    background: HeroRelationToColor[relation.type],
                    color: '#fff',
                  }"
                  >{{ relation.type }}</span
                >
                <span>
                  {{ ofText(relation.type) }}
                </span>
                <span
                  class="text-ellipsis"
                  :class="{ bold: relation.to !== hero.id }"
                  >{{ getHero(relation.to).name }}</span
                >
              </li>
            </ul>
          </section>
          <div class="divider"></div>
          <footer class="card-footer">
            <div>
              <a href="#relation-modal" class="btn btn-sm"
                ><i class="icon icon-resize-horiz"></i> Add relation</a
              >
              <div id="relation-modal" class="modal modal-sm">
                <a
                  href="#modals-sizes"
                  aria-label="Close"
                  class="modal-overlay"
                ></a>
                <div role="document" class="modal-container">
                  <div class="modal-header">
                    <a
                      href="#modals-sizes"
                      aria-label="Close"
                      class="btn btn-clear float-right"
                    ></a>
                    <div class="modal-title h5">New relation</div>
                  </div>
                  <div class="modal-body">
                    <form>
                      <div class="form-group">
                        <label class="form-label">Hero</label>
                        <select
                          v-model="relationAddForm.from"
                          class="form-select"
                        >
                          <option disabled value="">Select a hero</option>
                          <option
                            v-for="heroFrom in heroesSorted.filter(
                              (h) => h.id !== relationAddForm.to
                            )"
                            :key="heroFrom.id"
                            :value="heroFrom.id"
                            class="text-ellipsis"
                          >
                            {{ heroFrom.name }}
                          </option>
                        </select>
                      </div>
                      <div class="form-group">
                        <label class="form-label">{{
                          isText(relationAddForm.type)
                        }}</label>
                        <select
                          v-model="relationAddForm.type"
                          class="form-select"
                          :style="
                            relationAddForm.type !== null
                              ? {
                                  color: '#fff',
                                  'background-color':
                                    HeroRelationToColor[relationAddForm.type],
                                  'background-image': whiteBackgroundImage,
                                }
                              : {}
                          "
                        >
                          <option
                            v-for="[relationId, relationType] in Object.entries(
                              HeroRelation
                            )"
                            :key="relationId"
                            :value="relationType"
                          >
                            {{ relationType }}
                          </option>
                        </select>
                      </div>
                      <div class="form-group">
                        <label class="form-label">{{
                          ofText(relationAddForm.type)
                        }}</label>
                        <select
                          v-model="relationAddForm.to"
                          class="form-select"
                        >
                          <option disabled value="">Select a hero</option>
                          <option
                            v-for="heroTo in heroesSorted.filter(
                              (h) => h.id !== relationAddForm.from
                            )"
                            :key="heroTo.id"
                            :value="heroTo.id"
                            class="text-ellipsis"
                          >
                            {{ heroTo.name }}
                          </option>
                        </select>
                      </div>
                    </form>
                  </div>
                  <div class="modal-footer">
                    <a
                      href="#modals-sizes"
                      class="btn btn-primary column col-12"
                      :class="{
                        disabled: isRelationAddFormIncomplete,
                      }"
                      @click="relationAdd"
                      ><i class="icon icon-resize-horiz"></i> Add relation</a
                    >
                  </div>
                </div>
              </div>
            </div>
          </footer>
        </template>
      </li>
      <li class="card">
        <header class="card-header">
          <div class="input-group col-12">
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
      </li>
    </ol>
  </main>
</template>

<script>
import { createHero } from '~/js/utils'
import {
  HeroRelation,
  HeroRelationToColor,
  defaultHeroes,
  defaultHeroRelations,
} from '~/js/constants'

const collatorCompare = new Intl.Collator('en').compare
const whiteBackgroundImage = `url("data:image/svg+xml;charset=utf8,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%204%205'%3E%3Cpath%20fill='%23ffffff'%20d='M2%200L0%202h4zm0%205L0%203h4z'/%3E%3C/svg%3E")`

export default {
  data() {
    return {
      heroes: [],
      heroRelations: [],
      heroSelected: null,
      heroAddForm: {
        name: '',
      },
      relationAddForm: {
        from: null,
        to: null,
        type: null,
      },
    }
  },
  computed: {
    heroesSorted() {
      return [...this.heroes].sort((hero1, hero2) =>
        collatorCompare(hero1.name, hero2.name)
      )
    },
    isRelationAddFormIncomplete() {
      return Object.values(this.relationAddForm).includes(null)
    },
  },
  created() {
    this.HeroRelation = HeroRelation
    this.HeroRelationToColor = HeroRelationToColor
    this.whiteBackgroundImage = whiteBackgroundImage
  },
  methods: {
    getHero(id) {
      return this.heroes.find((hero) => hero.id === id)
    },
    getHeroRelations(hero) {
      return this.heroRelations.filter(
        (relation) => relation.to === hero.id || relation.from === hero.id
      )
    },
    getHeroRelationsSorted(hero) {
      return this.getHeroRelations(hero).sort((relation1, relation2) => {
        // Order by type
        if (relation1.type !== relation2.type) {
          const values = Object.values(HeroRelation)
          return values.indexOf(relation1.type) - values.indexOf(relation2.type)
        }

        const isToEqual = relation1.to === relation2.to
        if (isToEqual && relation1.to === hero.id)
          collatorCompare(relation1.from, relation2.from)

        const isFromEqual = relation1.from === relation2.from
        if (isFromEqual && relation1.from === hero.id)
          collatorCompare(relation1.to, relation2.to)

        if (relation1.to === hero.id) return -1
        else if (relation2.to === hero.id) return 1
        else if (relation1.from === hero.id) return 1
        else if (relation2.from === hero.id) return -1

        return (
          collatorCompare(relation1.from, relation2.from) +
          collatorCompare(relation1.to, relation2.to)
        )
      })
    },
    heroSelect(hero) {
      this.heroSelected = this.heroSelected !== hero ? hero : null

      this.resetHeroAddForm()
      this.resetRelationAddForm()
    },
    heroAdd() {
      const hero = createHero(this.heroAddForm.name)
      this.heroes.push(hero)

      this.resetHeroAddForm()

      this.heroSelect(hero)
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
    isText(relationType) {
      return relationType !== HeroRelation.NEUTRAL ? 'is an' : 'is'
    },
    ofText(_) {
      return 'to'
    },
    loadDefaultData() {
      this.heroes = defaultHeroes
      this.heroRelations = defaultHeroRelations
    },
  },
}
</script>

<style>
.bold {
  font-weight: bold;
}

#list-view {
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

.empty {
  margin: 1rem 0 3rem 0;
}

.empty-subtitle button {
  vertical-align: baseline;
  padding-left: 0;
}
</style>
