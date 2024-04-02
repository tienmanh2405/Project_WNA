import { TemplateModel } from "../models/template.model.js";

const createTemplate = async (nameTemplate, description, imageUrl) => {
    try {
        const role = req.userData.role;
        if (role == 'user') {
            return res.status(404).json({ msg: "Not have permission" });
        }
    const newTemplate = new TemplateModel({ nameTemplate, description, imageUrl });
    const savedTemplate = await newTemplate.save();
    return savedTemplate;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getAllTemplates = async () => {
  try {
    const templates = await TemplateModel.find();
    return templates;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getTemplateById = async (templateId) => {
  try {
    const template = await TemplateModel.findById(templateId);
    return template;
  } catch (error) {
    throw new Error(error.message);
  }
};

const updateTemplate = async (templateId, newData) => {
    try {
      const role = req.userData.role;
        if (role == 'user') {
            return res.status(404).json({ msg: "Not have permission" });
        }
    const updatedTemplate = await TemplateModel.findByIdAndUpdate(templateId, newData, { new: true });
    return updatedTemplate;
  } catch (error) {
    throw new Error(error.message);
  }
};

const deleteTemplate = async (templateId) => {
    try {
      const role = req.userData.role;
        if (role == 'user') {
            return res.status(404).json({ msg: "Not have permission" });
        }
    const deletedTemplate = await TemplateModel.findByIdAndDelete(templateId);
    return deletedTemplate;
  } catch (error) {
    throw new Error(error.message);
  }
};

export { createTemplate, getAllTemplates, getTemplateById, updateTemplate, deleteTemplate };
