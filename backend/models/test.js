import mongoose from 'mongoose';

const TestSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
});

const Test = mongoose.model('Test', TestSchema);

export default Test;