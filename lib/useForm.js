import isEmpty from 'lodash.isempty';
import set from 'lodash.set';
import get from 'lodash.get';
import useTranslation from 'next-translate/useTranslation';
import { useEffect, useState } from 'react';

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
  const [touched, setTouched] = useState(new Set());
  const { t } = useTranslation('common');

  useEffect(() => {
    // console.log('useForm - setInputs Initial');
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
    const initialValue = get(initial, name);
    if (initialValue !== value) {
      const tch = touched;
      tch.add(name);
      setTouched(tch);
    }
    const newObj = { ...inputs };
    set(newObj, name, value);
    setInputs(newObj);
  }

  function wasTouched(key) {
    return touched.has(key);
  }

  function validate() {
    const invalidFields = {};
    function isNotEmail(value) {
      const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return !re.test(String(value).toLowerCase());
    }
    function isInvalidPassword(value) {
      return value.length < 8;
    }

    for (const fld of requiredFields) {
      let func = isEmpty;
      let errorMessage = t('is-required');
      let key = fld;
      if (typeof fld === 'object') {
        if (fld.error) errorMessage = fld.error;
        if (fld.check === 'isEmail') {
          func = isNotEmail;
          if (!fld.error) errorMessage = t('invalid-email');
        }
        if (fld.check === 'isPassword') {
          func = isInvalidPassword;
          if (!fld.error) errorMessage = t('invalid-password');
        }
        key = fld.field;
      }
      // if (Array.isArray(inputs[key])) {
      //   if (func(get(inputs, `[${key}]`))) invalidFields[key] = errorMessage;
      // } else
      if (func(get(inputs, key))) invalidFields[key] = errorMessage;
    }
    setValidationError(invalidFields);
    if (!isEmpty(invalidFields)) return false;
    const touchedInputs = {};
    for (const tch of touched) {
      set(touchedInputs, tch, get(inputs, tch));
    }
    return touchedInputs;
  }

  function resetForm() {
    console.log('useForm - resetForm');
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
    wasTouched,
  };
}
