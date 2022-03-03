import PropTypes from 'prop-types';
import React from 'react';
import { Bold, Code, Italic, Link2, List, Underline } from 'react-feather';
import { Editor, Transforms } from 'slate';
import { useSlateStatic } from 'slate-react';
import styled from 'styled-components';

import { insertLink } from './Link';

export const ICON_SIZE = 16;

export default function Toolbar() {
  const editor = useSlateStatic();

  const handleInsertLink = () => {
    const url = prompt('URL');
    insertLink(editor, url);
  };

  return (
    <ToolbarStyle>
      <MarkButton format="bold">
        <Bold size={ICON_SIZE} />
      </MarkButton>
      <MarkButton format="italic">
        <Italic size={ICON_SIZE} />
      </MarkButton>
      <MarkButton format="underline">
        <Underline size={ICON_SIZE} />
      </MarkButton>
      <MarkButton format="code">
        <Code size={ICON_SIZE} />
      </MarkButton>
      <MarkButton format="link" onClick={handleInsertLink}>
        <Link2 size={ICON_SIZE} />
      </MarkButton>
      <BlockButton format="heading-one">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={ICON_SIZE}
          height={ICON_SIZE}
          viewBox="0 0 24 24"
          fill="currentColor"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M11 7h2v10h-2v-4H7v4H5V7h2v4h4V7zm6.57 0A4.742 4.742 0 0 1 15 9v1h2v7h2V7h-1.43z" />
        </svg>
      </BlockButton>
      <BlockButton format="heading-two">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={ICON_SIZE}
          height={ICON_SIZE}
          viewBox="0 0 24 24"
          fill="currentColor"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M9 7h2v10H9v-4H5v4H3V7h2v4h4V7zm8 8c.51-.41.6-.62 1.06-1.05c.437-.4.848-.828 1.23-1.28a6.4 6.4 0 0 0 .85-1.28c.199-.39.305-.822.31-1.26a3.007 3.007 0 0 0-.27-1.28a2.902 2.902 0 0 0-.76-1a3.485 3.485 0 0 0-1.17-.63a4.766 4.766 0 0 0-1.5-.22c-.359 0-.717.033-1.07.1a4.895 4.895 0 0 0-1 .29a4.431 4.431 0 0 0-.86.49c-.287.21-.561.437-.82.68l1.24 1.22a5.829 5.829 0 0 1 1-.7c.35-.201.747-.304 1.15-.3a1.91 1.91 0 0 1 1.27.38c.311.278.477.684.45 1.1a2.127 2.127 0 0 1-.36 1.11a7.126 7.126 0 0 1-1 1.25c-.44.43-.98.92-1.59 1.43c-.61.51-1.41 1.06-2.16 1.65V17h8v-2h-4z" />
        </svg>
      </BlockButton>
      <BlockButton format="block-quote">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={ICON_SIZE}
          height={ICON_SIZE}
          viewBox="0 0 24 24"
          fill="currentColor"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M9.983 3v7.391c0 5.704-3.731 9.57-8.983 10.609l-.995-2.151c2.432-.917 3.995-3.638 3.995-5.849h-4v-10h9.983zm14.017 0v7.391c0 5.704-3.748 9.571-9 10.609l-.996-2.151c2.433-.917 3.996-3.638 3.996-5.849h-3.983v-10h9.983z" />
        </svg>
      </BlockButton>
      <BlockButton format="unordered-list">
        <List size={ICON_SIZE} />
      </BlockButton>

      <BlockButton format="ordered-list">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={ICON_SIZE}
          height={ICON_SIZE}
          viewBox="0 0 24 24"
          fill="currentColor"
          stroke="currentColor"
          strokeWidth="1"
        >
          <path d="M6 2.75a.75.75 0 0 0-1.434-.307l-.002.003a1.45 1.45 0 0 1-.067.132a4.126 4.126 0 0 1-.238.384c-.217.313-.524.663-.906.902a.75.75 0 1 0 .794 1.272c.125-.078.243-.161.353-.248V7.25a.75.75 0 0 0 1.5 0v-4.5z" />
          <path d="M20.5 18.75a.75.75 0 0 0-.75-.75h-9a.75.75 0 0 0 0 1.5h9a.75.75 0 0 0 .75-.75z" />
          <path d="M20.5 12.244a.75.75 0 0 0-.75-.75h-9a.75.75 0 1 0 0 1.5h9a.75.75 0 0 0 .75-.75z" />
          <path d="M20.5 5.75a.75.75 0 0 0-.75-.75h-9a.75.75 0 0 0 0 1.5h9a.75.75 0 0 0 .75-.75z" />
          <path d="M5.15 10.52c-.3-.053-.676.066-.87.26a.75.75 0 1 1-1.06-1.06c.556-.556 1.43-.812 2.192-.677c.397.07.805.254 1.115.605c.316.358.473.825.473 1.352c0 .62-.271 1.08-.606 1.42c-.278.283-.63.511-.906.689l-.08.051a5.88 5.88 0 0 0-.481.34H6.25a.75.75 0 0 1 0 1.5h-2.5a.75.75 0 0 1-.75-.75c0-1.314.984-1.953 1.575-2.337l.06-.04c.318-.205.533-.345.69-.504c.134-.136.175-.238.175-.369c0-.223-.061-.318-.098-.36a.42.42 0 0 0-.251-.12z" />
          <path d="M2.97 21.28s.093.084.004.005l.006.005l.013.013a1.426 1.426 0 0 0 .15.125c.095.07.227.158.397.243c.341.17.83.329 1.46.329c.64 0 1.196-.181 1.601-.54c.408-.36.61-.857.595-1.359A1.775 1.775 0 0 0 6.77 19c.259-.305.412-.685.426-1.101a1.73 1.73 0 0 0-.595-1.36C6.196 16.181 5.64 16 5 16c-.63 0-1.119.158-1.46.33a2.592 2.592 0 0 0-.51.334a1.426 1.426 0 0 0-.037.033l-.013.013l-.006.005l-.002.003H2.97l-.001.002a.75.75 0 0 0 1.048 1.072a1.1 1.1 0 0 1 .192-.121c.159-.08.42-.171.79-.171c.36 0 .536.1.608.164c.07.061.09.127.088.187a.325.325 0 0 1-.123.23c-.089.077-.263.169-.573.169a.75.75 0 0 0 0 1.5c.31 0 .484.092.573.168c.091.08.121.166.123.231a.232.232 0 0 1-.088.187c-.072.064-.247.164-.608.164a1.75 1.75 0 0 1-.79-.17a1.1 1.1 0 0 1-.192-.122a.75.75 0 0 0-1.048 1.072zm.002-4.563l-.001.002c.007-.006.2-.168 0-.002z" />
        </svg>
      </BlockButton>
    </ToolbarStyle>
  );
}

