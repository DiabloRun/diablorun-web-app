<template>
  <v-container>
    <v-card>
      <v-card-title>
        <v-icon left>mdi-book-open-variant</v-icon>
        Latest articles
      </v-card-title>
      <v-divider></v-divider>
      <v-row no-gutters class="px-4 pb-4">
        <BlogPostBox
          v-for="post of posts"
          :key="post.path"
          :post="post"
        ></BlogPostBox>
      </v-row>
    </v-card>
  </v-container>
</template>

<script>
import posts from '@/router/wiki';
import BlogPostBox from '@/components/BlogPostBox.vue';

export default {
  name: 'Wiki',
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
