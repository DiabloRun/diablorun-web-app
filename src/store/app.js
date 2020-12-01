export default {
  namespaced: true,
  state: {
    confirmModal: null,
    windowStyle: 'window'
  },
  mutations: {
    setConfirmModal(state, settings) {
      state.confirmModal = settings;
    },
    
    setWindowStyle(state, windowStyle) {
      state.windowStyle = windowStyle;

      if (windowStyle === 'window') {
        document.documentElement.className = 'has-navbar-fixed-top';
      } else if (windowStyle === 'popup') {
        document.documentElement.className = 'popup';
      } else {
        document.documentElement.className = '';
      }

      if (windowStyle === 'overlay') {
        document.documentElement.style.background = 'none';
        document.body.style.background = 'none';
      }
    }
  },
  actions: {
    async confirm({ commit }, { title, message, verify, verifyClass, cancelable }) {
      return await new Promise(resolve => {
        commit('setConfirmModal', {
          title,
          message,
          verify,
          verifyClass,
          cancelable,
          resolve: () => resolve(true),
          reject: () => resolve(false)
        });
      }).then(verified => {
        commit('setConfirmModal', null);
        return verified;
      });
    }
  }
};
