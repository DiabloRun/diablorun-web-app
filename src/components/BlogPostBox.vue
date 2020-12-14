<template>
  <div class="box">
    <div class="content is-medium">
      <h1 class="title is-3 mb-3">
        <router-link :to="post.path">
          {{ post.meta.title }}
        </router-link>
      </h1>
      <p>{{ post.meta.intro }}</p>
      <div class="columns is-multiline is-vcentered">
        <div class="column is-narrow">
          <div class="tags">
            <span
              v-for="tag of post.meta.tags"
              :key="tag"
              class="tag is-medium is-light"
              ><a>{{ tag }}</a></span
            >
          </div>
        </div>
        <div class="column is-narrow">
          <p class="is-size-7 has-text-grey">
            By
            <router-link
              :to="{
                name: 'User',
                params: { user_name: post.meta.author }
              }"
              >{{ post.meta.author }}</router-link
            >
            on {{ post.meta.date }}
          </p>
        </div>
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
