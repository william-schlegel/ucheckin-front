import { useLazyQuery } from '@apollo/client';
import gql from 'graphql-tag';
import useTranslation from 'next-translate/useTranslation';
import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight } from 'react-feather';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import styled from 'styled-components';

import ActionButton from '../components/Buttons/ActionButton';

const QUERY_ONBOARDING = gql`
  query QUERY_ONBOARDING($key: String!, $lang: String!) {
    onboardings(where: { AND: [{ key: { equals: $key } }, { language: { equals: $lang } }] }) {
      id
      key
      title
      content
    }
  }
`;

const MIN_WTT = 350;
const MIN_HTT = 150;

export default function useOnboarding(steps, title) {
  const [step, setStep] = useState();
  const [show, setShow] = useState(false);
  const { lang } = useTranslation('common');
  const [queryOB, { data }] = useLazyQuery(QUERY_ONBOARDING);
  const refHL = useRef();
  const sz = useRef({ left: 0, top: 0, width: 200, height: 100 });

  useEffect(() => {
    if (data?.key !== steps[step]) {
      queryOB({
        variables: { key: steps[step], lang },
      });
    }
  }, [step, lang, queryOB]);

  function start() {
    setStep(0);
    setShow(true);
  }

  useEffect(() => {
    const elem = document.getElementById(steps[step]);
    if (!elem) return;
    const br = elem.getBoundingClientRect();
    sz.current = br;
  }, [steps, step]);

  function handleStepNext() {
    const nStep = step + 1;
    if (nStep < steps.length) setStep(nStep);
    else {
      setStep(0);
      setShow(false);
    }
  }

  function handleStepPrev() {
    const nStep = step - 1;
    if (nStep >= 0) setStep(nStep);
  }

  function Overlay() {
    if (!show) return null;
    return <OverlayElem onClick={() => setShow(false)} />;
  }
  function Highligh() {
    const [posTT, setPosTT] = useState([]);

    useEffect(() => {
      let pos = 'left';
      let posF = sz.current.height / 2;
      let left = 10;
      let top = -(MIN_HTT + 10);
      if (top < 0) {
        top = 0;
        left = sz.current.width + 10;
      }
      if (sz.current.left + left + MIN_WTT + 10 > window.innerWidth) {
        top = sz.current.height + 10;
        left = window.innerWidth - sz.current.left - MIN_WTT - 20;
        pos = 'top';
        posF = -left + sz.current.width / 2;
      }

      setPosTT([left, top, posF, pos]);
    }, []);

    function handleClose() {
      setShow(false);
    }

    if (!show) return null;
    return (
      <HighlightedElement
        left={sz.current.left}
        top={sz.current.top}
        width={sz.current.width}
        height={sz.current.height}
        ref={refHL}
      >
        {data?.onboardings[0]?.content ? (
          <TextContainer left={posTT[0]} top={posTT[1]} posFleche={posTT[2]} direction={posTT[3]}>
            <TextHeader>
              <h1>
                {title} {data?.onboardings[0]?.title}
              </h1>
              <ActionButton type="close" cb={handleClose} />
            </TextHeader>
            <TextBody>
              <ReactMarkdown remarkPlugins={[remarkGfm]} className="body">
                {data?.onboardings[0]?.content}
              </ReactMarkdown>
            </TextBody>
            <BulletContainer>
              {steps.map((s, id) => (
                <Bullet key={s} active={id === step} />
              ))}
            </BulletContainer>
            <TextFooter>
              <ArrowLeft onClick={handleStepPrev} />
              <ArrowRight onClick={handleStepNext} />
            </TextFooter>
          </TextContainer>
        ) : null}
      </HighlightedElement>
    );
  }

  return {
    Overlay,
    Highligh,
    start,
  };
}

const TextContainer = styled.div`
  position: absolute;
  background-color: var(--background);
  color: var(--text-color);
  left: ${(props) => props.left}px;
  top: ${(props) => props.top}px;
  min-width: ${MIN_WTT}px;
  min-height: ${MIN_HTT}px;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  transition: all 300ms ease-out;
  &:after {
    content: '';
    position: absolute;
    width: 0;
    height: 0;
    ${(props) => {
      if (props.direction === 'left')
        return `
        left: -8px;
        top: ${props.posFleche - 4}px;
        border-top: 8px solid transparent;
        border-right: 8px solid var(--background);
        border-bottom: 8px solid transparent;
        `;
      if (props.direction === 'top')
        return `
        top: -8px;
        left: ${props.posFleche - 4}px;
        border-left: 8px solid transparent;
        border-bottom: 8px solid var(--background);
        border-right: 8px solid transparent;
        `;
    }}
  }
`;
const TextHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 5px;
  border-bottom: 1px var(--light-grey) solid;
  h1 {
    margin: 0;
    padding: 0;
    font-size: 1.25rem;
    color: var(--secondary);
    width: 100%;
    text-align: center;
  }
`;
const TextBody = styled.div`
  font-size: 1rem;
  line-height: 1.25rem;
  padding: 1em;
  margin-block-end: auto;
`;
const TextFooter = styled.div`
  border-top: 1px var(--light-grey) solid;
  display: flex;
  padding: 5px;
  justify-content: space-between;
`;

const OverlayElem = styled.div`
  inset: 0;
  position: fixed;
  cursor: pointer;
  opacity: 0;
  z-index: 99998;
`;

const HighlightedElement = styled.div`
  box-shadow: rgb(33 33 33 / 80%) 0px 0px 1px 2px, rgb(33 33 33 / 50%) 0px 0px 0px 5000px;
  opacity: 1;
  left: ${(props) => props.left}px;
  top: ${(props) => props.top}px;
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
  position: absolute;
  z-index: 99999;
  transition: all 300ms ease-out;
`;

const BulletContainer = styled.div`
  margin: 1rem auto;
  display: flex;
  gap: 4px;
`;
const Bullet = styled.div`
  width: 7px;
  height: 7px;
  border-radius: 7px;
  background-color: ${(props) => (props.active ? 'var(--secondary)' : 'var(--primary)')};
`;
