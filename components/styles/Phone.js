import { useState } from 'react';
import Select from 'react-select';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import selectTheme from './selectTheme';

const phoneList = [
  { value: '16:9', label: 'iphone 8,Pixel 2 (16:9)', ratio: 16 / 9 },
  { value: '18:9', label: 'Galaxy S9, OnePlus 5T (18:9)', ratio: 18 / 9 },
  { value: '19:9', label: 'Galaxy S10, OnePlus 6 (19:9)', ratio: 19 / 9 },
  { value: '21:9', label: 'XPeria 10 (21:9)', ratio: 21 / 9 },
  { value: 'X', label: 'iphone X', ratio: 2436 / 1125 },
  { value: '12', label: 'iphone 12', ratio: 2340 / 1080 },
  { value: '12pro', label: 'iphone 12 Pro', ratio: 2532 / 1170 },
];

export default function Phone({ children }) {
  const [phone, setPhone] = useState(phoneList[0]);

  return (
    <PhoneStyled>
      <div style={{ width: '100%' }}>
        <Select
          theme={selectTheme}
          value={phone}
          onChange={(p) => setPhone(p)}
          options={phoneList}
        />
      </div>

      <div className="phone">
        <div className="content">
          <div
            className="place-holder"
            style={{ width: '300px', height: `${300 * phone.ratio}px` }}
          >
            {children}
          </div>
        </div>
      </div>
    </PhoneStyled>
  );
}

const PhoneStyled = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .content-form {
    display: flex;
    width: 100%;
  }
  .phone {
    display: flex;
    box-shadow: var(--bs-card);
    justify-content: center;
    align-items: center;
    margin: 10px;
    padding: 20px 5px;
    border-radius: 20px;
    background-color: black;
    .content {
      border: 1px solid black;
      position: relative;
      .place-holder {
        left: 0;
        top: 0;
        background-color: white;
        color: black;
      }
    }
  }
  @media (max-width: 1000px) {
    display: none;
  }
`;

Phone.propTypes = {
  children: PropTypes.node,
};
