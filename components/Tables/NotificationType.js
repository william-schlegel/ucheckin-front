import useTranslation from 'next-translate/useTranslation';
import PropTypes from 'prop-types';
import { useRef } from 'react';
import styled from 'styled-components';

const notificationTypes = [
  'simple',
  'random-draw',
  'instant-win',
  'treasure-hunt',
];

export function useNotificationName() {
  const { t } = useTranslation('notification');
  const options = useRef(
    notificationTypes.map((n) => ({
      value: n,
      label: t(n),
    }))
  );
  const notificationTypesOptions = options.current;
  return {
    notificationTypes,
    notificationTypesOptions,
  };
}

const NotificationStyled = styled.div`
  display: flex;
  align-items: center;
  justify-content: start;
  margin: 0 0.5rem 0 1rem;
  img {
    width: 40px;
    max-width: 25%;
    height: auto;
    margin-right: 1rem;
    border-radius: 100px;
  }
`;

export default function NotificationType({ notification }) {
  const { t } = useTranslation('notification');
  if (!notification) return <span>...</span>;
  return <NotificationStyled>{t(notification)}</NotificationStyled>;
}

NotificationType.propTypes = {
  notification: PropTypes.string,
};
