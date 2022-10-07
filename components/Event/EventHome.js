import PropTypes from 'prop-types';
import styled from 'styled-components';

import { formatDate } from '../DatePicker';

export default function EventHome({ event }) {
  return (
    <Container>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={event.imageHome?.publicUrlTransformed || '/images/UNKNOWN.png'} alt="home icon" />
      <div>
        <p className="title">{event.name}</p>
        <p className="localisation">{`${event.location || '?'}, ${formatDate(
          event.validityStart
        )} - ${formatDate(event.validityEnd)}`}</p>
        <p className="description">{event.description}</p>
      </div>
    </Container>
  );
}

EventHome.propTypes = {
  event: PropTypes.object,
};

const Container = styled.div`
  display: grid;
  grid-template-columns: 105px auto;
  grid-gap: 1em;
  font-size: 13px;
  background-color: white;
  box-shadow: var(--bs);
  color: #444;
  border-radius: 5px;
  img {
    height: 100px;
    width: auto;
    border-radius: 100px;
    margin: auto;
    padding: 2px;
  }
  p {
    margin: 0.15em;
  }
  .title {
    text-transform: uppercase;
    font-size: 1.3em;
    letter-spacing: -1px;
    font-weight: 200;
  }
  .localisation {
    font-weight: 500;
    font-size: 1em;
  }
  .description {
    font-size: 1em;
    font-weight: 200;
  }
`;
