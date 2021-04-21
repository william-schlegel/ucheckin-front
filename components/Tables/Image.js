import PropTypes from 'prop-types';
import styled from 'styled-components';

const ImgContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;
const Img = styled.img`
  max-width: ${(props) => (props.ratio || 1) * props.size}px;
  max-height: ${(props) => props.size}px;
  height: ${(props) => props.size}px;
  width: ${(props) => (props.ratio ? `${props.size * props.ratio}px` : 'auto')};
  border: ${(props) => (props.border ? 'solid 1px var(--lightGray)' : 'none')};
  border-radius: ${(props) => (props.rounded ? `${props.size}px` : 0)};
`;

export default function Image({ image, size, ratio, border, rounded }) {
  console.log(`image`, image);
  return (
    <ImgContainer>
      <Img
        src={
          !image?.publicUrlTransformed
            ? '/images/UNKNOWN.png'
            : image.publicUrlTransformed
        }
        alt=""
        size={size}
        ratio={ratio}
        border={border}
        rounded={rounded}
      />
    </ImgContainer>
  );
}

Image.defaultProps = {
  size: 50,
  ratio: 1,
};

Image.propTypes = {
  image: PropTypes.object,
  size: PropTypes.number,
  ratio: PropTypes.number,
  border: PropTypes.bool,
  rounded: PropTypes.bool,
};