const BlockButton = ({ format, children }) => {
  const editor = useSlateStatic();
  return (
    <BoxBtn selected={isBlockActive(editor, format)}>
      <ToggleButton
        value={format}
        selected={isBlockActive(editor, format)}
        onMouseDown={(event) => {
          event.preventDefault();
          toggleBlock(editor, format);
        }}
        style={{ lineHeight: 1 }}
      >
        {children}
      </ToggleButton>
    </BoxBtn>
  );
};

BlockButton.propTypes = {
  format: PropTypes.string,
  children: PropTypes.node,
};

function isMarkActive(editor, format) {
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
}

export function toggleMark(editor, format) {
  const isActive = isMarkActive(editor, format);

  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
}
const isBlockActive = (editor, format) => {
  const [match] = Editor.nodes(editor, {
    match: (n) => n.type === format,
  });
  return !!match;
};

const LIST_TYPES = ['ordered-list', 'unordered-list'];

function toggleBlock(editor, format) {
  const isActive = isBlockActive(editor, format);
  const isList = LIST_TYPES.includes(format);

  Transforms.unwrapNodes(editor, {
    match: (n) => LIST_TYPES.includes(n.type),
    split: true,
  });

  Transforms.setNodes(editor, {
    // eslint-disable-next-line no-nested-ternary
    type: isActive ? 'paragraph' : isList ? 'list-item' : format,
  });

  if (!isActive && isList) {
    const block = { type: format, children: [] };
    Transforms.wrapNodes(editor, block);
  }
}

const MarkButton = ({ format, children, onClick }) => {
  const editor = useSlateStatic();

  return (
    <BoxBtn selected={isMarkActive(editor, format)} onClick={onClick}>
      <ToggleButton
        value={format}
        selected={isMarkActive(editor, format)}
        onMouseDown={(event) => {
          event.preventDefault();
          toggleMark(editor, format);
        }}
      >
        {children}
      </ToggleButton>
    </BoxBtn>
  );
};

MarkButton.propTypes = {
  format: PropTypes.string,
  children: PropTypes.node,
  onClick: PropTypes.func,
};

const ToolbarStyle = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
`;

const BoxBtn = styled.div`
  border: 1px solid var(--light-grey);
  border-radius: 5px;
  width: 1.5rem;
  height: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1rem;
  background-color: ${(props) => (props.selected ? 'black' : 'transparent')};
`;

const ToggleButton = styled.div`
  border-color: var(--grey);
  background-color: ${(props) => (props.selected ? 'black' : 'transparent')};
  color: ${(props) => (props.selected ? 'var(--off-white)' : 'var(--grey)')};
`;
