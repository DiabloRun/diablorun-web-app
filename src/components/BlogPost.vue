<template>
  <div>
    <!-- Hero -->
    <section class="hero is-dark is-bold">
      <div class="hero-body">
        <div class="container">
          <div class="columns is-vcentered is-multiline is-mobile">
            <div class="column is-full-mobile">
              <h1 class="title">{{ $route.meta.title }}</h1>
            </div>
            <div class="column is-narrow-desktop has-text-right-tablet">
              <h1 class="subtitle has-hero-link">
                by
                <router-link
                  :to="{
                    name: 'User',
                    params: { user_name: $route.meta.author }
                  }"
                  >{{ $route.meta.author }}</router-link
                >
                on {{ $route.meta.date }}
              </h1>
            </div>
          </div>
        </div>
      </div>
    </section>
    <!-- Content -->
    <section class="section">
      <div class="container">
        <slot></slot>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'BlogPost'
};
</script>
