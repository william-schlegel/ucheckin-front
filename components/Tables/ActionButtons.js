import PropTypes from 'prop-types';
import styled from 'styled-components';

import ActionButton from '../Buttons/ActionButton';

const ActionButtonsStyled = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  height: 100%;
  a {
    display: inline;
  }
`;

export default function ActionButtons({ actionButtons, values }) {
  return (
    <ActionButtonsStyled>
      {actionButtons.map((actionButton) => (
        <ActionButton
          key={actionButton.type}
          type={actionButton.type}
          cb={() => actionButton.action(values[actionButton.value || 'id'])}
        />
      ))}
    </ActionButtonsStyled>
  );
}

ActionButtons.propTypes = {
  actionButtons: PropTypes.array,
  values: PropTypes.object,
};
