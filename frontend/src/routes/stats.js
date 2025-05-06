// routes/stats.js
const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const Company = require('../models/Company');
const Application = require('../models/Application');

router.get('/', async (req, res) => {
  try {
    // Get counts in parallel for better performance
    const [totalJobs, totalCompanies, successfulHires] = await Promise.all([
      Job.countDocuments({}),
      Company.countDocuments({}),
      Application.countDocuments({ status: 'hired' })
    ]);

    // Debug logging
    console.log(`Stats counts - Jobs: ${totalJobs}, Companies: ${totalCompanies}, Hires: ${successfulHires}`);

    res.json({
      success: true,
      totalJobs,
      totalCompanies,
      successfulHires,
      lastUpdated: new Date()
    });
  } catch (error) {
    console.error('Stats endpoint error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve statistics',
      error: error.message
    });
  }
});

module.exports = router;