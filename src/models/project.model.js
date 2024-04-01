import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    template: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Template',
        required: true
    },
    nameProject: {
        type: String,
        required: true
    }
});
export const ProjectModel = mongoose.model('Project',projectSchema); 
