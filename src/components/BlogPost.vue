<template>
  <div>
    <!-- Hero -->
    <section class="hero is-primary is-bold">
      <div class="hero-body">
        <div class="container">
          <div class="columns is-vcentered is-multiline is-mobile">
            <div class="column">
              <h1 class="title is-1">{{ $route.meta.title }}</h1>
            </div>
            <div class="column is-narrow">
              <h1 class="subtitle">Published by {{ $route.meta.author }} on {{ $route.meta.date }}</h1>
            </div>
          </div>
        </div>
      </div>
    </section>
    <!-- Content -->
    <section class="section mt-5">
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