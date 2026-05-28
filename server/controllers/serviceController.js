import Service from '../models/Service.js';

export const getServices = async (req, res) => {
  try {
    const services = await Service.find({}).sort({ order: 1, createdAt: -1 });
    res.json({ success: true, count: services.length, data: services });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createService = async (req, res) => {
  try {
    const { title, description, icon, order } = req.body;
    if (!title || !description || !icon) {
      return res.status(400).json({ success: false, message: 'Please fill all required fields' });
    }

    const service = await Service.create({
      title,
      description,
      icon,
      order: order ? Number(order) : 0,
    });

    res.status(201).json({ success: true, data: service });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    const { title, description, icon, order } = req.body;
    if (title) service.title = title;
    if (description) service.description = description;
    if (icon) service.icon = icon;
    if (order !== undefined) service.order = Number(order);

    const updated = await service.save();
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }
    await Service.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Service deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
