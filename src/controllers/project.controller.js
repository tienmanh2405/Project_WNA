import { ProjectModel } from "../models/project.model.js";


const createProject = async (req, res) => {
    try {
        // const role = req.userData.role;
        // if (role == 'user') {
        //     const userId = req.userData.userId;
        //     const reqUserId = req.params.userId;
        //     if (userId !== reqUserId) {
        //         return res.status(403).json({
        //             msg: "No update permission",
        //         });
        //     }
        // }
        const { user, nameProject } = req.body;
        // Tạo một bản ghi mới cho dự án
        const newProject = new ProjectModel({ user, nameProject });
        // Lưu dự án vào cơ sở dữ liệu
        await newProject.save();
        res.status(201).json({ message: "Project created successfully", project: newProject });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getProjectById = async (req, res) => {
    try {
        const projectId = req.params.id;
        const role = req.userData.role;
        if (role == 'user') {
            const userId = req.userData.userId;

            // Tìm kiếm dự án theo ID và userId
            const project = await ProjectModel.findOne({ _id: projectId, user: userId });
            if (!project) {
                return res.status(404).json({ message: "Project not found" });
            }
            res.status(200).json({ project: project });
        }
        const project = await ProjectModel.findOne({ _id: projectId });
        res.status(200).json({ project: project });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getAllProjects = async (req, res) => {
    try {
        const userId = req.userData.userId;
        const userRole = req.userData.role;

        // Nếu người dùng là admin, không cần xác thực user cụ thể
        if (userRole === 'admin') {
            const projects = await ProjectModel.find();
            return res.status(200).json({ projects: projects });
        }
        // Kiểm tra xem người dùng đã xác thực chưa
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        // Lấy tất cả các dự án của người dùng hiện tại { user: userId }
        const projects = await ProjectModel.find({ user: userId });
        res.status(200).json({ projects: projects });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const updateProject = async (req, res) => {
    try {
        const projectId = req.params.id;
        const role = req.userData.role;
        if (role == 'user') {
            const userId = req.userData.userId;
            const project = await ProjectModel.findById(projectId);
            if (!project) {
                return res.status(404).json({ message: "Project not found" });
            }
            if (project.user.toString() !== userId) {
                return res.status(403).json({ message: "No permission to update this project" });
            }
        }
        const { nameProject } = req.body;
        // Tìm kiếm và cập nhật dự án trong cơ sở dữ liệu
        const updatedProject = await ProjectModel.findByIdAndUpdate(projectId, { nameProject }, { new: true });
        if (!updatedProject) {
            return res.status(404).json({ message: "Project not found" });
        }
        res.status(200).json({ message: "Project updated successfully", project: updatedProject });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteProject = async (req, res) => {
    try {
        const projectId = req.params.id;
        const role = req.userData.role;
        if (role == 'user') {
            const userId = req.userData.userId;
            const project = await ProjectModel.findById(projectId);
            if (!project) {
                return res.status(404).json({ message: "Project not found" });
            }
            if (project.user.toString() !== userId) {
                return res.status(403).json({ message: "No permission to update this project" });
            }
        }
        const deletedProject = await ProjectModel.findByIdAndDelete(projectId);
        if (!deletedProject) {
            return res.status(404).json({ message: "Project not found" });
        }
        res.status(200).json({ message: "Project deleted successfully", project: deletedProject });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export { createProject, getProjectById, getAllProjects, updateProject, deleteProject };
