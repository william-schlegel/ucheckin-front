import useTranslation from 'next-translate/useTranslation';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import { formatMoney, formatPrct } from '../lib/formatNumber';
import { H2, Label, Row, RowReadOnly } from './styles/Card';

const TotalStyled = styled.div`
  display: flex;
  flex-direction: column;
  align-items: baseline;
  border-top: 1px solid var(--gray);
  .label {
    color: var(--primary);
  }
  span {
    font-size: 2.5rem;
    color: var(--secondary);
    margin-left: auto;
    &.vat {
      font-size: 1.5rem;
    }
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

export default function Total({ value, nbLicense, nbSignal, vat }) {
  const { t } = useTranslation('license');
  return (
    <>
      <Row>
        {nbLicense > 0 && (
          <span>{t('total-license', { count: nbLicense })}</span>
        )}
        {nbSignal > 0 && <span>{t('total-signal', { count: nbSignal })}</span>}
      </Row>
      <TotalStyled>
        <RowReadOnly>
          <Label>{t('common:net-amount')}</Label>
          <span className="vat">{formatMoney(value)}</span>
        </RowReadOnly>
        <RowReadOnly>
          <Label>{t('common:vat', { percentage: formatPrct(vat) })}</Label>
          <span className="vat">{formatMoney(value * vat)}</span>
        </RowReadOnly>
        <RowReadOnly>
          <H2 className="label">{t('common:taxed-amount')}</H2>
          <span>
            <AnimationStyles>
              <TransitionGroup>
                <CSSTransition
                  unmountOnExit
                  className="count"
                  classNames="count"
                  key={value}
                  timeout={{ enter: 400, exit: 400 }}
                >
                  <span className="total">
                    {formatMoney(value * (1 + vat))}
                  </span>
                </CSSTransition>
              </TransitionGroup>
            </AnimationStyles>
          </span>
        </RowReadOnly>
      </TotalStyled>
    </>
  );
}

Total.propTypes = {
  value: PropTypes.number,
  nbLicense: PropTypes.number,
  nbSignal: PropTypes.number,
};
