import PropTypes from 'prop-types';

export default function NavButton({ children, callback }) {
  return (
    <button type="button" onClick={callback}>
      {children}
    </button>
  );
}

NavButton.propTypes = {
  children: PropTypes.object,
  callback: PropTypes.func,
};
