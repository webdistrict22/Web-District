const validate = (schemaValidator) => {
  return (req, res, next) => {
    if (typeof schemaValidator !== "function") {
      return next();
    }

    const result = schemaValidator(req.body, req);

    if (!result || !result.hasErrors) {
      return next();
    }

    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: result.errors,
    });
  };
};

module.exports = validate;