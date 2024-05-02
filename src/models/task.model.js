import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    },
    description: {
        type: String
    }
    ,
    dueDate: {
        type: Date
    },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        required: true
    },
    taskProcess: {
        type: String,
        required: true,
        enum: ['Not Started', 'In Progress', 'Waiting', 'Deferred', 'Done']
    },
    completed: {
        type: Boolean,
        default: false
    }
});

export const TaskModel = mongoose.model("Task", taskSchema);
