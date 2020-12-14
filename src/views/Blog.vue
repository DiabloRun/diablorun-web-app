<template>
  <div>
    <!-- Hero -->
    <section class="hero is-primary is-bold">
      <div class="hero-body">
        <div class="container">
          <div class="columns is-vcentered is-multiline is-mobile">
            <div class="column">
              <h1 class="title is-1">Blog</h1>
            </div>
          </div>
        </div>
      </div>
    </section>
    <!-- Content -->
    <section class="section mt-5">
      <div class="container">
        <h1 class="title is-2">Latest Posts</h1>
        <div class="columns">
          <div class="column is-7">
            <BlogPostBox
              v-for="post of posts"
              :key="post.path"
              :post="post"
            ></BlogPostBox>
          </div>
          <div class="column">
            <div class="box">
              <h1 class="blog subtitle">Open access publishing</h1>
              <p>
                Anyone can contribute relevant blog posts through our
                <a href="https://github.com/DiabloRun" target="_blank">GitHub</a>. If you lack
                programming knowledge, but would like to contribute then contact
                us on <a href="https://discord.gg/QMMDR2a">Discord</a> and we can work it out together.
              </p>
            </div>
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
