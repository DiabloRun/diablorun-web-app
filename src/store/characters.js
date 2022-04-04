import ws from '@/plugins/ws';

export default {
  namespaced: true,
  state: {
    latestIds: {},
    snapshots: {}
  },
  mutations: {
    set(state, snapshot) {
      state.snapshots = {
        ...state.snapshots,
        [snapshot.character.id]: snapshot
      };

      state.latestIds = {
        ...state.latestIds,
        [snapshot.character.user_name.toLowerCase()]: snapshot.character.id
      };
    },

    update(state, { user, id, name, characterUpdates, itemUpdates }) {
      let { character, items } = state.snapshots[id] || {
        character: { id, name },
        items: []
      };

      if (characterUpdates) {
        character = { ...character, ...characterUpdates };
      }

      if (itemUpdates) {
        items = items
          .filter(
            (item) =>
              !itemUpdates.removedItemHashes.includes(Number(item.item_hash))
          )
          .concat(itemUpdates.addedItems);
      }

      state.snapshots[id] = { character, items };
      state.latestIds = {
        ...state.latestIds,
        [user.name.toLowerCase()]: id
      };
    }
  },
  actions: {
    async fetchCharacter({ commit }, id) {
      const res = await fetch(
        `${process.env.VUE_APP_API_URL}/snapshots/characters/${id}`
      );
      const snapshot = await res.json();

      commit('set', snapshot);

      return snapshot;
    },

    async fetchLatestCharacter({ commit }, username) {
      const res = await fetch(
        `${process.env.VUE_APP_API_URL}/snapshots/users/${username}`
      );
      const snapshot = await res.json();

      commit('set', snapshot);

      return snapshot;
    },

    async subscribeToUser(_, username) {
      ws.subscribe(`user/${username.toLowerCase()}`);
    },

    async unsubscribeFromUser(_, username) {
      ws.unsubscribe(`user/${username.toLowerCase()}`);
    }
  }
};
