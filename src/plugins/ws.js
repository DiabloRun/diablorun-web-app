import Vue from 'vue';
import store from '@/store';

class WsPlugin {
  rooms = [];
  unsubscribeTimeout = {};

  constructor() {
    this.ws = new WebSocket(process.env.VUE_APP_WS_URL);

    this.ws.addEventListener('open', () => {
      console.log('[WS] connected');
    });

    setInterval(() => this.ws.send('ping'), 30000);

    this.ws.addEventListener('message', message => {
      if (message.data === 'pong') {
        return;
      }

      const data = JSON.parse(message.data);

      if (process.env.NODE_ENV === 'development') {
        console.log(data);
      }

      switch (data.action) {
        case 'update_character':
          store.commit('characters/update', data);
          break;
        case 'update_race_character':
          store.commit('race/updateCharacter', data);
          break;
        case 'join_race_lobby':
          store.commit('race/joinLobby', data);
          break;
        case 'leave_race_lobby':
          store.commit('race/leaveLobby', data);
          break;
      }
    });
  }

  install(Vue_) {
    Vue_.prototype.$ws = this.ws;
  }

  send(action, payload) {
    this.ws.send(JSON.stringify({ action, payload }));
  }

  subscribe(room) {
    if (this.rooms.includes(room)) {
      return;
    }

    this.rooms.push(room);

    if (room in this.unsubscribeTimeout) {
      clearTimeout(this.unsubscribeTimeout[room]);
      delete this.unsubscribeTimeout[room];
    } else {
      this.send('subscribe', room);
      console.log(`[WS] joined ${room}`);
    }
  }

  unsubscribe(room) {
    if (!this.rooms.includes(room)) {
      return;
    }

    this.rooms = this.rooms.filter(r => r !== room);

    if (room in this.unsubscribeTimeout) {
      clearTimeout(this.unsubscribeTimeout[room]);
    }

    this.unsubscribeTimeout[room] = setTimeout(() => {
      this.send('unsubscribe', room);
      delete this.unsubscribeTimeout[room];
      console.log(`[WS] left ${room}`);
    }, 5000);
  }
}

const ws = new WsPlugin();

Vue.use(ws);

export default ws;
