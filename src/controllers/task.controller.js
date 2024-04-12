import { TaskModel } from '../models/task.model.js';

// Lấy tất cả các công việc theo userId
const getAllTasks = async (req, res) => {
    try {
        const role = req.userData.role;
        if (role == 'user') {
            const userId = req.userData.userId;
            const reqUserId = req.params.userId;
            if (userId !== reqUserId) {
                return res.status(403).json({
                    msg: "No get task by user permission",
                });
            }
            const tasks = await TaskModel.find({ user: userId });
            res.status(200).json({ tasks: tasks });
        }
        const tasks = await TaskModel.find();
        res.status(200).json({ tasks: tasks });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAllTasksByProduct = async (req, res) => {
    try {
        const role = req.userData.role;
        const userId = req.userData.userId;
        const productId = req.params.productId;

        // Nếu người dùng không phải là user, không cho phép truy cập
        if (role !== 'user') {
            return res.status(403).json({
                msg: "Only users are allowed to access tasks by product",
            });
        }

        // Lấy tất cả các công việc trong sản phẩm của người dùng hiện tại
        const tasks = await TaskModel.find({ project: productId, user: userId });
        res.status(200).json({ tasks: tasks });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// Lấy thông tin của một công việc dựa trên ID
const getTaskById = async (req, res) => {
    try {
        const userId = req.userData.userId;
        const taskId = req.params.taskId;
        const task = await TaskModel.findById(taskId);
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }
        if (task.user.toString() !== userId) {
            return res.status(404).json({ message: "Task not permission" });
        }
        res.status(200).json({ task: task });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Tạo một công việc mới
const createTask = async (req, res) => {
    try {
        const { user, project, description, dueDate, priority, taskProcess } = req.body;
        const newTask = new TaskModel({ user, project, description, dueDate, priority, taskProcess });
        await newTask.save();
        res.status(201).json({ message: "Task created successfully", task: newTask });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Cập nhật thông tin của một công việc
const updateTask = async (req, res) => {
    try {
        const role = req.userData.role;
        const taskId = req.params.taskId;
        if (role == 'user') {
            const userId = req.userData.userId;
            const Task = await TaskModel.findById(taskId);
            if (!Task) {
                return res.status(404).json({ message: "Task not found" });
            }
            if (Task.user.toString() !== userId) {
                return res.status(403).json({ message: "No permission to update this Task" });
            }
        }

        const { description, dueDate, priority, taskProcess } = req.body;
        const updatedTask = await TaskModel.findByIdAndUpdate(taskId, { description, dueDate, priority, taskProcess }, { new: true });
        if (!updatedTask) {
            return res.status(404).json({ message: "Task not found" });
        }
        res.status(200).json({ message: "Task updated successfully", task: updatedTask });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Xóa một công việc
const deleteTask = async (req, res) => {
    try {
        const role = req.userData.role;
        const taskId = req.params.taskId;
        if (role == 'user') {
            const userId = req.userData.userId;
            const Task = await TaskModel.findById(taskId);
            if (!Task) {
                return res.status(404).json({ message: "Task not found" });
            }
            if (Task.user.toString() !== userId) {
                return res.status(403).json({ message: "No permission to update this Task" });
            }
        }
        const deletedTask = await TaskModel.findByIdAndDelete(taskId);
        if (!deletedTask) {
            return res.status(404).json({ message: "Task not found" });
        }
        res.status(200).json({ message: "Task deleted successfully", task: deletedTask });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export { getAllTasks, getTaskById, createTask, updateTask, deleteTask, getAllTasksByProduct };
