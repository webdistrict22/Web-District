import { useState } from "react";

function useForm(initialValues = {}, validate) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (field, value) => {
    setValues((prev) => ({
      ...prev,
      [field]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [field]: "",
    }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    updateField(name, type === "checkbox" ? checked : value);
  };

  const resetForm = (nextValues = initialValues) => {
    setValues(nextValues);
    setErrors({});
    setIsSubmitting(false);
  };

  const validateForm = () => {
    if (typeof validate !== "function") {
      setErrors({});
      return true;
    }

    const validationErrors = validate(values) || {};
    setErrors(validationErrors);

    return !Object.values(validationErrors).some(Boolean);
  };

  const handleSubmit = (callback) => {
    return async (e) => {
      if (e) e.preventDefault();

      const isValid = validateForm();

      if (!isValid) return;

      try {
        setIsSubmitting(true);
        await callback(values);
      } finally {
        setIsSubmitting(false);
      }
    };
  };

  return {
    values,
    setValues,
    errors,
    setErrors,
    isSubmitting,
    setIsSubmitting,
    updateField,
    handleChange,
    resetForm,
    validateForm,
    handleSubmit,
  };
}

export default useForm;