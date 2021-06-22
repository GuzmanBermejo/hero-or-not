const HeroRelation = Object.freeze({
  ALLY: 'ally',
  NEUTRAL: 'neutral',
  ARCHENEMY: 'archenemy',
})

const HeroRelationToColor = {
  [HeroRelation.ALLY]: '#32b643',
  [HeroRelation.NEUTRAL]: '#66758c',
  [HeroRelation.ARCHENEMY]: '#e85600',
}

const defaultHeroes = [
  {
    id: '0',
    name: 'Batman',
    x: 0.2,
    y: 0.3,
  },
  { id: '1', name: 'Robin', x: 0.8, y: 0.3 },
  { id: '2', name: 'The Joker', x: 0.5, y: 0.7 },
  { id: '3', name: 'Superman', x: 0.2, y: 0.7 },
]
const defaultHeroRelations = [
  {
    from: '0',
    to: '1',
    type: HeroRelation.ALLY,
  },
  {
    from: '1',
    to: '0',
    type: HeroRelation.NEUTRAL,
  },
  {
    from: '0',
    to: '2',
    type: HeroRelation.ARCHENEMY,
  },
  {
    from: '2',
    to: '0',
    type: HeroRelation.ARCHENEMY,
  },
  {
    from: '1',
    to: '2',
    type: HeroRelation.ARCHENEMY,
  },
  {
    from: '2',
    to: '1',
    type: HeroRelation.ARCHENEMY,
  },
]
export {
  HeroRelation,
  HeroRelationToColor,
  defaultHeroes,
  defaultHeroRelations,
}
