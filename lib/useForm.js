import { useEffect, useState } from 'react';

export default function useForm(initial = {}) {
  // create a state object for our inputs
  const [inputs, setInputs] = useState(initial);

  useEffect(() => {
    setInputs(initial);
  }, [initial]);

  function handleChange(e) {
    let { value, name, type } = e.target;
    if (type === 'number') {
      value = parseInt(value);
    }
    if (type === 'file') {
      [value] = e.target.files;
    }
    if (type === 'search-user') {
      const val = JSON.parse(value);
      value = { key: val.id, value: val.name };
    }
    if (type === 'search-users') {
      const val = JSON.parse(value);
      const user = { key: val.id, value: val.name };
      const actualValues = [...inputs[name]];
      const existId = actualValues.findIndex((v) => v.key === user.key);
      if (existId >= 0) {
        actualValues[existId] = user;
      } else {
        actualValues.push(user);
      }
      value = actualValues;
    }
    const updatedInputs = {
      ...inputs,
      [name]: value,
    };
    setInputs(updatedInputs);
  }

  function resetForm() {
    setInputs(initial);
  }

  function clearForm() {
    const blankState = Object.fromEntries(
      Object.entries(inputs).map(([key, value]) => [key, ''])
    );
    setInputs(blankState);
  }

  // return the things we want to surface from this custom hook
  return {
    inputs,
    setInputs,
    handleChange,
    resetForm,
    clearForm,
  };
}
