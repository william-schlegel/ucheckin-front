import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { ArrowLeft } from 'react-feather';
import styled from 'styled-components';
import { formatDate } from '../DatePicker';

export default function EventContent({ event }) {
  const [element, setElement] = useState();

  useEffect(() => {
    const el = document.getElementById('html-content-container');
    setElement(el);
  }, []);

  useEffect(() => {
    if (element) element.innerHTML = event.eventDescription;
  }, [element, event]);

  return (
    <Container>
      <div className="title">
        <ArrowLeft />
        <span>{event.name}</span>
      </div>
      <div className="image">
        <img
          src={
            event.imageEvent?.publicUrlTransformed
              ? event.imageEvent.publicUrlTransformed
              : '/images/UNKNOWN.png'
          }
          alt="event"
        />
        <div className="event-description-container">
          <p className="event-title">{event.description}</p>
          <p className="location">{`${event.location || '?'}, ${formatDate(
            event.validityStart
          )} - ${formatDate(event.validityEnd)}`}</p>
        </div>
      </div>
      <div className="event-description" id="html-content-container" />
    </Container>
  );
}

EventContent.propTypes = {
  event: PropTypes.object,
};

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-rows: 50px 30% auto;
  .title {
    background-color: var(--green);
    color: white;
    padding: 2px;
    display: grid;
    grid-template-columns: 25px auto;
    grid-gap: 10px;
    align-items: center;
    font-size: 18px;
    overflow: hidden;
    span {
      white-space: nowrap;
      text-overflow: clip;
      font-weight: 300;
    }
  }
  .image {
    position: relative;
    overflow: hidden;
    img {
      width: 100%;
      height: auto;
      object-fit: none;
      object-position: 50% 50%;
    }
    .event-description-container {
      padding: 5px;
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      background-color: rgba(255, 255, 255, 0.4);
      font-size: 14px;
      p {
        margin: 0;
      }
      .event-title {
        color: white;
        text-transform: uppercase;
        font-weight: 400;
      }
      .location {
        color: black;
        font-weight: 400;
      }
    }
  }
  .event-description {
    padding: 1rem;
    font-size: 15px;
    font-weight: 300;
    overflow: hidden;
  }
`;
