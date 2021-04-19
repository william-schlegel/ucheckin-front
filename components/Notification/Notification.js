import { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { useLazyQuery, useMutation } from '@apollo/client';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';
import Select from 'react-select';
import gql from 'graphql-tag';
import { PlusCircle, Code, Youtube } from 'react-feather';
import { Confirm } from 'notiflix';

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
  Separator,
  H3,
} from '../styles/Card';
import useForm from '../../lib/useForm';
import { SearchUser } from '../SearchUser';
import ButtonBack from '../Buttons/ButtonBack';
import ButtonCancel from '../Buttons/ButtonCancel';
import ButtonValidation from '../Buttons/ButtonValidation';
import ButtonDelete from '../Buttons/ButtonDelete';
import NotificationType, {
  useNotificationName,
} from '../Tables/NotificationType';
import {
  NOTIFICATION_QUERY,
  DELETE_NOTIFICATION_MUTATION,
  UPDATE_NOTIFICATION_MUTATION,
  CREATE_NOTIFICATION_MUTATION,
  DELETE_NOTIFICATION_ITEM,
} from './Queries';
import { useHelp, Help, HelpButton } from '../Help';
import { useUser } from '../User/Queries';
import DatePicker from '../DatePicker';
import ValidityDate from '../Tables/ValidityDate';
import Counter from '../Counter';
import NotificationContent from './NotificationContent';
import ActionButton from '../Buttons/ActionButton';
import FieldError from '../FieldError';
import selectTheme from '../styles/selectTheme';

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
  displayType: '',
  image: {},
  imageLink: '',
  htmlContent: '',
  videoLink: 'https://youtu.be/',
  numberOfDisplay: 0,
  delayBetweenDisplay: 1,
  probability: 100,
  defaultNotification: false,
  quota: 0,
};

const makeItem = (itm) => {
  const item = {
    id: itm.id,
    displayType: itm.displayType,
    image: itm.image,
    imageLink: itm.imageLink,
    htmlContent: itm.htmlContent,
    videoLink: itm.videoLink,
    numberOfDisplay: itm.numberOfDisplay || 0,
    delayBetweenDisplay: itm.delayBetweenDisplay || 0,
    probability: itm.probability || 0,
    defaultNotification: !!itm.defaultNotification,
    quota: itm.quota || 0,
  };
  return item;
};
// make mutable object
const makeData = (data) => {
  const dN = data.Notification;
  const newInputs = {
    name: dN.name || '',
    displayName: dN.displayName || '',
    type: dN.type,
    owner: { id: dN.owner?.id, name: dN.owner?.name },
    application: { id: dN.application?.id, name: dN.application?.name },
    signal: { id: dN.signal?.id, name: dN.signal?.name },
    startDate: dN.startDate,
    endDate: dN.endDate,
    items: [],
  };
  for (const nItem of dN.items) {
    newInputs.items.push(makeItem(nItem));
  }
  return newInputs;
};

