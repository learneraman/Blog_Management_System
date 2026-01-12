/**
 * Custom Hook: useForm
 * Hook for managing form state and validation
 */

import { useState, useCallback } from 'react';

export const useForm = (initialValues, onSubmit, validate) => {
  const [formData, setFormData] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  }, [errors]);

  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));
    
    if (validate) {
      const fieldError = validate(name, formData[name]);
      if (fieldError) {
        setErrors((prev) => ({
          ...prev,
          [name]: fieldError,
        }));
      }
    }
  }, [formData, validate]);

  const handleSubmit = useCallback(
    async (e) => {
      if (e) e.preventDefault();

      setIsSubmitting(true);

      // Mark all fields as touched
      const allTouched = Object.keys(formData).reduce(
        (acc, key) => ({
          ...acc,
          [key]: true,
        }),
        {}
      );
      setTouched(allTouched);

      // Validate all fields
      if (validate) {
        const newErrors = {};
        Object.keys(formData).forEach((key) => {
          const error = validate(key, formData[key]);
          if (error) newErrors[key] = error;
        });

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
          setIsSubmitting(false);
          return;
        }
      }

      try {
        await onSubmit(formData);
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, onSubmit, validate]
  );

  const resetForm = useCallback(() => {
    setFormData(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  const setFieldValue = useCallback((name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const setFieldError = useCallback((name, error) => {
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  }, []);

  return {
    formData,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setFieldValue,
    setFieldError,
  };
};
