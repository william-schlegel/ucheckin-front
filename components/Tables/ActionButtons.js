import styled from 'styled-components';
import PropTypes from 'prop-types';
import ActionButton from '../Buttons/ActionButton';

const ActionButtonsStyled = styled.div`
  display: flex;
  a {
    display: inline;
  }
`;

export default function ActionButtons({ columnValue, cellValue }) {
  return (
    <ActionButtonsStyled>
      {columnValue.map((actionButton) => (
        <ActionButton
          key={actionButton.type}
          type={actionButton.type}
          cb={() => actionButton.action(cellValue)}
        />
      ))}
    </ActionButtonsStyled>
  );
}

ActionButtons.propTypes = {
  columnValue: PropTypes.array,
  cellValue: PropTypes.any,
};
