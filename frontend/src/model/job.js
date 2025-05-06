const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'expired', 'draft'],
    default: 'active'
  },
  postedOn: {
    type: Date,
    default: Date.now
  },
  expiredDate: {
    type: Date,
    required: false
  },
  location: {
    type: String,
    required: false,
    trim: true
  },
  employmentType: {
    type: String,
    enum: ['full-time', 'part-time', 'contract', 'internship'],
    required: true
  },
  salaryRange: {
    min: {
      type: Number,
      required: false
    },
    max: {
      type: Number,
      required: false
    }
  },
  skills: {
    type: [String],
    required: false
  },
  qualifications: {
    type: [String],
    required: false
  },
  responsibilities: {
    type: [String],
    required: false
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

// Indexes for better query performance
jobSchema.index({ status: 1 });
jobSchema.index({ company: 1 });
jobSchema.index({ postedOn: -1 });
jobSchema.index({ expiredDate: 1 });

module.exports = mongoose.model('Job', jobSchema);