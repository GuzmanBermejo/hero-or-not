<template>
  <div id="wrapper" class="bg-secondary">
    <header class="bg-primary">
      <div class="navbar">
        <nav class="navbar-section">
          <a class="navbar-brand text-light text-bold mr-2" href="/"
            >🦸 Hero or not 🦹</a
          >
        </nav>
      </div>
    </header>
    <div id="content">
      <Nuxt />
    </div>
  </div>
</template>

<style>
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
}

#wrapper > * {
  margin: 0 auto;
  max-width: 960px;
}

/* @media (min-width: 960px) {
  #wrapper > * {
    border: 1px solid #bcc3ce;
    border-width: 0 1px;
  }
} */

.navbar {
  padding: 1rem 2rem;
}
#content {
  background: white;
  padding-top: 2rem;
  width: 100%;
}
</style>
