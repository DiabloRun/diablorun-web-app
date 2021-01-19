<template>
  <v-col cols="12" class="pt-4">
    <v-card color="darkAccent" class="fill-height">
      <v-row no-gutters>
        <v-col>
          <v-card-title>
            <router-link :to="post.path">
              {{ post.meta.title }}
            </router-link>
          </v-card-title>
          <v-card-subtitle class="white--text">
            {{ post.meta.intro }}
          </v-card-subtitle>
          <v-card-text class="grey--text">
            By
            <router-link
              :to="{
                name: 'User',
                params: { user_name: post.meta.author }
              }"
            >
              {{ post.meta.author }}
            </router-link>
            on {{ post.meta.date }}
            <!--
            <span v-for="tag of post.meta.tags" :key="tag" class="tag is-light">
              <a>{{ tag }}</a>
            </span>
            -->
          </v-card-text>
        </v-col>
      </v-row>
    </v-card>
  </v-col>
</template>
<script>
export default {
  name: 'BlogPostBox',
  props: ['post']
};
</script>
