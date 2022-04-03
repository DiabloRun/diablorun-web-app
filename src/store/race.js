import ws from '@/plugins/ws';

export default {
  namespaced: true,
  state: {
    id: null,
    settings: null,
    rules: [],
    lobby: [],
    finishedCharacters: [],
    unfinishedCharacters: []
  },
  mutations: {
    set(
      state,
      { race, rules, lobby, finishedCharacters, unfinishedCharacters }
    ) {
      state.settings = race;
      state.rules = rules;
      state.lobby = lobby;
      state.finishedCharacters = finishedCharacters;
      state.unfinishedCharacters = unfinishedCharacters;
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
      const finishedIndex = state.finishedCharacters.findIndex(
        character => character.id === characterId
      );
      const unfinishedIndex = state.unfinishedCharacters.findIndex(
        character => character.id === characterId
      );

      if (raceCharacterUpdates.finish_time) {
        if (unfinishedIndex !== -1) {
          state.finishedCharacters.push({
            ...state.unfinishedCharacters[unfinishedIndex],
            ...raceCharacterUpdates
          });

          state.unfinishedCharacters = [
            ...state.unfinishedCharacters.slice(0, unfinishedIndex),
            ...state.unfinishedCharacters.slice(unfinishedIndex + 1)
          ];
        } else if (finishedIndex !== -1) {
          state.finishedCharacters = [
            ...state.finishedCharacters.slice(0, unfinishedIndex),
            {
              ...state.finishedCharacters[unfinishedIndex],
              ...raceCharacterUpdates
            },
            ...state.finishedCharacters.slice(unfinishedIndex + 1)
          ];
        } else {
          state.finishedCharacters.push({
            id: characterId,
            name: characterName,
            user_name: user.name,
            user_color: user.color,
            user_country_code: user.country_code,
            ...raceCharacterUpdates
          });
        }
      } else {
        if (unfinishedIndex === -1) {
          state.unfinishedCharacters.push({
            id: characterId,
            name: characterName,
            user_name: user.name,
            user_color: user.color,
            user_country_code: user.country_code,
            ...raceCharacterUpdates
          });
        } else {
          state.unfinishedCharacters = [
            ...state.unfinishedCharacters.slice(0, unfinishedIndex),
            {
              ...state.unfinishedCharacters[unfinishedIndex],
              ...raceCharacterUpdates
            },
            ...state.unfinishedCharacters.slice(unfinishedIndex + 1)
          ];
        }
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
