import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import useTranslation from 'next-translate/useTranslation';
import { useLazyQuery } from '@apollo/client';
import { useToasts } from 'react-toast-notifications';
import { useCallback, useEffect, useState } from 'react';
import ActionButton from './Buttons/ActionButton';
import { ButtonStyled } from './styles/Button';
import { Wrapper } from './styles/Help';

const QUERY_HELP = gql`
  query QUERY_HELP($key: String!, $lang: String!) {
    allHelps(
      where: { AND: [{ key: $key }, { language: $lang }] }
      sortBy: step_ASC
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
  const { t, lang } = useTranslation('common');
  const nbStep = contents.length;
  const [label, setLabel] = useState();
  const [element, setElement] = useState();

  const closeHelp = useCallback(() => {
    setStep(0);
    handleClose();
  }, [setStep, handleClose]);

  useEffect(() => {
    const el = document.getElementById('help-content-container');
    setElement(el);
  }, [contents, visible, closeHelp]);

  useEffect(() => {
    setLabel(
      step === nbStep - 1
        ? t('close')
        : `${t('next')} (${contents[step + 1]?.title})`
    );
    if (element && step < contents.length) {
      const { content } = contents[step];

      element.innerHTML = content.replace(
        /<a href="\//gi,
        `<a href="/${lang}/`
      );
    }
  }, [step, contents, setLabel, nbStep, element, t, lang]);

  function handleClick() {
    if (step < nbStep - 1) {
      setStep(step + 1);
    } else {
      closeHelp();
    }
  }

  if (!visible) return null;
  if (step >= contents.length) return null;
  return (
    <Wrapper>
      <div className="overlay">
        <div className="content">
          <div className="header">
            <h2>{contents[step].title}</h2>
            <ActionButton type="close" cb={closeHelp} />
          </div>
          <div id="help-content-container" className="body" />
          <div className="footer">
            <ButtonStyled onClick={handleClick}>{label}</ButtonStyled>
          </div>
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
    helpContent: data?.allHelps,
  };
}
