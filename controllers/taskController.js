const { Task, Subtask } = require("../db/models/index");
const { Op, Sequelize } = require("sequelize");

const createTask = async (req, res) => {
  const { title, due_date, priority, status, details } = req.body;

  const userId = req.userId;

  let subtasks = [];

  const filePath = req.file ? `/uploads/${req.file.filename}` : null;

  let task;
  try {
    if (!title || !priority || !status) {
      return res
        .status(400)
        .json({ message: "Title, priority, and status are required." });
    }

    if (req.body.subtasks) {
      subtasks = JSON.parse(req.body.subtasks); // parse JSON string
    }

    if (Array.isArray(subtasks) && subtasks.length > 0) {
      task = await Task.create(
        {
          title,
          due_date,
          priority,
          details,
          subtasks,
          status,
          files: filePath,
          user_id: userId,
        },
        {
          include: [
            {
              model: Subtask,
              as: "subtasks",
            },
          ],
        }
      );
    } else {
      task = await Task.create({
        title,
        due_date,
        priority,
        status,
        details,
        files: filePath,
        user_id: userId,
      });
    }

    res.status(201).json({ message: "successfully created" });

    // res.status(201).json({ task: task });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

const deleteTasks = async (req, res) => {
  const tasksIds = req.body;

  if (!Array.isArray(tasksIds) || tasksIds.length === 0) {
    return res.status(400).json({ message: "No task IDs provided" });
  }

  try {
    for (const id of tasksIds) {
      const task = await Task.findByPk(id);
      if (!task) {
        return res.status(404).json({ message: "No task found" });
      }

      await task.destroy();
    }

    res.status(200).json({ message: "Tasks successfully deleted" });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

const deleteTaskById = async (req, res) => {
  const taskId = req.params.id;

  try {
    const task = await Task.findByPk(taskId);

    if (!task) {
      res.status(404).json({ message: "No task found" });
    }

    if (task.files) {
      const fs = require("fs");
      const path = require("path");
      const oldFilePath = path.join(__dirname, "..", "public", task.files);
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }
    }

    await task.destroy();

    res.status(200).json({ message: "Task successfully deleted" });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

const getTaskById = async (req, res) => {
  const taskId = req.params.id;

  try {
    const task = await Task.findOne({
      where: { id: taskId },
      include: [{ model: Subtask, as: "subtasks" }],
    });

    if (!task) {
      res.status(404).json({ message: "No task found" });
    }

    res.status(200).json({ task: task });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

const getTasksByUser = async (req, res) => {
  const userId = req.userId;

  const { status, priority, sortBy, order } = req.query;

  const where = { user_id: userId };

  if (status) where.status = status;
  if (priority) where.priority = priority;

  const direction = order?.toUpperCase() === "DESC" ? "DESC" : "ASC";

  const validFields = ["title", "due_date", "priority", "status"];

  let orderClause = [["createdAt", "DESC"]];
  if (sortBy) {
    if (sortBy === "status") {
      orderClause = [
        [
          Sequelize.literal(`CASE
            WHEN Tasks.status = 'Not Started' THEN 1
            WHEN Tasks.status = 'In Progress' THEN 2
            WHEN Tasks.status = 'Complete' THEN 3
            WHEN Tasks.status = 'Cancelled' THEN 4
            ELSE 5 END`),
          direction,
        ],
      ];
    } else if (sortBy === "priority") {
      orderClause = [
        [
          Sequelize.literal(`CASE
            WHEN priority = 'Critical' THEN 1
            WHEN priority = 'High' THEN 2
            WHEN priority = 'Medium' THEN 3
            WHEN priority = 'Low' THEN 4
            ELSE 5 END`),
          direction,
        ],
      ];
    } else if (validFields.includes(sortBy)) {
      orderClause = [[sortBy, direction]];
    }
  }
  try {
    const tasks = await Task.findAll({
      where,
      order: orderClause,
      include: [
        {
          model: Subtask,
          as: "subtasks",
        },
      ],
    });

    res.status(200).json({ tasks: tasks });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

const editTaskById = async (req, res) => {
  const { id } = req.params;

  const { status, due_date, details, deleteImage } = req.body;

  try {
    const task = await Task.findByPk(id, {
      include: { model: Subtask, as: "subtasks" },
    });

    if (!task) return res.status(404).json({ message: "Task not found" });

    let filePath = task.files;

    if (req.file) {
      if (task.files) {
        const fs = require("fs");
        const path = require("path");
        const oldFilePath = path.join(__dirname, "..", "public", task.files);
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }
      filePath = `/uploads/${req.file.filename}`;
    } else if (deleteImage === "true") {
      if (task.files) {
        const fs = require("fs");
        const path = require("path");
        const oldFilePath = path.join(__dirname, "..", "public", task.files);
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }
      filePath = null;
    }
    const completed = task.status === "Complete";
    const completed_date = completed ? new Date() : null;
    await task.update({
      status,
      due_date,
      details,
      files: filePath,
      completed_date,
    });

    let subtasks = [];

    if (req.body.subtasks) {
      subtasks = JSON.parse(req.body.subtasks);
    }
    const currentIds = subtasks.filter((s) => s.id).map((s) => s.id);

    await Subtask.destroy({
      where: {
        task_id: task.id,
        id: { [Op.notIn]: currentIds },
      },
    });

    if (Array.isArray(subtasks)) {
      for (const subtask of subtasks) {
        const isDone = subtask.status === "Done";
        const completed_date = isDone ? new Date() : null;
        if (subtask.id) {
          await Subtask.update(
            {
              title: subtask.title,
              status: subtask.status,
              completed_date: completed_date,
            },
            { where: { id: subtask.id, task_id: task.id } }
          );
        } else {
          await Subtask.create({ ...subtask, task_id: task.id });
        }
      }
    }
    return res.status(200).json({ message: "Task updated successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err });
  }
};
module.exports = {
  createTask,
  deleteTasks,
  getTaskById,
  getTasksByUser,
  editTaskById,
  deleteTaskById,
};
