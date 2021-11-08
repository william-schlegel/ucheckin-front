import useTranslation from 'next-translate/useTranslation';
import PropTypes from 'prop-types';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import styled from 'styled-components';

import { formatMoney, formatPrct } from '../lib/formatNumber';
import { Block, H2, Label, Row, RowReadOnly } from './styles/Card';

const TotalStyled = styled.div`
  display: flex;
  flex-direction: column;
  align-items: baseline;
  border-top: 1px solid var(--grey);
  .label {
    color: var(--primary);
  }
  .number {
    font-size: 1.5rem;
    color: var(--secondary);
    margin-left: auto;
    margin-right: 1rem;
    &.big {
      font-size: 2.5rem;
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

export default function Total({ value, vat }) {
  const { t } = useTranslation('license');
  return (
    <>
      <Row>
        <Block>
          {value.licenses > 0 && <span>{t('total-license', { count: value.licenses })}</span>}
          {value.signals > 0 && <span>{t('total-signal', { count: value.signals })}</span>}
        </Block>
      </Row>
      <TotalStyled>
        <RowReadOnly>
          <Label>{t('common:net-amount')}</Label>
          <span className="number">{formatMoney(value.amount)}</span>
        </RowReadOnly>
        <RowReadOnly>
          <Label>{t('common:vat', { percentage: formatPrct(vat) })}</Label>
          <span className="number">{formatMoney(value.amount * vat)}</span>
        </RowReadOnly>
        <RowReadOnly>
          <H2 className="label">{t('common:taxed-amount')}</H2>
          <span className="number big">
            <AnimationStyles>
              <TransitionGroup>
                <CSSTransition
                  unmountOnExit
                  className="count"
                  classNames="count"
                  key={JSON.stringify(value)}
                  timeout={{ enter: 400, exit: 400 }}
                >
                  <span className="total">{formatMoney(value.amount * (1 + vat))}</span>
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
  value: PropTypes.object,
  vat: PropTypes.number,
};
