import styled from 'styled-components';
import PropTypes from 'prop-types';

const Container = styled.div`
  display: grid;
  width: 100%;
  place-items: center;
`;

const AvatarStyled = styled.img((props) => ({
  width: `${props.size || 150}px`,
  height: 'auto',
  borderRadius: '75px',
}));

export default function Avatar({ size, src, alt, fullWidth }) {
  const dummy = '/images/dummy.jpg';
  if (fullWidth)
    return (
      <Container>
        <AvatarStyled size={size} src={src || dummy} alt={alt} />
      </Container>
    );
  return <AvatarStyled size={size} src={src || dummy} alt={alt} />;
}

Avatar.propTypes = {
  size: PropTypes.number,
  src: PropTypes.string,
  alt: PropTypes.string,
  fullWidth: PropTypes.bool,
};

Avatar.defaultProps = {
  size: 150,
  alt: '',
  fullWidth: false,
};
