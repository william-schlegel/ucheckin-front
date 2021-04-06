import isEmpty from 'lodash.isempty';
import merge from 'lodash.merge';
import set from 'lodash.set';
import useTranslation from 'next-translate/useTranslation';
import { useEffect, useState } from 'react';
import transformField from './transformField';

/**
 * Form hook
 * @param {Object} initial Initial values
 * @param {Object} requiredFields list of required field with error message
 * @returns inputs object, setInputs function, handleChange function, resetForm function, validate function, validationError object
 */
export default function useForm(initial = {}, requiredFields = []) {
  // create a state object for our inputs
  const [inputs, setInputs] = useState(initial);
  const [validationError, setValidationError] = useState({});
  const { t } = useTranslation('common');

  useEffect(() => {
    setInputs(initial);
  }, [initial]);

  function handleChange(e) {
    let { value, name, type } = e.target ? e.target : e;

    // console.log(`handleChange`, { value, name });
    if (type === 'number') {
      value = parseFloat(value);
    }
    if (type === 'file') {
      [value] = e.target.files;
    }
    // const updatedInputs = {
    //   ...merge(inputs, transformField({ field: name, value })),
    // };
    // setInputs(updatedInputs);
    // if (Array.isArray(newValue[name]))
    //   setInputs((prev) => ({ ...prev, [name]: newValue[name] }));
    // else {
    // const newValue = transformField({ field: name, value });
    const newObj = { ...inputs };
    set(newObj, name, value);
    setInputs(newObj);
    // }
  }

  function validate() {
    const invalidFields = {};
    for (const key of Object.keys(requiredFields)) {
      const errorMessage = requiredFields[key]
        ? t(requiredFields[key])
        : t('is-required');
      if (Array.isArray(inputs[key])) {
        if (!inputs[key].length) invalidFields[key] = errorMessage;
      } else if (!inputs[key]) invalidFields[key] = errorMessage;
    }
    setValidationError(invalidFields);
    return isEmpty(invalidFields);
  }

  function resetForm() {
    setInputs(initial);
  }

  // return the things we want to surface from this custom hook
  return {
    inputs,
    setInputs,
    handleChange,
    resetForm,
    validate,
    validationError,
  };
}
