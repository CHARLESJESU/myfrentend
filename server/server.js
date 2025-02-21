const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/enquiryDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Define Enquiry Schema
const enquirySchema = new mongoose.Schema({
  studentName: String,
  date: String,
  fatherName: String,
  fatherOccupation: String,
  fatherorganizationName: String,
  motherName: String,
  motherOccupation: String,
  motherorganizationName: String,
  permanentAddress: String,
  community: String,
  firstGraduate: String,
  emailID: String,
  parentContactNo: String,
  studentContactNo: String,
  choiceOfCourses: String,
  board10: String,
  board10college: String,
  mathsExpected: String,
  mathsActual: String,
  physicsExpected: String,
  physicsActual: String,
  chemistryExpected: String,
  chemistryActual: String,
  cutOffExpected: String,
  cutOffActual: String,
  totalMarkExpected: String,
  totalMarkActual: String,
  board12: String,
  schoolName: String,
  referredBy: String,
  contactNo: String,
  siblings: String,
  sourceOfInfo: [String]
});

const Enquiry = mongoose.model('Enquiry', enquirySchema);

// API endpoint to handle form submission
app.post('/api/enquiry', async (req, res) => {
  try {
    const newEnquiry = new Enquiry(req.body);
    await newEnquiry.save();
    res.status(201).json({ message: 'Enquiry saved successfully' });
  } catch (error) {
    console.error('Error saving enquiry:', error);
    res.status(500).json({ message: 'Error saving enquiry' });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 