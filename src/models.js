import { Model, hasMany, hasOne, belongsTo, attr, Config } from 'jsorm';

export class ApplicationRecord extends Model {
  static get baseUrl() {
    return 'http://dockerhost:3000/';
  }

  static get apiNamespace() {
    return 'api/v1';
  }

  get isDestroyed() {
    return this.isMarkedForDestruction();
  }
}

export class Employee extends ApplicationRecord {
  static get jsonapiType() {
    return 'employees';
  }

  firstName = attr();
  lastName = attr();
  age = attr();

  currentPosition = hasOne('positions');
  positions = hasMany();

  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  }
}
ApplicationRecord.inherited(Employee);

export class Position extends ApplicationRecord {
  static get jsonapiType() {
    return 'positions';
  }

  title = attr();
  historicalIndex = attr();

  department = belongsTo('departments');
}
ApplicationRecord.inherited(Position);

export class Department extends ApplicationRecord {
  static get jsonapiType() {
    return 'departments';
  }

  name = attr();
}
ApplicationRecord.inherited(Department);

Config.setup();

export default { Employee, Department, Position };