export default function Notification({ id, initialData }) {
  const router = useRouter();
  const [notifId, setNotifId] = useState(id);

  const [queryNotification, { loading, error, data }] = useLazyQuery(
    NOTIFICATION_QUERY
  );
  const [
    deleteNotification,
    { loading: loadingDelete, error: errorDelete },
  ] = useMutation(DELETE_NOTIFICATION_MUTATION, {
    variables: { id },
    onCompleted: () => {
      router.push('/notifications');
    },
  });
  const [
    updateNotification,
    { loading: loadingUpdate, error: errorUpdate },
  ] = useMutation(UPDATE_NOTIFICATION_MUTATION, {
    onCompleted: () => {
      router.push('/notifications');
    },
  });
  const [
    createNotification,
    { loading: loadingCreate, error: errorCreate },
  ] = useMutation(CREATE_NOTIFICATION_MUTATION, {
    onCompleted: (newItem) => {
      if (notifId) {
        router.push('/notifications');
      }
      setNotifId(newItem.id);
    },
  });
  const [deleteNotificationItem, { error: errorDeleteItem }] = useMutation(
    DELETE_NOTIFICATION_ITEM
  );

  const [queryAppUser, { data: dataApp }] = useLazyQuery(QUERY_APP_FROM_USER);
  const [querySignal, { data: dataSig }] = useLazyQuery(QUERY_SIGNAL_FROM_APP);

  const { helpContent, toggleHelpVisibility, helpVisible } = useHelp(
    'notification'
  );
  const { user } = useUser();
  const { t } = useTranslation('notification');
  const { notificationTypesOptions } = useNotificationName();
  const initialValues = useRef(makeData(initialData.data));
  const {
    inputs,
    handleChange,
    setInputs,
    validate,
    validationError,
    wasTouched,
  } = useForm(initialValues.current, { name: '', displayName: '' });
  const [canEdit, setCanEdit] = useState(false);
  const { role: userRole, id: userId } = user;
  const notifOwnerId = data?.Notification?.owner?.id;
  const [optionsAppUser, setOptionsAppUser] = useState([]);
  const [optionsSignals, setOptionsSignals] = useState([]);
  const [phone, setPhone] = useState(phoneList[0]);
  const [selectedItem, setSelectedItem] = useState(0);
  const [item, setItem] = useState({});
  const [showItem, setShowItem] = useState(false);
  const [nbNotif, setNbNotif] = useState(1);

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
    const uId = initialData?.data?.Notification?.owner?.id;
    if (uId) queryAppUser({ variables: { user: uId } });
  }, [initialData, queryAppUser]);

  function handleChangeUser(value) {
    const uId = value.value;
    queryAppUser({ variables: { user: uId } });
    setOptionsSignals([]);
    handleChange(value);
  }

  function handleChangeType(newType) {
    handleChange({ name: 'type', value: newType.value });
    if (newType.value === 'simple') setNbNotif(1);
    else if (inputs.items.length < 2) setNbNotif(2);
  }

  function handleEditNotif(idNotif) {
    const notif = inputs.items[idNotif];
    // console.log(`handleEditNotif - inputs`, inputs);
    setItem(notif);
    setShowItem(true);
  }

  function handleDeleteNotif(idNotif) {
    Confirm.Show(
      t('confirm-delete'),
      t('you-confirm-item'),
      t('yes-delete'),
      t('no-delete'),
      () => {
        if (inputs.items[idNotif].__typename === 'NotificationItem') {
          deleteNotificationItem({
            variables: { id: inputs.items[idNotif].id },
          });
        }
        const newItems = [...inputs.items];
        newItems.splice(idNotif, 1);
        setItem(null);
        setInputs((prev) => ({ ...prev, items: newItems }));
      }
    );
  }

  function handleCloseItem() {
    setShowItem(false);
  }

  function handleDeleteNotification(e) {
    if (e) e.preventDefault();
    Confirm.Show(
      t('confirm-delete'),
      t('you-confirm'),
      t('yes-delete'),
      t('no-delete'),
      () =>
        deleteNotification({
          update: (cache, payload) =>
            cache.evict(cache.identify(payload.data.deleteNotification)),
          variables: { id },
        })
    );
  }

  function handleUpdateNotification(e) {
    if (e) e.preventDefault();
    const newInputs = validate();
    if (!newInputs) return;

    if (wasTouched('owner.id'))
      newInputs.owner = { connect: { id: newInputs.owner.id } };
    if (wasTouched('application.id'))
      newInputs.application = { connect: { id: newInputs.application.id } };
    if (wasTouched('signal.id'))
      newInputs.signal = { connect: { id: newInputs.signal.id } };
    newInputs.id = id;
    return updateNotification({
      update: (cache, payload) =>
        cache.evict(cache.identify(payload.data.updateNotification)),
      variables: newInputs,
    });
  }

  function handleCreateNotification() {
    const newInputs = validate();
    if (!newInputs) return;

    if (wasTouched('owner.id'))
      newInputs.owner = { connect: { id: newInputs.owner.id } };
    if (wasTouched('application.id'))
      newInputs.application = { connect: { id: newInputs.application.id } };
    if (wasTouched('signal.id'))
      newInputs.signal = { connect: { id: newInputs.signal.id } };
    const variables = {
      data: { ...newInputs },
    };
    return createNotification({
      update: (cache, payload) =>
        cache.evict(cache.identify(payload.data.createNotification)),
      variables,
    });
  }

  async function addContent() {
    if (!notifId) await handleCreateNotification();
    setItem(defaultItem);
    setShowItem(true);
  }

  function handleChangeApp(app) {
    console.log(`app`, app);
    handleChange({
      name: 'application.id',
      value: app?.value,
    });
    if (app?.value) {
      querySignal({ variables: { appId: app.value } });
    }
  }

  useEffect(() => {
    if (data) {
      const newInputs = makeData(data);
      setInputs(newInputs);
      // console.log(`newInputs`, newInputs);
      handleChangeType(newInputs.type);
      handleChangeApp(newInputs.application.id);
      setNbNotif(newInputs.items.length || 1);
    }
  }, [setInputs, data]);

  useEffect(() => {
    // console.log(`inputs`, inputs);
    console.log(`nbNotif`, nbNotif);
    // console.log(`item`, item);
  }, [nbNotif]);

  if (loading || !user) return <Loading />;
  if (error) return <DisplayError error={error} />;
  if (errorDelete) return <DisplayError error={errorDelete} />;
  if (errorUpdate) return <DisplayError error={errorUpdate} />;
  if (errorCreate) return <DisplayError error={errorCreate} />;
  if (errorDeleteItem) return <DisplayError error={errorDeleteItem} />;

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
          notifId={notifId}
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
        <NotificationContainer>
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
                    <FieldError error={validationError.name} />
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
                    <FieldError error={validationError.displayName} />
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
                      theme={selectTheme}
                      className="select"
                      required
                      value={notificationTypesOptions.find(
                        (n) => n.value === inputs.type
                      )}
                      onChange={handleChangeType}
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
                      theme={selectTheme}
                      className="select"
                      required
                      value={optionsAppUser.find(
                        (n) => n.value === inputs.application.id
                      )}
                      onChange={(sel) => handleChangeApp(sel)}
                      options={optionsAppUser}
                    />
                    <FieldError error={validationError.applicationId} />
                  </Row>
                  <Row>
                    <Label required>{t('signal')}</Label>
                    <Select
                      className="select"
                      theme={selectTheme}
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
                  <FieldError error={validationError.signalId} />
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
            <FormBodyFull>
              {inputs.type !== 'simple' && (
                <Row>
                  <Counter
                    input={nbNotif}
                    min={Math.max(inputs.items.length || 0, 2)}
                    max={10}
                    handleChange={(value) => setNbNotif(value.value)}
                    label={t('nb-notif')}
                  />
                </Row>
              )}
              <Row>
                <H3>{t('contents')}</H3>
                <NotifContainer>
                  {inputs.items.map((it, index) => (
                    <Notif
                      key={`NOTIF-${index}`}
                      typeNotif={inputs.type}
                      item={it}
                      onClick={() => setSelectedItem(index)}
                      withDetails
                      deleteNotif={() => handleDeleteNotif(index)}
                      editNotif={() => handleEditNotif(index)}
                    />
                  ))}
                  {inputs.items.length < nbNotif && (
                    <AddNotif onClick={addContent} />
                  )}
                </NotifContainer>
              </Row>
            </FormBodyFull>
          </div>
          <Phone>
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
                  <Notif item={inputs.items[selectedItem]} type={inputs.type} />
                </div>
              </div>
            </div>
          </Phone>
        </NotificationContainer>
        <FormFooter>
          {canEdit && !id && (
            <ButtonValidation
              disabled={loadingCreate}
              onClick={handleCreateNotification}
            />
          )}
          {canEdit && id && (
            <ButtonValidation
              disabled={loadingUpdate}
              onClick={handleUpdateNotification}
              update
            />
          )}
          {canEdit && id && (
            <ButtonDelete
              disabled={loadingDelete}
              onClick={handleDeleteNotification}
            />
          )}
          <ButtonCancel onClick={() => router.back()} />
        </FormFooter>
      </Form>
    </>
  );
}

