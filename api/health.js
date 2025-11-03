// Health check endpoint

module.exports = async (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'KPI Platform is running'
  });
};
