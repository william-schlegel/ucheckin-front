import PropTypes from 'prop-types';
import styled from 'styled-components';

export default function SegmentedControl({ options, value, onChange }) {
  return (
    <Container>
      {options.map((o) => (
        <Item
          key={o.value}
          onClick={() => onChange(o.value)}
          active={o.value === value}
          disabled={o.disabled}
        >
          {o.label}
        </Item>
      ))}
    </Container>
  );
}

SegmentedControl.propTypes = {
  options: PropTypes.array,
  value: PropTypes.string,
  onChange: PropTypes.func,
};

const Container = styled.div`
  display: flex;
  padding: 0.25em;
  gap: 0.125em;
  flex-wrap: wrap;
  border: 1px solid var(--primary);
  border-radius: 5px;
`;

const Item = styled.div`
  padding: 5px 15px;
  background-color: ${(props) =>
    props.disabled ? 'var(--light-grey)' : props.active ? 'var(--secondary)' : 'var(--primary)'};
  color: ${(props) => (props.disabled ? 'var(--text-color)' : 'white')};
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  border-radius: 5px;
`;
