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
            <BlogPostBox v-for="post of posts" :key="post.path" :post="post"></BlogPostBox>
          </div>
          <div class="column"></div>
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