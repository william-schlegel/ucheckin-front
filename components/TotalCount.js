import useTranslation from 'next-translate/useTranslation';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import formatMoney from '../lib/formatMoney';
import { H2 } from './styles/Card';

const TotalStyled = styled.div`
  display: flex;
  align-items: baseline;
  border-top: 1px solid var(--gray);
  .label {
    color: var(--blue);
  }
  span {
    font-size: 2.5rem;
    color: var(--pink);
    margin-left: auto;
  }
`;

const AnimationStyles = styled.span`
  position: relative;
  .count {
    display: block;
    position: relative;
    transition: transform 0.4s;
    backface-visibility: hidden;
  }
  .count-enter {
    transform: scale(4) rotateX(0.5turn);
  }
  .count-enter-active {
    transform: rotateX(0);
  }
  .count-exit {
    top: 0;
    position: absolute;
    transform: rotateX(0);
  }
  .count-exit-active {
    transform: scale(4) rotateX(0.5turn);
  }
`;

export default function Total({ value }) {
  const { t } = useTranslation('license');
  return (
    <TotalStyled>
      <H2 className="label">{t('total')}</H2>
      <AnimationStyles>
        <TransitionGroup>
          <CSSTransition
            unmountOnExit
            className="count"
            classNames="count"
            key={value}
            timeout={{ enter: 400, exit: 400 }}
          >
            <span className="total">{formatMoney(value)}</span>
          </CSSTransition>
        </TransitionGroup>
      </AnimationStyles>
    </TotalStyled>
  );
}

Total.propTypes = {
  value: PropTypes.number,
};
