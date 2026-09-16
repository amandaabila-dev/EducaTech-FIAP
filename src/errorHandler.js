<<<<<<< HEAD
function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;

  if (statusCode >= 500) {
    console.error(`[${req.method} ${req.originalUrl}]`, err);
  }

  const message =
    statusCode >= 500
      ? 'Erro interno do servidor'
      : err.message || 'Erro interno do servidor';

  res.status(statusCode).json({ error: message });
}

module.exports = errorHandler;
=======
function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;

  if (statusCode >= 500) {
    console.error(`[${req.method} ${req.originalUrl}]`, err);
  }

  const message =
    statusCode >= 500
      ? 'Erro interno do servidor'
      : err.message || 'Erro interno do servidor';

  res.status(statusCode).json({ error: message });
}

module.exports = errorHandler;
>>>>>>> b8f4f0c33793c72b70ad636338ed64081ab34625
