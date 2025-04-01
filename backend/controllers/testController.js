import Test from "../models/test.js";

export const createTest = async (req, res) => {
    try {
      const { name, age } = req.body;
      const newTest = new Test({ name, age });
      const savedTest = await newTest.save();
      res.status(201).json(savedTest);
    } catch (error) {
      res.status(500).json({ message: 'Error saving data', error });
    }
}

export const getAllTests = async (req, res) => {
    try {
      const tests = await Test.find();
      res.status(200).json(tests);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching data', error });
    }
}
