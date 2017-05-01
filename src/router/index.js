import Vue from 'vue';
import Router from 'vue-router';
import EmployeeDirectory from '@/components/employee-directory';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'EmployeeDirectory',
      component: EmployeeDirectory,
    },
  ],
});
