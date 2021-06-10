export default {
  namespaced: true,
  state: {
    loading: true,
    characters: [],
    users: 0,
    filters: {
      d2_mod: '',
      hc: '',
      hero: ''
    },
    statistics: {
      characters: 0,
      users: 0
    },
    pagination: {
      offset: 0,
      more: false,
      loading: false
    },
    cache: {}
  },
  mutations: {
    setLoading(state, loading) {
      state.loading = loading;
    },

    setPaginationLoading(state, loading) {
      state.pagination = { ...state.pagination, loading };
    },

    setCharacters(state, { characters, pagination, statistics }) {
      state.characters = characters;
      state.statistics = statistics;
      state.pagination = { ...state.pagination, ...pagination };
    },

    cacheRuns(state, { key, data }) {
      state.cache[key] = data;
    },

    setFilterValue(state, { column, value }) {
      state.filters[column] = value;
    }
  },
  actions: {
    async loadCharacters({ state, commit }, paginate = false) {
      let query = '?';

      for (const key in state.filters) {
        if (state.filters[key] !== '') {
          query += `${key}=${state.filters[key]}&`;
        }
      }

      const cacheKey = query;

      if (paginate) {
        query += `offset=${state.pagination.offset}`;
      } else if (cacheKey in state.cache) {
        commit('setCharacters', state.cache[cacheKey]);
        return;
      }

      commit(paginate ? 'setPaginationLoading' : 'setLoading', true);

      const rest = await fetch(`${process.env.VUE_APP_API_URL}/ladder${query}`);
      const { rows, pagination, statistics } = await rest.json();
      const data = {
        characters: paginate ? state.characters.concat(rows) : rows,
        pagination,
        statistics
      };

      commit('setCharacters', data);
      commit('cacheRuns', { key: cacheKey, data });

      commit(paginate ? 'setPaginationLoading' : 'setLoading', false);
    },

    async selectFilter({ commit, dispatch }, { column, value }) {
      commit('setFilterValue', { column, value });
      await dispatch('loadCharacters');
    },

    async resetFilters({ state, commit, dispatch }) {
      for (const column in state.filters) {
        commit('setFilterValue', {
          column,
          value: column === 'd2_mod' ? 'D2' : ''
        });
      }

      await dispatch('loadCharacters');
    }
  }
};
