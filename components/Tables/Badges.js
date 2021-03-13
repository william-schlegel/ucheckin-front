import PropTypes from 'prop-types';
import Badge from './Badge';

export default function Badges({ labels = [] }) {
  return labels.map((label) => {
    let text = label;
    if (!(typeof label === 'string')) {
      if (label.__typename === 'User') text = label.name;
    }
    return <Badge key={text} label={text} />;
  });
}

Badge.defaultProps = {
  labels: [],
};

Badge.propTypes = {
  labels: PropTypes.array,
};
