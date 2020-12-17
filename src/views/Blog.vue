<template>
  <div>
    <!-- Hero -->
    <section class="hero is-medium is-dark is-bold">
      <div class="hero-body">
        <div class="container">
          <div class="columns is-vcentered is-multiline is-mobile">
            <div class="column">
              <h1 class="title">Latest articles</h1>
            </div>
          </div>
        </div>
      </div>
    </section>
    <!-- Articles -->
    <section class="section">
      <div class="container">
        <div class="columns">
          <div class="column is-8">
            <BlogPostBox
              v-for="post of posts"
              :key="post.path"
              :post="post"
            ></BlogPostBox>
          </div>
          <div class="column">
            <h1 class="title is-5 mb-3">Open access publishing</h1>
            <p>
              Anyone can contribute relevant blog posts through our
              <a href="https://github.com/DiabloRun" target="_blank">GitHub</a>.
              If you lack programming knowledge, but would like to contribute
              then contact us on
              <a href="https://discord.gg/QMMDR2a">Discord</a> and we can work
              it out together.
            </p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import posts from '@/router/blog';
import BlogPostBox from '@/components/BlogPostBox.vue';

export default {
  name: 'Blog',
  components: {
    BlogPostBox
  },
  data() {
    return {
      posts
    };
  }
};
</script>
