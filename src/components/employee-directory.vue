<template>
    <div class="container">
      <div class="row">
        <div class="col-md-6">
          <employee-search/>
        </div>
        <div class="col-md-6">
          <employee-form/>
        </div>
      </div>
    </div>

</template>

<script>
import EmployeeForm from './employee-form';
import EmployeeSearch from './employee-search';

export default {
  components: {
    EmployeeForm,
    EmployeeSearch,
  },
  data() {
    return {
    };
  },
};
</script>

<style>
</style>
