// Helper functions for API responses

function success(res, data, count = null) {
  const response = {
    success: true,
    data
  };

  if (count !== null) {
    response.count = count;
  }

  return res.status(200).json(response);
}

function created(res, data) {
  return res.status(201).json({
    success: true,
    data
  });
}

function error(res, message, statusCode = 500) {
  return res.status(statusCode).json({
    success: false,
    error: message
  });
}

function notFound(res, message = 'Resource not found') {
  return error(res, message, 404);
}

function badRequest(res, message = 'Bad request') {
  return error(res, message, 400);
}

module.exports = {
  success,
  created,
  error,
  notFound,
  badRequest
};
