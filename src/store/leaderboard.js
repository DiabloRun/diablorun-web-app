export default {
  namespaced: true,
  state: {
    loading: true,
    categories: [],
    runs: [],
    users: 0,
    filters: {
      category_id: '',
      hc: '',
      players_category: '',
      hero: ''
    },
    statistics: {
      speedruns: 0,
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

    setCategories(state, categories) {
      state.categories = categories;
    },

    setRuns(state, { runs, statistics, pagination }) {
      state.runs = runs;
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
    async loadCategories({ commit }) {
      const rest = await fetch(`${process.env.VUE_APP_API_URL}/categories`);
      const categories = await rest.json();

      commit('setCategories', categories);
    },

    async loadRuns({ state, commit }, paginate = false) {
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
        commit('setRuns', state.cache[cacheKey]);
        return;
      }

      commit(paginate ? 'setPaginationLoading' : 'setLoading', true);

      const rest = await fetch(
        `${process.env.VUE_APP_API_URL}/speedruns${query}`
      );
      const { statistics, speedruns, pagination } = await rest.json();
      const data = {
        runs: paginate ? state.runs.concat(speedruns) : speedruns,
        statistics,
        pagination
      };

      commit('setRuns', data);
      commit('cacheRuns', { key: cacheKey, data });

      commit(paginate ? 'setPaginationLoading' : 'setLoading', false);
    },

    async selectFilter({ commit, dispatch }, { column, value }) {
      commit('setFilterValue', { column, value });
      await dispatch('loadRuns');
    },

    async resetFilters({ state, commit, dispatch }) {
      for (const column in state.filters) {
        commit('setFilterValue', {
          column,
          value: column === 'category_id' ? 1 : ''
        });
      }

      await dispatch('loadRuns');
    }
  }
};
