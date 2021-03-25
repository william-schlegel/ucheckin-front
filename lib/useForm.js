import { useEffect, useState } from 'react';

export default function useForm(initial = {}) {
  // create a state object for our inputs
  const [inputs, setInputs] = useState(initial);

  useEffect(() => {
    setInputs(initial);
  }, [initial]);

  function handleChange(e) {
    let { value, name, type } = e.target ? e.target : e;
    if (type === 'number') {
      value = parseFloat(value);
    }
    if (type === 'file') {
      [value] = e.target.files;
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

  // return the things we want to surface from this custom hook
  return {
    inputs,
    setInputs,
    handleChange,
    resetForm,
  };
}
