import mongoose from "mongoose";


const taskSchema = new mongoose.Schema({
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    },
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
        enum: ['Not Started', 'In Progress', 'Waiting','Deferred','Done']
    }
});


export const TaskModel = mongoose.model("Task", taskSchema);