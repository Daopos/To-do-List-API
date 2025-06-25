const { Task } = require("../db/models/index");

const authorizeTaskOwner = async (req, res, next) => {
  const taskId = req.params.id;

  try {
    const task = await Task.findByPk(taskId);

    if (!task) {
      return res.status(404).json({ message: "Task not found." });
    }

    if (task.userId !== req.userId) {
      return res
        .status(403)
        .json({ message: "You are not allowed to access this task." });
    }

    req.task = task;
    next();
  } catch (err) {
    console.error("Authorization error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
