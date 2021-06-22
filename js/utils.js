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

function createHero(name) {
  const hero = {
    id: createHeroId(),
    name,
    ...createHeroPoint(),
  }
  return hero
}

export { createHero }
