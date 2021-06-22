<template>
  <div id="wrapper" class="bg-secondary">
    <header class="bg-primary">
      <div class="navbar">
        <nav class="navbar-section">
          <a class="navbar-brand text-light text-bold mr-2" href="/"
            >🦸 Hero or not 🦹</a
          >
        </nav>
        <nav class="navbar-section toggle btn-group">
          <NuxtLink
            to="/"
            class="btn btn-sm"
            :class="{ 'btn-success': 'index' === currentRouteName }"
            ><i class="icon icon-menu"></i> Lista</NuxtLink
          >
          <NuxtLink
            to="/graph"
            class="btn btn-sm"
            :class="{ 'btn-success': 'graph' === currentRouteName }"
            >Grafo<i class="icon icon-location"></i
          ></NuxtLink>
        </nav>
      </div>
    </header>
    <div id="content">
      <Nuxt />
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return { currentRouteName: null }
  },
  watch: {
    $route(to) {
      this.currentRouteName = to.name
    },
  },
  created() {
    this.currentRouteName = this?.$router?.currentRoute?.name
  },
}
</script>

<style>
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
}

html,
body,
#wrapper,
#__nuxt,
#__layout {
  height: 100%;
}
#wrapper {
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
}

#wrapper > * {
  max-width: 960px;
  width: 100%;
}

/* @media (min-width: 960px) {
  #wrapper > * {
    border: 1px solid #bcc3ce;
    border-width: 0 1px;
  }
} */

.navbar {
  padding: 1rem 2rem;
  width: 100%;
}
#content {
  background: white;
  width: 100%;
  flex-grow: 1;

  /* padding-top: 2rem; */
}
</style>
