<template>
  <div class="form-group" :class="{ 'has-error': hasErrors }">
    <input type="text" class="form-control" :placeholder="placeholder" v-model='model[field]'/>
    <p class="text-danger" v-if="hasErrors">{{ errors[errorKey] }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
    };
  },
  props: [
    'model',
    'field',
    'placeholder',
    'errors',
    'errorKey',
  ],
  computed: {
    hasErrors() {
      if (!this.errors || !this.errors[this.errorKey]) {
        return false;
      }

      return true;
    },
  },
};
</script>
