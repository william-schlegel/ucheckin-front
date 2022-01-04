import { Status, Wrapper } from '@googlemaps/react-wrapper';
import useTranslation from 'next-translate/useTranslation';
import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';

import ButtonCancel from '../Buttons/ButtonCancel';
import ButtonValidation from '../Buttons/ButtonValidation';
import Drawer, { DrawerFooter } from '../Drawer';
import DisplayError from '../ErrorMessage';
import Loading from '../Loading';
import { Block, Form, FormBody, Label, RowFull } from '../styles/Card';

const APIKey = process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY;

let autoComplete;

export default function EventMap({ open, onClose, location, setLocation, lat, lng }) {
  const { t } = useTranslation('event');
  const [center, setCenter] = useState({ lat, lng });
  const locationRef = useRef();
  const [newLoc, setNewLoc] = useState(location);

  const render = (status) => {
    if (status === Status.FAILURE) return <DisplayError error={'error google maps'} />;
    if (status === Status.LOADING) return <Loading />;
  };

  if (locationRef.current && !autoComplete) {
    console.log(`locationRef`, locationRef.current);
    autoComplete = new window.google.maps.places.Autocomplete(locationRef.current, {
      fields: ['geometry', 'formatted_address'],
      types: ['address'],
    });
    autoComplete.addListener('place_changed', handlePlace);
  }

  async function handlePlace() {
    const address = autoComplete.getPlace();
    console.log(`address`, address);
    setNewLoc(address.formatted_address);
    if (address.geometry) {
      const newCent = {
        lat: address.geometry.location.lat(),
        lng: address.geometry.location.lng(),
      };
      console.log(`newCent`, newCent);
      setCenter(newCent);
    }
  }

  return (
    <Drawer onClose={onClose} open={open} title={t('location')}>
      <Wrapper apiKey={APIKey} render={render} libraries={['places']}>
        <Form onSubmit={(e) => e.preventDefault()}>
          <FormBody>
            <RowFull>
              <Label htmlFor="location" required>
                {t('location')}
              </Label>
              <Block>
                <input
                  ref={locationRef}
                  type="text"
                  required
                  id="location"
                  name="location"
                  value={newLoc}
                  onChange={(e) => setNewLoc(e.target.value)}
                />
              </Block>
            </RowFull>
          </FormBody>
        </Form>
        <div style={{ width: '100%', height: '50vh' }}>
          <Map center={center} zoom={12} />
        </div>
        <DrawerFooter>
          <ButtonValidation
            onClick={() => {
              setLocation(newLoc, center.lat, center.lng);
              autoComplete = null;
              onClose();
            }}
          />
          <ButtonCancel
            onClick={() => {
              autoComplete = null;

              onClose();
            }}
          />
        </DrawerFooter>
      </Wrapper>
    </Drawer>
  );
}

EventMap.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  setLocation: PropTypes.func.isRequired,
  location: PropTypes.string,
  lat: PropTypes.number,
  lng: PropTypes.number,
};

function Map({ center, zoom }) {
  const ref = useRef(null);
  const [map, setMap] = useState();
  const [marker, setMarker] = useState();

  useEffect(() => {
    if (ref.current && !map) setMap(new window.google.maps.Map(ref.current, { zoom }));
    if (map) {
      map.setOptions({ center });
    }
  }, [ref, map, center, zoom]);

  useEffect(() => {
    if (map && !marker)
      setMarker(
        new window.google.maps.Marker({
          icon: '/images/map-pin.png',
          map,
        })
      );
    if (marker) {
      console.log(`center`, center);
      marker.setOptions({ position: center });
      marker.setVisible(true);
    }
  }, [map, marker, center]);

  return <div ref={ref} style={{ width: '100%', height: '100%' }} />;
}
