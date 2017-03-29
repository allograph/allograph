import {
  User,
  Project,
} from './schema/models.js'

var root = {

  users: function (args) {
    var user = new User;
    return user.users(args);
  },
  addUser: function(args) {
    var user = new User;
    return user.createUser(args);
  },
  updateUser: function(args) {
    var user = new User;
    return user.updateUser(args);
  },
  deleteUser: function({id}) {
    var user = new User;
    return user.deleteUser(id);
  },

  projects: function (args) {
    var project = new Project;
    return project.projects(args);
  },
  addProject: function(args) {
    var project = new Project;
    return project.createProject(args);
  },
  updateProject: function(args) {
    var project = new Project;
    return project.updateProject(args);
  },
  deleteProject: function({id}) {
    var project = new Project;
    return project.deleteProject(id);
  }
};


module.exports = root;