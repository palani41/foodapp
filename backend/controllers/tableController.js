import Table from '../models/Table.js';

// @desc    Get all tables
// @route   GET /api/tables
// @access  Public
export const getTables = async (req, res, next) => {
  try {
    const tables = await Table.find({}).sort({ tableNumber: 1 });
    res.json({ success: true, count: tables.length, data: tables });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a table
// @route   POST /api/tables
// @access  Private/Admin
export const createTable = async (req, res, next) => {
  try {
    const { tableNumber, capacity } = req.body;

    const tableExists = await Table.findOne({ tableNumber });
    if (tableExists) {
      res.status(400);
      throw new Error('Table number already exists');
    }

    const table = await Table.create({
      tableNumber,
      capacity: Number(capacity)
    });

    res.status(201).json({ success: true, data: table });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a table
// @route   PUT /api/tables/:id
// @access  Private/Admin
export const updateTable = async (req, res, next) => {
  try {
    const table = await Table.findById(req.params.id);
    if (!table) {
      res.status(404);
      throw new Error('Table not found');
    }

    table.capacity = req.body.capacity !== undefined ? Number(req.body.capacity) : table.capacity;
    table.isReserved = req.body.isReserved !== undefined ? req.body.isReserved : table.isReserved;
    table.currentOrderId = req.body.currentOrderId !== undefined ? req.body.currentOrderId : table.currentOrderId;

    const updatedTable = await table.save();
    res.json({ success: true, data: updatedTable });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a table
// @route   DELETE /api/tables/:id
// @access  Private/Admin
export const deleteTable = async (req, res, next) => {
  try {
    const table = await Table.findById(req.params.id);
    if (!table) {
      res.status(404);
      throw new Error('Table not found');
    }

    await Table.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Table removed successfully' });
  } catch (error) {
    next(error);
  }
};
