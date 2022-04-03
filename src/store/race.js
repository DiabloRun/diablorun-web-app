import ws from '@/plugins/ws';

export default {
  namespaced: true,
  state: {
    id: null,
    settings: null,
    rules: [],
    lobby: [],
    characters: []
  },
  mutations: {
    set(state, update) {
      if (update.race) state.settings = update.race;
      if (update.rules) state.rules = update.rules;
      if (update.lobby) state.lobby = update.lobby;
      if (update.characters) state.characters = update.characters;
    },

    joinLobby(state, { user }) {
      state.lobby = [...state.lobby, user];
    },

    leaveLobby(state, { user }) {
      state.lobby = state.lobby.filter(u => u.id !== user.id);
    },

    updateCharacter(
      state,
      { user, characterId, characterName, raceCharacterUpdates }
    ) {
      const index = state.characters.findIndex(
        character => character.user_id === user.id
      );

      if (index === -1) {
        state.characters = [
          ...state.characters,
          {
            id: characterId,
            name: characterName,
            user_id: user.id,
            user_name: user.name,
            user_color: user.color,
            user_country_code: user.country_code,
            ...raceCharacterUpdates
          }
        ];
      } else {
        state.characters = [
          ...state.characters.slice(0, index),
          {
            ...state.characters[index],
            ...raceCharacterUpdates
          },
          ...state.characters.slice(index + 1)
        ];
      }
    }
  },
  actions: {
    async subscribe({ commit }, id) {
      const res = await fetch(`${process.env.VUE_APP_API_URL}/races/${id}`);
      const snapshot = await res.json();

      commit('set', snapshot);
      ws.subscribe(`race/${id}`);
    },

    async unsubscribe({ state }) {
      ws.unsubscribe(`race/${state.settings.id}`);
    }
  }
};
