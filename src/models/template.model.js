import mongoose from "mongoose";


const templateSchema = new mongoose.Schema({
    nameTemplate: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    }

});

export const TemplateModel = mongoose.model('Template', templateSchema);
