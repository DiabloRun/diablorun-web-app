<template>
  <div class="box">
    <div class="content is-medium">
      <h1 class="title is-1 pb-3">
        <router-link :to="post.path">
          {{ post.meta.title }}
        </router-link>
      </h1>
      <h1 class="subtitle is-6">
        By
        <router-link
          :to="{
            name: 'User',
            params: { user_name: post.meta.author }
          }"
          >{{ post.meta.author }}</router-link
        >
        on {{ post.meta.date }}
      </h1>
      <p>{{ post.meta.intro }}</p>
      <div class="tags pt-1">
        <span
          v-for="tag of post.meta.tags"
          :key="tag"
          class="tag is-medium is-light"
          ><a>{{ tag }}</a></span
        >
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BlogPostBox',
  props: ['post']
};
</script>
