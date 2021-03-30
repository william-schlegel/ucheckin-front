import { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { useLazyQuery } from '@apollo/client';
import useTranslation from 'next-translate/useTranslation';
import Router from 'next/router';
import Select from 'react-select';
import gql from 'graphql-tag';
import { PlusCircle } from 'react-feather';

import styled from 'styled-components';
import Head from 'next/head';
import DisplayError from '../ErrorMessage';
import Loading from '../Loading';
import {
  Block,
  Form,
  FormBody,
  FormFooter,
  Row,
  Label,
  FormHeader,
  FormTitle,
  RowReadOnly,
  RowFull,
  FormBodyFull,
} from '../styles/Card';
import useForm from '../../lib/useForm';
import { SearchUser } from '../SearchUser';
// import NotificationDelete from './NotificationDelete';
// import NotificationUpdate from './NotificationUpdate';
import ButtonBack from '../Buttons/ButtonBack';
import ButtonCancel from '../Buttons/ButtonCancel';
import NotificationType, {
  useNotificationName,
} from '../Tables/NotificationType';
import { NOTIFICATION_QUERY } from './Queries';
import { useHelp, Help, HelpButton } from '../Help';
import { useUser } from '../User/Queries';
import DatePicker from '../DatePicker';
import ValidityDate from '../Tables/ValidityDate';
import Counter from '../Counter';
import { PrimaryButtonStyled } from '../styles/Button';
import NotificationContent from './NotificationContent';

const QUERY_APP_FROM_USER = gql`
  query QUERY_APP_FROM_USER($user: ID!) {
    allApplications(where: { owner: { id: $user } }) {
      id
      name
    }
  }
`;

const QUERY_SIGNAL_FROM_APP = gql`
  query QUERY_SIGNAL_FROM_APP($appId: ID!) {
    allSignals(where: { licenses_some: { application: { id: $appId } } }) {
      id
      name
    }
  }
`;

const phoneList = [
  { value: '16:9', label: 'iphone 8,Pixel 2 (16:9)', ratio: 16 / 9 },
  { value: '18:9', label: 'Galaxy S9, OnePlus 5T (18:9)', ratio: 18 / 9 },
  { value: '19:9', label: 'Galaxy S10, OnePlus 6 (19:9)', ratio: 19 / 9 },
  { value: '21:9', label: 'XPeria 10 (21:9)', ratio: 21 / 9 },
  { value: 'X', label: 'iphone X', ratio: 2436 / 1125 },
  { value: '12', label: 'iphone 12', ratio: 2340 / 1080 },
  { value: '12pro', label: 'iphone 12 Pro', ratio: 2532 / 1170 },
];

const defaultItem = {
  id: '',
  displayType: '',
  image: '',
  imageLink: '',
  htmlContent: '',
  videoLink: 'https://youtu.be/',
  numberOfDisplay: 0,
  delayBetweenDisplay: 1,
  probability: 100,
  defaultNotification: false,
  quota: 0,
};

export default function Notification({ id, initialData }) {
  const [queryNotification, { loading, error, data }] = useLazyQuery(
    NOTIFICATION_QUERY
  );
  const [queryAppUser, { data: dataApp }] = useLazyQuery(QUERY_APP_FROM_USER);
  const [querySignal, { data: dataSig }] = useLazyQuery(QUERY_SIGNAL_FROM_APP);

  const { helpContent, toggleHelpVisibility, helpVisible } = useHelp(
    'notification'
  );
  const user = useUser();
  const { t } = useTranslation('notification');
  const { notificationTypesOptions } = useNotificationName();
  const initialValues = useRef({
    ...initialData.data.Notification,
    nbNotif: 2,
  });
  const { inputs, handleChange, setInputs } = useForm(initialValues.current);
  const [canEdit, setCanEdit] = useState(false);
  const { role: userRole, id: userId } = user;
  const notifOwnerId = data?.Notification?.owner?.id;
  const [optionsAppUser, setOptionsAppUser] = useState([]);
  const [optionsSignals, setOptionsSignals] = useState([]);
  const [phone, setPhone] = useState(phoneList[0]);
  const [selectedItem, setSelectedItem] = useState(0);
  const [item, setItem] = useState({});
  const [showItem, setShowItem] = useState(false);

  useEffect(() => {
    if (userRole) {
      setCanEdit(userRole?.canManageApplication || notifOwnerId === userId);
    }
  }, [userRole, userId, notifOwnerId]);

  useEffect(() => {
    if (dataApp?.allApplications) {
      setOptionsAppUser(
        dataApp.allApplications.map((d) => ({ value: d.id, label: d.name }))
      );
      setOptionsSignals([]);
    }
  }, [dataApp, setOptionsAppUser]);

  useEffect(() => {
    if (dataSig?.allSignals) {
      setOptionsSignals(
        dataSig.allSignals.map((d) => ({ value: d.id, label: d.name }))
      );
    }
  }, [dataSig, setOptionsSignals]);

  useEffect(() => {
    if (id) {
      queryNotification({
        variables: { id },
      });
    }
  }, [id, queryNotification]);

  useEffect(() => {
    if (data?.id) {
      setInputs(data.Notification);
    }
  }, [setInputs, data]);

  useEffect(() => {
    const uId = initialData?.data?.Notification?.owner?.id;
    if (uId) queryAppUser({ variables: { user: uId } });
  }, [initialData, queryAppUser]);

  function handleChangeUser(value) {
    const uId = value.value;
    queryAppUser({ variables: { user: uId } });
    setOptionsSignals([]);
    handleChange(value);
  }

  function addContent() {
    const newItem = inputs.items[selectedItem]?.id
      ? inputs.items[selectedItem]
      : defaultItem;
    setItem(newItem);
    setShowItem(true);
  }

  function handleCloseItem() {
    setShowItem(false);
  }

  if (loading || !user) return <Loading />;
  if (error) return <DisplayError error={error} />;

  console.log(`inputs`, inputs);
  console.log(`item`, item);

  return (
    <>
      <Head>
        <title>{t('notification')}</title>
      </Head>
      <Help
        contents={helpContent}
        visible={helpVisible}
        handleClose={toggleHelpVisibility}
      />
      {showItem && (
        <NotificationContent
          open={showItem}
          onClose={handleCloseItem}
          item={item}
          setItem={setItem}
          typeNotif={inputs.type}
        />
      )}{' '}
      <Form>
        <FormHeader>
          <FormTitle>
            {id ? (
              <>
                {t('notification')} <span>{inputs.name}</span>
              </>
            ) : (
              <>{t('new-notification')}</>
            )}
            <HelpButton showHelp={toggleHelpVisibility} />
          </FormTitle>
          <ButtonBack
            route="/notifications"
            label={t('navigation:notifications')}
          />
        </FormHeader>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px' }}>
          <div className="content-form">
            <FormBody>
              {canEdit ? (
                <>
                  <Row>
                    <Label htmlFor="name" required>
                      {t('name')}
                    </Label>
                    <input
                      required
                      type="text"
                      id="name"
                      name="name"
                      value={inputs.name}
                      onChange={handleChange}
                    />
                  </Row>
                  <Row>
                    <Label htmlFor="displayName" required>
                      {t('display-name')}
                    </Label>
                    <input
                      required
                      type="text"
                      id="displayName"
                      name="displayName"
                      value={inputs.displayName}
                      onChange={handleChange}
                    />
                  </Row>
                  <Row>
                    <Label>{t('common:owner')}</Label>
                    <SearchUser
                      required
                      name="owner.id"
                      value={inputs.owner.id}
                      onChange={handleChangeUser}
                    />
                  </Row>
                  <Row>
                    <Label>{t('type')}</Label>
                    <Select
                      className="select"
                      required
                      value={notificationTypesOptions.find(
                        (n) => n.value === inputs.type
                      )}
                      onChange={(n) =>
                        handleChange({ name: 'type', value: n.value })
                      }
                      options={notificationTypesOptions}
                    />
                  </Row>
                  {inputs.type && (
                    <RowFull>
                      <span>{t(`${inputs.type}-desc`)}</span>
                    </RowFull>
                  )}
                  <Row>
                    <Block>
                      <Label htmlFor="startDate">{t('start-date')} </Label>
                      <DatePicker
                        id="startDate"
                        ISOStringValue={inputs.startDate}
                        onChange={(dt) =>
                          handleChange({
                            name: 'startDate',
                            value: dt.toISOString(),
                          })
                        }
                      />
                    </Block>
                  </Row>
                  <Row>
                    <Block>
                      <Label htmlFor="endDate">{t('end-date')} </Label>
                      <DatePicker
                        id="endDate"
                        ISOStringValue={inputs.endDate}
                        onChange={(dt) =>
                          handleChange({
                            name: 'endDate',
                            value: dt.toISOString(),
                          })
                        }
                      />
                    </Block>
                  </Row>
                  <Row>
                    <Label required>{t('application')}</Label>
                    <Select
                      className="select"
                      required
                      value={optionsAppUser.find(
                        (n) => n.value === inputs.application.id
                      )}
                      onChange={(n) => {
                        handleChange({
                          name: 'application.id',
                          value: n.value,
                        });
                        if (n.value)
                          querySignal({ variables: { appId: n.value } });
                      }}
                      options={optionsAppUser}
                    />
                  </Row>
                  <Row>
                    <Label required>{t('signal')}</Label>
                    <Select
                      className="select"
                      required
                      value={optionsSignals.find(
                        (n) => n.value === inputs.signal.id
                      )}
                      onChange={(n) =>
                        handleChange({
                          name: 'signal.id',
                          value: n.value,
                        })
                      }
                      options={optionsSignals}
                    />
                  </Row>
                </>
              ) : (
                <>
                  <RowReadOnly>
                    <Label>{t('name')}</Label>
                    <span>{inputs.name}</span>
                  </RowReadOnly>
                  <RowReadOnly>
                    <Label>{t('display-name')}</Label>
                    <span>{inputs.displayName}</span>
                  </RowReadOnly>
                  <RowReadOnly>
                    <Label>{t('common:owner')}</Label>
                    <span>{inputs.owner.name}</span>
                  </RowReadOnly>
                  <RowReadOnly>
                    <Label>{t('type')}</Label>
                    <span>{NotificationType(inputs.type)}</span>
                  </RowReadOnly>
                  {inputs.type && (
                    <RowFull>
                      <span>{t(`${inputs.type}-desc`)}</span>
                    </RowFull>
                  )}
                  <RowReadOnly>
                    <Label>{t('start-date')}</Label>
                    <ValidityDate value={inputs.startDate} after />
                  </RowReadOnly>
                  <RowReadOnly>
                    <Label>{t('end-date')}</Label>
                    <ValidityDate value={inputs.startDate} />
                  </RowReadOnly>
                  <RowReadOnly>
                    <Label>{t('application')}</Label>
                    <span>{inputs.application.name}</span>
                  </RowReadOnly>
                  <RowReadOnly>
                    <Label>{t('signal')}</Label>
                    <span>{inputs.signal.name}</span>
                  </RowReadOnly>
                </>
              )}
            </FormBody>
            <Separator />
            {inputs.type === 'simple' ? (
              <PrimaryButtonStyled type="button" onClick={addContent}>
                <PlusCircle />
                <span>{t('create-content')}</span>
              </PrimaryButtonStyled>
            ) : (
              <FormBodyFull>
                <Row>
                  <Counter
                    input={inputs.nbNotif}
                    min={Math.max(inputs.items.length || 0, 2)}
                    max={10}
                    name="nbNotif"
                    handleChange={handleChange}
                    label={t('nb-notif')}
                  />
                </Row>
                <Row>
                  <NotifContainer>
                    {inputs.items.map((it, index) => (
                      <Notif item={it} onClick={() => setSelectedItem(index)} />
                    ))}
                    {inputs.items.length < 10 && (
                      <AddNotif onClick={addContent} />
                    )}
                  </NotifContainer>
                </Row>
              </FormBodyFull>
            )}
          </div>
          <Phone>
            <div style={{ width: '100%' }}>
              <Select
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
                  <Notif item={inputs.items[selectedItem]} />
                </div>
              </div>
            </div>
          </Phone>
        </div>
        <FormFooter>
          {/* {canEdit && id && (
            <NotificationUpdate
              id={id}
              updatedApp={inputs}
              onSuccess={() => Router.push('/notifications')}
            />
          )}
          {canEdit && id && <NotificationDelete id={id} />} */}
          <ButtonCancel onClick={() => Router.back()} />
        </FormFooter>
      </Form>
    </>
  );
}

Notification.propTypes = {
  id: PropTypes.string,
  initialData: PropTypes.object,
};

function Notif({ item, onClick }) {
  if (!item) return null;
  return (
    <NotifStyle onClick={onClick}>
      <div className="title">item.name</div>
      {item?.photo?.publicUrlTransformed && (
        <img
          className="image"
          src={item.photo.publicUrlTransformed}
          alt={item.name}
        />
      )}
    </NotifStyle>
  );
}

Notif.propTypes = {
  item: PropTypes.object,
  onClick: PropTypes.func,
};

function AddNotif({ onClick }) {
  return (
    <AddContainer>
      <button type="button" onClick={onClick}>
        <PlusCircle size={32} />
      </button>
    </AddContainer>
  );
}

AddNotif.propTypes = {
  onClick: PropTypes.func,
};

const AddContainer = styled.div`
  display: grid;
  place-items: center;
  border: 1px dashed var(--lightGray);
  button {
    border: none;
    width: 100%;
    height: 100%;
    background-color: transparent;
    outline: none;
    margin: 4rem 0;
    color: var(--primary);
    transition: transform 300ms ease-in-out;
    &:hover {
      color: var(--secondary);
      transform: scale(1.2);
    }
  }
`;

const NotifContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  grid-gap: 20px;
  width: 100%;
`;

const NotifStyle = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const Separator = styled.div`
  padding-top: 1rem;
  margin: 0.5rem 0;
  border-bottom: 1px solid var(--lightGray);
`;

const Phone = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .content-form {
    display: flex;
    width: 100%;
  }
  .phone {
    border: 1px solid green;
    display: flex;
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
      }
    }
  }
`;
