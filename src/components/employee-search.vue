<template>
    <div class='card search'>
      <h1>
        Employee Directory
      </h1>

      <div class='search-controls'>
        <form>
          <div class="col-md-6">
            <div class='form-group'>
              <input type='search' class='form-control' placeholder="First Name" v-model="query.firstNamePrefix"/>
            </div>
            <div class='form-group'>
              <input type='search' class='form-control' placeholder="Last Name" v-model="query.lastNamePrefix"/>
            </div>
          </div>
          <div class="col-md-6">
            <button class="btn btn-lg btn-primary pull-right" v-on:click='search()'>Search</button>

            <p class='pull-right'>
              Total: {{totalCount}}

              <a v-if="hasPrevPage" v-on:click='paginate(currentPage - 1)'>&laquo; Prev</a>

              <a v-if="hasNextPage" v-on:click='paginate(currentPage + 1)'>Next &raquo;</a>
            </p>
          </div>
        </form>
      </div>

      <table class='table'>
        <thead>
          <tr>
            <th>
              <a v-on:click="doSort('name')">Name</a>
            </th>
            <th>
              <a v-on:click="doSort('age')">Age</a>
            </th>
            <th>
              <a v-on:click="doSort('title')">Title</a>
            </th>
            <th>
              <a v-on:click="doSort('department_name')">Department</a>
            </th>
          </tr>
        </thead>

        <tbody>
          <tr v-for='employee in employees'>
            <td>
              <a v-on:click="selectEmployee(employee)">
                {{employee.fullName}}
              </a>
            </td>
            <td>{{employee.age}}</td>
            <td>{{employee.currentPosition.title}}</td>
            <td>{{employee.currentPosition.department.name}}</td>
          </tr>
        </tbody>
      </table>
    </div>
</template>

<script>
import { Employee } from '@/models';
import EventBus from '@/event-bus';

export default {
  components: {
  },
  data() {
    return {
      employees: [],
      departments: [],
      model: Employee,
      totalCount: 0,
      currentPage: 1,
      sort: { created_at: 'desc' },
      query: {
        firstNamePrefix: '',
        lastNamePrefix: '',
      },
    };
  },
  computed: {
    hasNextPage() {
      return (this.currentPage * 20) < this.totalCount;
    },

    hasPrevPage() {
      return this.currentPage !== 1;
    },
  },
  mounted() {
    this.search();
  },
  methods: {
    selectEmployee(employee) {
      EventBus.$emit('EmployeeSelected', employee);
    },

    buildScope() {
      let scope = Employee
        .includes({ current_position: 'department' })
        .stats({ total: 'count' })
        .order(this.sort)
        .page(this.currentPage)
        .per(5);

      if (this.query.firstNamePrefix) {
        scope = scope.where({
          first_name_prefix: this.query.firstNamePrefix,
        });
      }
      if (this.query.lastNamePrefix) {
        scope = scope.where({
          last_name_prefix: this.query.lastNamePrefix,
        });
      }

      return scope;
    },

    paginate(page) {
      this.currentPage = page;
      this.search();
    },

    doSort(attribute) {
      if (this.sort[attribute] && this.sort[attribute] === 'desc') {
        this.sort = { [attribute]: 'asc' };
      } else {
        this.sort = { [attribute]: 'desc' };
      }
      this.search();
    },

    search() {
      this.buildScope().all().then((response) => {
        this.employees = response.data;
        this.totalCount = response.meta.stats.total.count;
      });
    },
  },
};
</script>

<style>
</style>
