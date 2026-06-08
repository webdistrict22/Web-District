const notFound = (req, res, next) => {
  const error = new Error(`Route not found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  let statusCode =
    err.statusCode ||
    err.status ||
    (res.statusCode === 200 ? 500 : res.statusCode);
  let message = err.message || "Server Error";

  if (err.name === "CastError") {
    statusCode = 404;
    message = "Resource not found";
  }

  if (err.code === 11000) {
    statusCode = 400;

    if (err.keyPattern?.client && err.keyPattern?.contract) {
      message = "A review has already been submitted for this contract";
    } else {
      const duplicateField = Object.keys(err.keyValue || {})[0];

      message = duplicateField
        ? `${duplicateField} already exists`
        : "Duplicate field value entered";
    }
  }

  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((item) => item.message)
      .join(", ");
  }

  if (err.name === "MulterError") {
    statusCode = 400;
    message =
      err.code === "LIMIT_FILE_SIZE"
        ? "Image file must be 5 MB or smaller"
        : "Image upload failed";
  }

  if (err.message === "CORS blocked origin") {
    statusCode = 403;
    message = "Origin is not allowed";
  }

  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    statusCode = 400;
    message = "Invalid JSON request body";
  }

  const responseMessage =
    process.env.NODE_ENV === "production" && statusCode >= 500
      ? "Server Error"
      : message;

  res.status(statusCode).json({
    success: false,
    message: responseMessage,
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });
};

module.exports = {
  notFound,
  errorHandler,
};
