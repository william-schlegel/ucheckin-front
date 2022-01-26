import PropTypes from 'prop-types';
import { ExternalLink, Trash } from 'react-feather';
import { Editor, Path, Range, Transforms } from 'slate';
import { ReactEditor, useFocused, useSelected, useSlateStatic } from 'slate-react';
import styled from 'styled-components';

import { ICON_SIZE } from './Toolbar';

const createLinkNode = (href, text) => ({
  type: 'link',
  href,
  children: [{ text }],
});

const removeLink = (editor, opts = {}) => {
  Transforms.unwrapNodes(editor, {
    ...opts,
    match: (n) => !Editor.isEditor(n) && Element.isElement(n) && n.type === 'link',
  });
};

const createParagraphNode = (children = [{ text: '' }]) => ({
  type: 'paragraph',
  children,
});

export function insertLink(editor, url) {
  if (!url) return;
  const { selection } = editor;
  const link = createLinkNode(url, 'New Link');
  ReactEditor.focus(editor);

  if (selection) {
    const [parentNode, parentPath] = Editor.parent(editor, selection.focus?.path);

    // Remove the Link node if we're inserting a new link node inside of another
    // link.
    if (parentNode.type === 'link') {
      removeLink(editor);
    }

    if (editor.isVoid(parentNode)) {
      // Insert the new link after the void node
      Transforms.insertNodes(editor, createParagraphNode([link]), {
        at: Path.next(parentPath),
        select: true,
      });
    } else if (Range.isCollapsed(selection)) {
      // Insert the new link in our last known location
      Transforms.insertNodes(editor, link, { select: true });
    } else {
      // Wrap the currently selected range of text into a Link
      Transforms.wrapNodes(editor, link, { split: true });
      // Remove the highlight and move the cursor to the end of the highlight
      Transforms.collapse(editor, { edge: 'end' });
    }
  } else {
    // Insert the new link node at the bottom of the Editor when selection
    // is falsey
    Transforms.insertNodes(editor, createParagraphNode([link]));
  }
}

export default function Link({ attributes, element, children }) {
  const editor = useSlateStatic();
  const selected = useSelected();
  const focused = useFocused();

  return (
    <ElementLink>
      <a {...attributes} href={element.href}>
        {children}
      </a>
      {selected && focused && (
        <div className="popup" contentEditable={false}>
          <a href={element.href} rel="noreferrer" target="_blank">
            <ExternalLink size={ICON_SIZE} />
            {element.href}
          </a>
          <button onClick={() => removeLink(editor)}>
            <Trash size={ICON_SIZE} color="red" />
          </button>
        </div>
      )}
    </ElementLink>
  );
}

Link.propTypes = {
  attributes: PropTypes.object,
  element: PropTypes.object,
  children: PropTypes.node,
};

export const withLinks = (editor) => {
  const { isInline } = editor;

  editor.isInline = (element) => (element.type === 'link' ? true : isInline(element));

  return editor;
};

const ElementLink = styled.div`
  display: inline;
  position: relative;
  .popup {
    position: absolute;
    left: 0;
    display: flex;
    align-items: center;
    background-color: white;
    padding: 6px 10px;
    gap: 10px;
    border-radius: 6px;
    border: 1px solid lightgray;
    z-index: 1;

    a {
      gap: 5px;
      padding-right: 10px;
      border-right: 1px solid lightgrey;
      width: max-content;
    }

    button {
      border: none;
      background: transparent;

      &:hover {
        color: rebeccapurple;
        cursor: pointer;
      }
    }
  }
`;
