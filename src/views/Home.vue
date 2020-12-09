<template>
  <div class="profile">
    <!-- Hero  -->
    <section class="hero has-bg-1 is-medium">
      <div class="hero-body">
        <div class="container">
          <div class="columns is-vcentered is-multiline is-mobile">
            <div class="column is-full-mobile">
              <h1 class="title is-2 pb-3">Welcome!</h1>
              <h1 class="subtitle is-5">
                Diablo.run is an
                <a href="https://github.com/diablorun">open source</a> project
                for Diablo enthusiasts. Join our
                <a href="https://discord.gg/QMMDR2a">Discord</a> and support us
                by
                <a href="https://www.patreon.com/diablorun"
                  >becoming a Patreon</a
                >!
              </h1>
            </div>
            <div class="column is-narrow-tablet">
              <router-link :to="{ name: 'Setup' }">
              <button class="button is-medium is-outlined is-primary is-inverted has-glow">Diablo.run Setup</button>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </section>
    <!-- Toolbar -->
    <section class="hero is-dark">
      <div class="hero-body">
        <div class="container">
          <div class="columns is-multiline is-mobile">
            <div class="column is-narrow">
              <h1 class="subtitle is-4">
                201 Users
              </h1>
            </div>
            <div class="column is-narrow">
              <h1 class="subtitle is-4">
                213 Characters
              </h1>
            </div>
            <div class="column is-narrow">
              <h1 class="subtitle is-4">
                98123 Speedruns
              </h1>
            </div>
          </div>
        </div>
      </div>
    </section>
    <!-- Content -->
    <section class="section mt-5">
      <div class="container">
        <div class="columns">
          <div class="column">
            <h1 class="title is-4">Speedruns</h1>
          </div>
          <div class="column is-narrow">
            <p class="subtitle is-5">
              <router-link :to="{ name: 'Leaderboard' }">
                Speedrunning leaderboard
              </router-link>
            </p>
          </div>
        </div>
        <div class="columns">
          <div class="column is-6">
            <div class="box">
              <h1 class="subtitle is-4">Latest</h1>
            </div>
          </div>
          <div class="column is-6">
            <div class="box">
              <h1 class="subtitle is-4">Fresh World Records</h1>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
