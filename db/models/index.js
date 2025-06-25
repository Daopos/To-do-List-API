const User = require("./user");
const Task = require("./task");
const Subtask = require("./subtask");

User.hasMany(Task, {
  foreignKey: "user_id",
  as: "tasks",
});

Task.belongsTo(User, {
  foreignKey: "user_id",
  as: "user",
});

Task.hasMany(Subtask, {
  foreignKey: "task_id",
  as: "subtasks",
  onDelete: "cascade",
  hooks: true,
});

Subtask.belongsTo(Task, {
  foreignKey: "task_id",
  as: "task",
});

module.exports = {
  User,
  Task,
  Subtask,
};
