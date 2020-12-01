export default {
  namespaced: true,
  state: {
    user: null
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
    }
  },
  actions: {
    async signIn({ commit }, access_token) {
      const res = await fetch(`${process.env.VUE_APP_API_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ access_token })
      });

      commit('setUser', await res.json());
      localStorage.setItem('diablorun_access_token', access_token);
    },

    signOut({ commit }) {
      commit('setUser', null);
      localStorage.removeItem('diablorun_access_token');
    }
  }
};
