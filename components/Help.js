import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { useLazyQuery } from '@apollo/client';
import { useToasts } from 'react-toast-notifications';
import useTranslation from 'next-translate/useTranslation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import styled from 'styled-components';
import ActionButton from './Buttons/ActionButton';

const QUERY_HELP = gql`
  query QUERY_HELP($key: String!, $lang: String!) {
    helps(
      where: {
        AND: [{ key: { equals: $key } }, { language: { equals: $lang } }]
      }
      orderBy: { step: asc }
    ) {
      id
      title
      step
      content
    }
  }
`;

/**
 * All the props of this component are managed by the hook useHelp (see below)
 * @param {Boolean} visible state of the component
 * @param {Function} handleClose function called when the user close the window
 * @param {Array} contents result of the query
 */
export function Help({ visible, handleClose, contents = [] }) {
  const [step, setStep] = useState(0);
  const nbStep = contents.length;

  function handleKey(e) {
    console.log(`e`, e);
  }

  if (!visible) return null;
  if (step >= contents.length) return null;
  return (
    <Wrapper nbStep={nbStep}>
      <div className="overlay">
        <div className="content">
          {nbStep > 1 && (
            <div className="menu">
              {contents.map((c, i) => (
                // eslint-disable-next-line jsx-a11y/interactive-supports-focus
                <div
                  role="button"
                  className="menu-item"
                  key={c.title}
                  onClick={() => setStep(i)}
                  onKeyPress={(e) => handleKey(e)}
                >
                  {c.title}
                </div>
              ))}
            </div>
          )}
          <div className="help">
            <div className="header">
              <h2>{contents[step].title}</h2>
              <ActionButton type="close" cb={handleClose} />
            </div>
            <ReactMarkdown remarkPlugins={[remarkGfm]} className="body">
              {contents[step].content}
            </ReactMarkdown>
          </div>
          {/* <div className="footer">
            <ButtonStyled onClick={handleClick}>{label}</ButtonStyled>
          </div> */}
        </div>
      </div>
    </Wrapper>
  );
}

Help.propTypes = {
  visible: PropTypes.bool,
  handleClose: PropTypes.func,
  contents: PropTypes.array,
};

/**
 * Help button to activate the help window
 * @param {function} showHelp toggle the state of visibility of the window, this function is provided by the hook useHelp
 */
export function HelpButton({ showHelp }) {
  const { t } = useTranslation('common');
  return <ActionButton type="help" label={t('common:help')} cb={showHelp} />;
}

HelpButton.propTypes = {
  showHelp: PropTypes.func,
};

/**
 * Hook that manages the help window
 * @param {String} key used to retrieve contents from yhe DB
 * @returns {Object} helpVisible: state of the window, toggleHelpVisibility: function to change the state, helpContent: query result
 */
export function useHelp(key) {
  const { lang } = useTranslation('common');
  const [queryHelp, { error, data }] = useLazyQuery(QUERY_HELP);
  const [visible, setVisible] = useState(false);
  const { addToast } = useToasts();

  useEffect(() => {
    if (key) {
      queryHelp({
        variables: { key, lang },
      });
    }
  }, [key, lang, queryHelp]);

  useEffect(() => {
    if (error) {
      addToast(error.message, { appearance: 'error' });
    }
  }, [error, addToast]);

  function toggleHelpVisibility(force) {
    if (force === true) setVisible(true);
    else if (force === false) setVisible(false);
    else setVisible(!visible);
  }

  return {
    helpVisible: visible,
    toggleHelpVisibility,
    helpContent: data?.helps,
  };
}

const Wrapper = styled.div`
  --grid-template: ${(props) =>
    parseInt(props.nbStep) > 1 ? '1fr 4fr' : '1fr'};
  position: fixed;
  z-index: 4002;
  box-sizing: border-box;
  inset: 0;
  padding: 10px;
  color: var(--text-color);
  border-radius: 25px;
  background: transparent;
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  isolation: isolate;
  .overlay {
    inset: 0;
    position: fixed;
    z-index: 0;
    background: rgba(38, 192, 211, 0.2);
    .content {
      width: 60vw;
      height: auto;
      max-height: 50vh;
      @media (max-width: 1200px) {
        width: 100%;
        max-height: 70%;
      }
      display: grid;
      grid-template-columns: var(--grid-template);
      background-color: var(--background);
      opacity: 1;
      border: 1px solid rgba(0, 0, 0, 0.03);
      filter: drop-shadow(0 0 5px rgba(0, 0, 0, 0.05));
      border-radius: 5px;
      position: absolute;
      top: 30%;
      left: 50%;
      right: auto;
      bottom: auto;
      margin-right: -50%;
      transform: translate(-50%, -30%);
      z-index: 1;
      padding: 0.5rem 1rem;
      .menu {
        display: flex;
        flex-direction: column;
        height: 100%;
        border-right: 1px solid var(--lightGray);
        margin-right: 0.5em;
        .menu-item {
          padding: 0.5em;
          border-bottom: 1px solid var(--lightGray);
          margin-right: 0.5em;
          cursor: pointer;
          &:hover {
            background-color: var(--secondary);
            color: white;
          }
        }
      }
      .help {
        display: flex;
        flex-direction: column;
        overflow: auto;
        .body {
          em {
            font-style: italic;
            color: var(--secondary);
          }
          strong {
            font-weight: 700;
            color: var(--primary);
          }
          a {
            display: inline-block;
            padding: 0.1em 0.5em;
            margin: 0.1em;
            border-radius: 5px;
            color: var(--primary);
            border: 1px solid var(--primary);
            &:hover {
              border-color: var(--secondary);
              color: var(--secondary);
            }
          }
        }
        .header {
          border-bottom: 1px solid var(--lightGray);
          margin-bottom: 0.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          h2 {
            display: inline;
            color: var(--primary);
          }
          a {
            margin-left: 2rem;
            border-left: 1px solid var(--lightGray);
            padding-left: 0.5rem;
          }
        }
        .footer {
          border-top: 1px solid var(--lightGray);
          margin-top: 0.5rem;
          margin-bottom: 0.5rem;
          padding-top: 0.5rem;
          display: flex;
          justify-content: flex-end;
        }
      }
    }
  }
`;
