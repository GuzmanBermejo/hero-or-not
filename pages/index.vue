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
        <template v-if="heroe === heroeSelected">
          <div class="divider"></div>
          <section class="card-body">
            <h6 class="p-2 chip bg-dark">Relations</h6>
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
                <span> {{ isText(relation.type) }} </span>
                <span
                  class="p-2 chip"
                  :style="{
                    background: HeroeRelationToColor[relation.type],
                    color: '#fff',
                  }"
                  >{{ relation.type }}</span
                >
                <span>
                  {{ ofText(relation.type) }}
                </span>
                <span
                  class="text-ellipsis"
                  :class="{ bold: relation.to !== heroe.id }"
                  >{{ getHeroe(relation.to).name }}</span
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
                        <label class="form-label">Heroe</label>
                        <select
                          v-model="relationAddForm.from"
                          class="form-select"
                        >
                          <option disabled value="">Select a heroe</option>
                          <option
                            v-for="heroeFrom in heroesSorted.filter(
                              (h) => h.id !== relationAddForm.to
                            )"
                            :key="heroeFrom.id"
                            :value="heroeFrom.id"
                            class="text-ellipsis"
                          >
                            {{ heroeFrom.name }}
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
                          :class="{
                            //'select-white': relationAddForm.type !== null,
                          }"
                          :style="
                            relationAddForm.type !== null
                              ? {
                                  color: '#fff',
                                  'background-color':
                                    HeroeRelationToColor[relationAddForm.type],
                                  'background-image': whiteBackgroundImage,
                                }
                              : {}
                          "
                        >
                          <option
                            v-for="[relationId, relationType] in Object.entries(
                              HeroeRelation
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
                          <option disabled value="">Select a heroe</option>
                          <option
                            v-for="heroeTo in heroesSorted.filter(
                              (h) => h.id !== relationAddForm.from
                            )"
                            :key="heroeTo.id"
                            :value="heroeTo.id"
                            class="text-ellipsis"
                          >
                            {{ heroeTo.name }}
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
    ofText(relationType) {
      return relationType !== HeroeRelation.NEUTRAL ? 'of' : 'to'
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
}
</style>
