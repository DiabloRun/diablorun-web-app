<template>
  <div class="modal is-active">
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">{{ title }}</p>
        <button
          class="delete has-background-link"
          aria-label="close"
          @click="reject()"
          v-if="cancelable"
        ></button>
      </header>
      <section class="modal-card-body">
        {{ message }}
      </section>
      <footer class="modal-card-foot">
        <button class="button" @click="reject()" v-if="cancelable">
          Cancel
        </button>
        <button class="button" :class="verifyClass" @click="resolve()">
          {{ verify }}
        </button>
      </footer>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DeleteCharacterModal',
  props: {
    title: { type: String, default: 'Confirm action' },
    message: { type: String, default: 'Are you sure?' },
    verify: { type: String, default: 'Verify' },
    verifyClass: { type: String, default: 'is-danger' },
    cancelable: { type: Boolean, default: true }
  },
  methods: {
    resolve() {
      this.$emit('resolve');
    },

    reject() {
      this.$emit('reject');
    }
  }
};
</script>
