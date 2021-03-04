export default {
  namespaced: true,
  state: {
    ws: null,
    queueing: false,
    queue: [],
    race: {},
    rules: [],
    characters: [],
    notifications: [],
    character: {},
    items: [],
    subscribedToCharacterById: false,
    timeOffset: 0,
    pointsLog: [],
    lastUpdateTime: 0
  },
  mutations: {
    reset(state) {
      state.queueing = false;
      state.queue = [];
      state.race = {};
      state.rules = [];
      state.characters = [];
      state.notifications = [];
      state.character = {};
      state.items = [];
    },

    setLastUpdateTime(state, time) {
      state.lastUpdateTime = time;
    },

    setTimeOffset(state, offset) {
      state.timeOffset = offset;
    },

    setRace(state, race) {
      state.race = race;

      if ('preliminary_character_finish_time' in race) {
        state.characters = state.characters.map(character => ({
          ...character,
          start_time: race.start_time,
          finish_time: race.preliminary_character_finish_time
        }));
      }
    },

    setRules(state, rules) {
      state.rules = rules;
    },

    setCharacters(state, characters) {
      state.characters = characters;
    },

    setPointsLog(state, pointsLog) {
      state.pointsLog = pointsLog;
    },

    addNotifications(state, notifications) {
      state.notifications = [
        ...notifications.filter(
          a => !state.notifications.find(b => a.id === b.id)
        ),
        ...state.notifications
      ].slice(0, 6);
    },

    updateRaceRankings(state) {
      let forceFinish = false;

      if (state.race.finish_conditions_global) {
        forceFinish = state.characters.find(character => character.is_finished);
      }

      state.characters = [...state.characters].sort((a, b) => {
        if (!a.disqualified && b.disqualified) {
          return -1;
        }

        if (b.disqualified && !a.disqualified) {
          return 1;
        }

        if (a.is_finished && !b.is_finished) {
          return -1;
        }

        if (!a.is_finished && b.is_finished) {
          return 1;
        }

        if (a.points !== b.points) {
          return b.points - a.points;
        }

        if (a.is_finished && b.is_finished) {
          return a.finish_time - b.finish_time;
        }

        return 0;
      });

      let rank = 0;

      state.characters = state.characters.map((character, i) => {
        if (
          !i ||
          character.points !== state.characters[i - 1].points ||
          character.finish_time !== state.characters[i - 1].finish_time
        ) {
          ++rank;
        }

        if (forceFinish && !character.is_finished) {
          return {
            ...character,
            rank,
            is_finished: true,
            finish_time: forceFinish.finish_time
          };
        }

        return {
          ...character,
          rank
        };
      });
    },

    setSubscribedToCharacterById(state, subscribedToCharacterById) {
      state.subscribedToCharacterById = subscribedToCharacterById;
    },

    updateCharacter(state, { character, items }) {
      if (state.character.id === character.id) {
        state.character = {
          ...state.character,
          ...character
        };
      } else {
        state.character = {
          ...state.character,
          hireling_name: null,
          hireling_class: null,
          hireling_level: null,
          hireling_experience: null,
          hireling_strength: null,
          hireling_dexterity: null,
          hireling_fire_res: null,
          hireling_cold_res: null,
          hireling_light_res: null,
          hireling_poison_res: null,
          hireling_skill_ids: null,
          ...character
        };
      }

      if (items) {
        state.items = items;
      }
    },

    setQueueing(state, queueing) {
      state.queueing = queueing;
    },

    queue(state, message) {
      state.queue.push(message);
    },

    clearQueue(state) {
      state.queue = [];
    }
  },
  actions: {
    async connect({ state, dispatch }) {
      if (state.ws) {
        return state.wsReady;
      }

      state.ws = new WebSocket(process.env.VUE_APP_WS_URL);
      state.wsReady = new Promise(resolve => {
        state.ws.addEventListener('open', resolve);
        setInterval(() => state.ws.send('ping'), 30000);
      });

      await state.wsReady;

      state.ws.addEventListener('message', message => {
        if (message.data === 'pong') {
          return;
        }

        dispatch('message', message.data);
      });
    },

    async send({ state }, data) {
      state.ws.send(JSON.stringify(data));
    },

    async subscribeToCharacter({ commit, dispatch }, { name, id, lastUpdate }) {
      commit('reset');
      commit('setQueueing', true);
      commit('setSubscribedToCharacterById', !!id);

      await dispatch('connect');
      await dispatch('send', {
        action: 'subscribe',
        payload: `user/${name.toLowerCase()}`
      });

      if (!lastUpdate) {
        const res = await fetch(
          id
            ? `${process.env.VUE_APP_API_URL}/snapshots/characters/${id}`
            : `${process.env.VUE_APP_API_URL}/snapshots/users/${name}`
        );
        const body = await res.json();

        commit('updateCharacter', body);
      } else {
        commit('updateCharacter', lastUpdate);
      }

      dispatch('flushQueue');
    },

    async subscribeToRace({ commit, dispatch }, id) {
      commit('reset');
      commit('setQueueing', true);

      await dispatch('connect');
      await dispatch('send', { action: 'subscribe', payload: `race/${id}` });

      const res = await fetch(`${process.env.VUE_APP_API_URL}/races/${id}`);
      const body = await res.json();

      console.log('init', body);

      await dispatch('updateRace', body);
      await dispatch('flushQueue');
    },

    async message({ state, commit, dispatch }, data) {
      if (state.queueing) {
        commit('queue', data);
        return;
      }

      const { room, action, payload } = JSON.parse(data);

      if (process.env.NODE_ENV === 'development') {
        console.log(room, action, payload);
      }

      switch (action) {
        case 'character':
          if (
            !state.subscribedToCharacterById ||
            state.character.id === payload.character.id
          ) {
            commit('updateCharacter', payload);
          }
          break;
        case 'race':
          await dispatch('updateRace', payload);
          break;
      }
    },

    async flushQueue({ state, commit, dispatch }) {
      commit('setQueueing', false);

      for (const message of state.queue) {
        await dispatch('message', message);
      }

      commit('clearQueue');
    },

    async updateRace(
      { state, commit },
      { time, race, rules, characters, notifications, pointsLog }
    ) {
      if (time) {
        commit('setTimeOffset', time - new Date().getTime());
      }

      if (race) {
        commit('setRace', race);
      }

      if (rules) {
        commit('setRules', rules);
      }

      if (notifications) {
        commit('addNotifications', notifications);
      }

      // Set points log
      if (pointsLog) {
        commit('setPointsLog', pointsLog);
      }

      if (characters) {
        if (!state.characters.length) {
          commit('setCharacters', characters);
          commit('setLastUpdateTime', new Date());
          return;
        }

        let forceFinish = false;
        let forceFinishTime;
        let updateRankings = false;
        let updatedCharacters = [...state.characters];

        for (const character of characters) {
          const index = updatedCharacters.findIndex(
            c => c.user_id === character.user_id
          );

          if (index !== -1) {
            // Only update rankings if finish or points are changed
            if (
              updatedCharacters[index].is_finished !== character.is_finished ||
              updatedCharacters[index].finish_time !== character.finish_time ||
              updatedCharacters[index].points !== character.points ||
              updatedCharacters[index].disqualified !== character.disqualified
            ) {
              updateRankings = true;
            }

            // Update points log if new points available
            if (
              updatedCharacters[index].points !== character.points &&
              state.race.start_time
            ) {
              state.pointsLog.push({
                user_id: character.user_id,
                update_time: character.update_time,
                value: character.points
              });
            }

            updatedCharacters = [
              ...updatedCharacters.slice(0, index),
              { ...updatedCharacters[index], ...character },
              ...updatedCharacters.slice(index + 1)
            ];
          } else {
            updateRankings = true;
            updatedCharacters.push(character);
          }

          if (
            !forceFinish &&
            character.is_finished &&
            state.race.finish_conditions_global
          ) {
            forceFinish = true;
            forceFinishTime = character.finish_time;
          }
        }

        // Force finish when finish conditions are global
        if (forceFinish) {
          commit('setRace', {
            ...state.race,
            finish_time: state.race.finish_time || forceFinishTime
          });

          updatedCharacters = updatedCharacters.map(character => ({
            ...character,
            is_finished: true,
            finish_time: character.finish_time || forceFinishTime
          }));
        }

        commit('setCharacters', updatedCharacters);

        // Update rankings
        if (updateRankings) {
          commit('updateRaceRankings');
        }

        commit('setLastUpdateTime', new Date());
      }
    }
  }
};
