<template>
    <div class="card form clearfix">
      <h1>Create New Employee</h1>

      <form>
        <div class="row">
          <div class="col-md-4">
            <form-group :model="employee" field='firstName' placeholder='First Name' :errors='errors' error-key='first_name'/>
          </div>
          <div class="col-md-3">
            <form-group :model="employee" field='age' placeholder='Age' :errors='errors' error-key='age'/>
          </div>
          <div class="col-md-5">
            <form-group :model="employee" field='lastName' placeholder='Last Name' :errors='errors' error-key='last_name'/>
          </div>
        </div>

        <div class='positions'>
          <div class="row position" v-for="position in employee.positions" v-if="!position.isDestroyed">
            <div class="col-md-4">
              <form-group :model="position" field='title' placeholder='Title' :errors='position.errors' error-key='title'/>
            </div>
            <div class="col-md-5">
              <div class="form-group">
                <select v-model="position.department.id">
                  <option value="" disabled selected>Department</option>
                  <option v-for="dept in departments" :value="dept.id">{{dept.name}}</option>
                </select>
              </div>
            </div>
            <div class="col-md-1">
              <button type="button" class="btn-add btn btn-default btn-xs" v-on:click="removePosition(position)">x</button>
            </div>
            <div class="col-md-1">
              <button type="button" class="btn-add btn btn-default btn-xs" v-on:click="addPosition()">+</button>
            </div>
          </div>
        </div>

        <button v-on:click="submit()" class="pull-right btn btn-primary">Submit</button>
      </form>
    </div>
</template>

<script>
import { Employee, Department, Position } from '@/models';
import EventBus from '@/event-bus';
import FormGroup from './form-group';

export default {
  components: {
    FormGroup,
  },
  data() {
    return {
      isUpdating: false,
      errors: null,
      employee: {
        positions: [],
      },
      departments: [],
    };
  },
  created() {
    EventBus.$on('EmployeeSelected', (employee) => {
      this.loadEmployee(employee.id);
    });

    this.reset();
    this.loadDepartments();
  },
  methods: {
    loadEmployee(employeeId) {
      Employee.includes({ positions: 'department' }).find(employeeId).then((response) => {
        this.isUpdating = true;
        this.employee = response.data;
        if (this.employee.positions.length === 0) {
          this.addPosition();
        }
      });
    },

    addPosition() {
      this.employee.positions.push(new Position({ department: new Department() }));
      this.recalculateHistoricalIndices();
      this.employee = this.employee;
    },

    removePosition(position) {
      position.isMarkedForDestruction(true);
      this.recalculateHistoricalIndices();
    },

    recalculateHistoricalIndices() {
      const positions = this.employee.positions.filter(p => !p.isMarkedForDestruction());

      positions.forEach((p, i) => {
        // eslint-disable-next-line
        p.historicalIndex = i + 1;
      });
    },

    loadDepartments() {
      return Department.select({ departments: ['name'] }).all().then((response) => {
        this.departments = response.data;
      });
    },

    changeDepartment(position, deptId) {
      const localPosition = position;
      const department = this.departments.find(d => d.id === deptId);
      localPosition.department = department;
      this.employee = this.employee;
    },

    submit() {
      this.employee.save({ with: { positions: 'department' } }).then((success) => {
        if (success) {
          this.errors = null;
          EventBus.$emit('EmployeeUpdated', this.employee);
          this.reset();
        } else {
          this.errors = this.employee.errors;
        }
      });
    },

    reset() {
      this.isUpdating = false;
      const position = new Position({ historicalIndex: 1, department: new Department() });
      this.employee = new Employee({ positions: [position] });
    },

    hasError([obj, attribute, truthy, falsy]) {
      if (obj.errors[attribute] !== undefined) {
        return truthy;
      }

      return falsy;
    },
  },
};
</script>
