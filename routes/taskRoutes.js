const express = require("express");

const taskController = require("../controllers/taskController");
const authentication = require("../middleware/authentication");
const authorizeTaskOwner = require("../middleware/authTask");

const router = express.Router();
const upload = require("../util/upload");

router.post(
  "/task",
  upload.single("file"),
  authentication,
  taskController.createTask
);
router.delete("/tasks", authentication, taskController.deleteTasks);
router.get(
  "/task/:id",
  authentication,
  authorizeTaskOwner,
  taskController.getTaskById
);
// router.get("/task/:test", authentication, taskController.getTaskById);
router.get("/tasks", authentication, taskController.getTasksByUser);
router.put(
  "/task/:id",
  upload.single("file"),
  authentication,
  authorizeTaskOwner,
  taskController.editTaskById
);
router.delete("/task/:id", authentication, taskController.deleteTaskById);

module.exports = router;