Notification.propTypes = {
  id: PropTypes.string,
  initialData: PropTypes.object,
};

export function Notif({
  item,
  typeNotif,
  onClick,
  withDetails,
  deleteNotif,
  editNotif,
  style,
}) {
  const [element, setElement] = useState();

  useEffect(() => {
    const el = document.getElementById('html-content-container');
    setElement(el);
  }, []);

  useEffect(() => {
    if (element) element.innerHTML = item.htmlContent;
  }, [element, item]);

  if (!item) return null;
  return (
    <NotifStyle onClick={onClick} style={style}>
      {item.displayType === 'image' && item?.image?.publicUrlTransformed && (
        <img
          className="image"
          src={item.image.publicUrlTransformed}
          alt={item.name}
        />
      )}
      {item.displayType === 'html' && (
        <div className="html-content">
          {withDetails ? (
            <div className="icon">
              <Code size={64} />
            </div>
          ) : (
            <div id="html-content-container" />
          )}
        </div>
      )}
      {item.displayType === 'video' && (
        <div className="html-content">
          <div className="icon">
            <Youtube size={64} />
          </div>
        </div>
      )}
      {withDetails && (
        <div className="details">
          {(typeNotif === 'random-draw' || typeNotif === 'instant-win') && (
            <div className="prct">
              <span>{item.probability}</span>
            </div>
          )}
          <div className="actions">
            <ActionButton type="edit" cb={editNotif} />
            <ActionButton type="trash" cb={deleteNotif} />
          </div>
        </div>
      )}
    </NotifStyle>
  );
}

Notif.propTypes = {
  item: PropTypes.object,
  typeNotif: PropTypes.string,
  onClick: PropTypes.func,
  deleteNotif: PropTypes.func,
  editNotif: PropTypes.func,
  withDetails: PropTypes.bool,
  style: PropTypes.object,
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

const NotificationContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 400px;
  @media (max-width: 1000px) {
    grid-template-columns: 1fr;
  }
`;

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
  grid-template-columns: repeat(8, 1fr);
  grid-gap: 20px;
  width: 100%;
  @media (max-width: 1000px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const NotifStyle = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  overflow: hidden;
  img {
    width: 100%;
    max-width: 100%;
    height: auto;
  }
  .htmlContent {
    padding: 3px;
  }
  .icon {
    display: flex;
    width: 100%;
    height: 100%;
    align-items: center;
    justify-content: center;
    border: 1px solid var(--lightGray);
    padding: 3rem 0;
  }
  .actions {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-evenly;
  }
  .prct {
    width: 100%;
    display: flex;
    color: var(--secondary);
    justify-content: center;
    &:after {
      content: '%';
      margin-left: 0.2rem;
    }
  }
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
        background-color: var(--background);
      }
    }
  }
  @media (max-width: 1000px) {
    display: none;
  }
`;
