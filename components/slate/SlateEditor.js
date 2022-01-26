/* eslint-disable no-restricted-syntax */
import isHotkey from 'is-hotkey';
import useTranslation from 'next-translate/useTranslation';
import PropTypes from 'prop-types';
import { useCallback, useMemo } from 'react';
import { createEditor } from 'slate';
import { withHistory } from 'slate-history';
import { Editable, Slate, withReact } from 'slate-react';
import styled from 'styled-components';

import Link, { withLinks } from './Link';
import Toolbar, { toggleMark } from './Toolbar';

const HOTKEYS = {
  'mod+b': 'bold',
  'mod+i': 'italic',
  'mod+u': 'underline',
  'mod+`': 'code',
};

const RichEditor = ({
  value = [{ type: 'paragraph', children: [{ text: '' }] }],
  setValue,
  placeholder,
}) => {
  const renderElement = useCallback((props) => <Element {...props} />, []);
  const renderLeaf = useCallback((props) => <Leaf {...props} />, []);
  const editor = useMemo(() => withLinks(withHistory(withReact(createEditor()))), []);
  const { t } = useTranslation('common');

  // console.log(`value`, value);

  function cleanup(val) {
    const newV = [];
    for (const v of val) {
      if (v.type === 'heading-one') newV.push({ ...v, type: 'heading', level: 1 });
      else if (v.type === 'heading-two') newV.push({ ...v, type: 'heading', level: 2 });
      else newV.push(v);
    }
    // console.log(`val`, newV);
    return newV;
  }

  return (
    <Box>
      <Slate
        editor={editor}
        value={value}
        onChange={(prev) => {
          setValue(cleanup(prev));
        }}
      >
        <Toolbar />
        <Box style={{ marginTop: '5px' }}>
          <Editable
            renderElement={renderElement}
            renderLeaf={renderLeaf}
            placeholder={placeholder || t('description')}
            spellCheck
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
            onKeyDown={(event) => {
              for (const hotkey in HOTKEYS) {
                if (isHotkey(hotkey, event)) {
                  event.preventDefault();
                  const mark = HOTKEYS[hotkey];
                  toggleMark(editor, mark);
                }
              }
            }}
          />
        </Box>
      </Slate>
    </Box>
  );
};

RichEditor.propTypes = {
  value: PropTypes.array,
  setValue: PropTypes.func,
  placeholder: PropTypes.string,
};

export const Element = ({ attributes, children, element }) => {
  switch (element.type) {
    case 'block-quote':
      return <blockquote {...attributes}>{children}</blockquote>;
    case 'bulleted-list':
      return <ul {...attributes}>{children}</ul>;
    case 'heading-one':
      return <h1 {...attributes}>{children}</h1>;
    case 'heading-two':
      return <h2 {...attributes}>{children}</h2>;
    case 'heading':
      return element.level === 1 ? (
        <h1 {...attributes}>{children}</h1>
      ) : (
        <h2 {...attributes}>{children}</h2>
      );

    case 'list-item':
      return <li {...attributes}>{children}</li>;
    case 'numbered-list':
      return <ol {...attributes}>{children}</ol>;
    case 'link':
      return (
        <Link attributes={attributes} element={element}>
          {children}
        </Link>
      );
    default:
      return <p {...attributes}>{children}</p>;
  }
};

Element.propTypes = {
  attributes: PropTypes.any,
  children: PropTypes.node,
  element: PropTypes.object,
};

export const Leaf = ({ attributes, children, leaf }) => {
  let chld = children;
  if (leaf.bold) {
    chld = <strong>{chld}</strong>;
  }

  if (leaf.code) {
    chld = <code>{chld}</code>;
  }

  if (leaf.italic) {
    chld = <em>{chld}</em>;
  }

  if (leaf.underline) {
    chld = <u>{chld}</u>;
  }

  return <span {...attributes}>{chld}</span>;
};

Leaf.propTypes = {
  attributes: PropTypes.any,
  children: PropTypes.node,
  leaf: PropTypes.object,
};

const Box = styled.div`
  border: 1px solid var(--light-grey);
  padding: 1rem;
  width: 100%;
`;

export default RichEditor;
