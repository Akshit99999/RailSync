'use client';

import { useState, useCallback } from 'react';

/**
 * Reusable Form Validation Hook
 * Demonstrates: Controlled input state, validation strategies, touched/dirty tracking, submit handling.
 */
export function useFormValidation(initialValues, validate) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;

    setValues((prev) => {
      const nextValues = { ...prev, [name]: val };
      if (validate) {
        const validationErrors = validate(nextValues);
        setErrors(validationErrors);
      }
      return nextValues;
    });
  }, [validate]);

  const setFieldValue = useCallback((name, value) => {
    setValues((prev) => {
      const nextValues = { ...prev, [name]: value };
      if (validate) {
        const validationErrors = validate(nextValues);
        setErrors(validationErrors);
      }
      return nextValues;
    });
    setTouched((prev) => ({ ...prev, [name]: true }));
  }, [validate]);

  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    if (validate) {
      setErrors(validate(values));
    }
  }, [validate, values]);

  const handleSubmit = useCallback((onSubmit) => async (e) => {
    if (e && e.preventDefault) e.preventDefault();

    // Mark all fields touched
    const allTouched = Object.keys(values).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setTouched(allTouched);

    const validationErrors = validate ? validate(values) : {};
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      setIsSubmitting(true);
      try {
        await onSubmit(values);
      } finally {
        setIsSubmitting(false);
      }
    }
  }, [validate, values]);

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    setFieldValue,
    handleBlur,
    handleSubmit,
    resetForm,
    isValid: Object.keys(errors).length === 0,
  };
}
