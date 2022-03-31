// PS. Tailwind classes used for wrapper.

import { Field } from '@keystone-6/fields-document/views';
import { FieldContainer } from '@keystone-ui/fields';
import { useEffect, useState } from 'react';
import styled from 'styled-components';

import Loading from '../Loading';

const LOADING = 'Loading';
const READY = 'Ready';

const emptyDocument = [
  {
    type: 'paragraph',
    children: [{ text: 'description' }],
  },
];

const field = {
  componentBlocks: [],
  relationships: {},
  documentFeatures: {
    formatting: {
      inlineMarks: {
        bold: true,
        italic: true,
        underline: true,
        strikethrough: true,
        code: false,
        keyboard: false,
        subscript: false,
        superscript: false,
      },
      alignment: {
        center: true,
        end: true,
      },
      blockTypes: {
        blockquote: true,
        code: false,
      },
      headingLevels: [1, 2, 3],
      listTypes: { ordered: true, unordered: true },
      softBreaks: true,
    },
    layouts: [],
    dividers: false,
    links: true,
  },
};

const Editor = ({ value = emptyDocument, setValue }) => {
  const [reload, setReload] = useState(LOADING);
  const [description, setDescription] = useState(value);

  useEffect(() => {
    setReload(READY);
  }, []);

  return (
    <Box>
      {reload === LOADING ? (
        <Loading />
      ) : (
        <FieldContainer>
          <Field
            value={description}
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus={false}
            field={field}
            onChange={(document) => {
              setDescription(document);
              setValue(document);
              // console.log('document', document);
            }}
          />
        </FieldContainer>
      )}
    </Box>
  );
};

export default Editor;

const Box = styled.div`
  border: 1px solid var(--light-grey);
  padding: 1rem;
  width: 100%;
  isolation: isolate;
`;
