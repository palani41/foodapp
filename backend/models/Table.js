import mongoose from 'mongoose';

const tableSchema = new mongoose.Schema({
  tableNumber: {
    type: String,
    required: [true, 'Please provide a table number'],
    unique: true,
    trim: true
  },
  capacity: {
    type: Number,
    required: [true, 'Please provide table capacity'],
    min: [1, 'Capacity must be at least 1']
  },
  isReserved: {
    type: Boolean,
    default: false
  },
  currentOrderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  }
}, {
  timestamps: true
});

const Table = mongoose.model('Table', tableSchema);
export default Table;
