<template>
  <div>
      <div v-for="user of activeUsers" :key="user.id" class="box">
          {{ user.level }}
          <router-link :to="{
              name: 'User',
              params: {
                  user_name: user.user_name,
              }
          }">{{ user.user_name }}</router-link>


      </div>
  </div>
</template>

<script>
export default {
    name: "ActiveUsers",
    data() {
        return {
            activeUsers: []
        }
    },
    async mounted() {
        await this.pullActiveUsers()
        this.interval = setInterval(() => this.pullActiveUsers(), 10000);
    },
    destroyed() {
        clearInterval(this.interval);
    },
    methods: {
        async pullActiveUsers() {
            const res = await fetch(
                `${process.env.VUE_APP_API_URL}/active-users`
            );
            this.activeUsers = await res.json()
            console.log(this.activeUsers)
        }
    }
}
</script>