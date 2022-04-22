import useTranslation from 'next-translate/useTranslation';
import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import useOnClickOutside from '../../lib/useOnClickOutside';
import { formatDate } from '../DatePicker';
import { useUser } from '../User/Queries';

const STATUS = [
  { key: 'ordered', color: '#3cd1ef' },
  { key: 'received', color: '#3c8fef' },
  { key: 'prepared', color: '#deeb88' },
  { key: 'tested', color: '#b3c154' },
  { key: 'affected', color: '#e3b679' },
  { key: 'delivered', color: '#fb9e1f' },
  { key: 'maintenance', color: '#d933c8' },
  { key: 'dead', color: '#e31a1c' },
  { key: 'operational', color: 'var(--green)' },
  { key: 'unassigned', color: 'var(--red)' },
];

export default function UmixStatus({ status, modificationDate, onChangeStatus, noChange }) {
  const { t } = useTranslation('umix');
  const [color, setColor] = useState('#aaa');
  const [show, setShow] = useState(false);
  const refMenu = useRef();
  const user = useUser();

  useEffect(() => {
    const col = STATUS.find((c) => c.key === status);
    if (col) {
      setColor(col.color);
    }
  }, [status]);

  function onSelect(key) {
    onChangeStatus(key);
    setShow(false);
  }

  useOnClickOutside(refMenu, () => setShow(false));

  function handleClick() {
    if (!noChange && user.user.role.canManageAllUmix) setShow(true);
  }

  return (
    <StatusContainer
      ref={refMenu}
      onClick={handleClick}
      admin={!noChange && user?.user?.role?.canManageAllUmix}
    >
      <ColorBox color={color} />
      <span>{t(status)}</span>
      {modificationDate && <span>{formatDate(modificationDate)}</span>}
      <SelectStatus show={show} onSelect={onSelect} />
    </StatusContainer>
  );
}

export function SelectStatus({ show, onSelect }) {
  const { t } = useTranslation('umix');
  function handleSelect(key) {
    onSelect(key);
  }

  if (!show) return null;
  return (
    <SelectContainer>
      {STATUS.map((s) => (
        <SelectItem key={s.key} onClick={() => handleSelect(s.key)}>
          <ColorBox color={s.color} />
          <span>{t(s.key)}</span>
        </SelectItem>
      ))}
    </SelectContainer>
  );
}

const SelectContainer = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  border: var(--light-grey) 1px solid;
  background-color: var(--background);
  z-index: 1;
`;

const SelectItem = styled.div`
  display: flex;
  justify-content: start;
  align-items: center;
  gap: 1em;
  cursor: pointer;
  margin: 0;
  padding: 0.25rem 1rem;
  &:hover {
    background-color: var(--light-grey);
  }
`;

const StatusContainer = styled.div`
  position: relative;
  display: flex;
  justify-content: start;
  align-items: center;
  width: 100%;
  flex-wrap: wrap;
  gap: 1em;
  cursor: ${(props) => (props.admin ? 'pointer' : 'default')};
`;

const ColorBox = styled.div`
  width: 1em;
  height: 1em;
  border: 1px solid #222;
  background-color: ${(props) => props.color};
`;
