import { useState } from 'react';

import RichEditor from '../components/SlateEditor';

const initialValue = [
  {
    type: 'paragraph',
    children: [{ text: 'An opening paragraph...' }],
  },
  {
    type: 'quote',
    children: [{ text: 'A wise quote.' }],
  },
  {
    type: 'paragraph',
    children: [{ text: 'A closing paragraph!' }],
  },
];

export default function Test() {
  const [value, setValue] = useState(initialValue);
  return <RichEditor value={value} setValue={setValue} />;
}
