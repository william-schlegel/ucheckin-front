import PropTypes from 'prop-types';
import useTranslation from 'next-translate/useTranslation';
import GoogleMapReact from 'google-map-react';
import { MapPin } from 'react-feather';

import Drawer, { DrawerFooter } from '../Drawer';
import ButtonValidation from '../Buttons/ButtonValidation';
import ButtonCancel from '../Buttons/ButtonCancel';

const APIKey = process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY;
console.log(`APIKey`, APIKey);

export default function EventMap({
  open,
  onClose,
  location,
  setLocation,
  lat,
  lng,
}) {
  const { t } = useTranslation('event');
  console.log(`location`, { location, lat, lng });
  return (
    <Drawer onClose={onClose} open={open} title={t('new-event')}>
      <div style={{ width: '100%', height: '50vh' }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: APIKey }}
          defaultCenter={{ lat, lng }}
          defaultZoom={12}
        >
          <MapPin
            size={32}
            lat={lat}
            lng={lng}
            style={{ color: 'var(--secondary)' }}
          />
        </GoogleMapReact>
      </div>
      <DrawerFooter>
        <ButtonValidation onClick={setLocation} />
        <ButtonCancel onClick={onClose} />
      </DrawerFooter>
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
