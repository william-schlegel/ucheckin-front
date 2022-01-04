/* eslint-disable @next/next/no-img-element */
import { useLazyQuery, useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import isEmpty from 'lodash.isempty';
import Head from 'next/head';
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Code, PlusCircle, Youtube } from 'react-feather';
import Select from 'react-select';
import styled from 'styled-components';

import { formatPrct } from '../../lib/formatNumber';
import { serializeHtml } from '../../lib/serializeDocument';
import useAction from '../../lib/useAction';
import useConfirm from '../../lib/useConfirm';
import useForm from '../../lib/useForm';
import ActionButton from '../Buttons/ActionButton';
import ButtonBack from '../Buttons/ButtonBack';
import ButtonCancel from '../Buttons/ButtonCancel';
import ButtonDelete from '../Buttons/ButtonDelete';
import ButtonValidation from '../Buttons/ButtonValidation';
import Counter from '../Counter';
import DatePicker, { dateNow } from '../DatePicker';
import DisplayError from '../ErrorMessage';
import FieldError from '../FieldError';
import { Help, HelpButton, useHelp } from '../Help';
import { SearchUser } from '../SearchUser';
import {
  Block,
  Form,
  FormBody,
  FormBodyFull,
  FormFooter,
  FormHeader,
  FormTitle,
  H3,
  Label,
  Row,
  RowFull,
  RowReadOnly,
  Separator,
} from '../styles/Card';
import { ImageSelection } from '../styles/ImageSelection';
import Phone from '../styles/Phone';
import selectTheme from '../styles/selectTheme';
import Image from '../Tables/Image';
import NotificationType, { useNotificationName } from '../Tables/NotificationType';
import ValidityDate from '../Tables/ValidityDate';
import { useUser } from '../User/Queries';
import NotificationContent from './NotificationContent';
import {
  DELETE_NOTIFICATION_ITEM,
  DELETE_NOTIFICATION_MUTATION,
  UPDATE_NOTIFICATION_MUTATION,
} from './Queries';

export const QUERY_EVENT_FROM_USER = gql`
  query QUERY_EVENT_FROM_USER($user: ID!) {
    events(where: { owner: { id: { equals: $user } } }) {
      id
      name
    }
  }
`;

export const QUERY_APP_FROM_USER = gql`
  query QUERY_APP_FROM_USER($user: ID!) {
    applications(where: { owner: { id: { equals: $user } } }) {
      id
      name
    }
  }
`;

export const QUERY_SIGNAL_FROM_APP = gql`
  query QUERY_SIGNAL_FROM_APP($appId: ID!) {
    signals(where: { licenses: { some: { application: { id: { equals: $appId } } } } }) {
      id
      name
    }
  }
`;

let confirmCB = () => {};

const defaultItem = {
  displayType: '',
  image: {},
  imageLink: '',
  htmlContent: { document: undefined },
  videoLink: 'https://youtu.be/',
  numberOfDisplay: 0,
  probability: 50,
  defaultNotification: false,
  quota: 0,
};
export default function Notification({ id, initialData }) {
  const router = useRouter();
  const { setAction } = useAction();

  const [deleteNotification, { loading: loadingDelete, error: errorDelete }] = useMutation(
    DELETE_NOTIFICATION_MUTATION,
    {
      variables: { id },
      onCompleted: (data) => {
        setAction(
          'delete',
          'notification',
          data.deleteNotification.id,
          data.deleteNotification.name
        );
        router.push('/notifications');
      },
    }
  );
  const [updateNotification, { loading: loadingUpdate, error: errorUpdate }] = useMutation(
    UPDATE_NOTIFICATION_MUTATION,
    {
      onCompleted: () => {
        setAction('update', 'notification', id);
        router.push('/notifications');
      },
    }
  );
  const [deleteNotificationItem, { error: errorDeleteItem }] = useMutation(
    DELETE_NOTIFICATION_ITEM,
    {
      onCompleted: (data) =>
        setAction('delete', 'notification item', data.deleteNotificationItem.id),
    }
  );

  const [queryAppUser, { data: dataApp }] = useLazyQuery(QUERY_APP_FROM_USER);
  const [querySignal, { data: dataSig }] = useLazyQuery(QUERY_SIGNAL_FROM_APP);
  const [queryEvtUser, { data: dataEvt }] = useLazyQuery(QUERY_EVENT_FROM_USER);

  const { helpContent, toggleHelpVisibility, helpVisible } = useHelp('notification');
  const { user } = useUser();
  const { t } = useTranslation('notification');
  const { notificationTypesOptions } = useNotificationName();
  const initialValues = useRef(initialData.data.notification);
  const { inputs, handleChange, setInputs, validate, validationError, wasTouched } = useForm(
    initialValues.current,
    ['name', 'displayName', 'owner.id', 'application.id', 'signal.id']
  );
  const [canEdit, setCanEdit] = useState(false);
  const { role: userRole, id: userId } = user;
  const notifOwnerId = initialData.data?.notification?.owner?.id;
  const [optionsEvtUser, setOptionsEvtUser] = useState([]);
  const [optionsAppUser, setOptionsAppUser] = useState([]);
  const [optionsSignals, setOptionsSignals] = useState([]);
  const [selectedItem, setSelectedItem] = useState(0);
  const [item, setItem] = useState({});
  const [showItem, setShowItem] = useState(false);
  const [nbNotif, setNbNotif] = useState(initialValues.current.items?.length || 1);

  const { Confirm, setIsOpen, setArgs } = useConfirm({
    title: t('confirm-delete'),
    message: t('you-confirm'),
    yesLabel: t('yes-delete'),
    noLabel: t('no-delete'),
  });

  const onDrop = (acceptedFile) => {
    const file = acceptedFile[0];
    const preview = URL.createObjectURL(file);
    handleChange({
      name: 'icon',
      value: Object.assign(file, { publicUrlTransformed: preview }),
    });
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: 'image/jpeg, image/png',
    multiple: false,
  });

  useEffect(() => {
    if (userRole) {
      setCanEdit(userRole?.canManageApplication || notifOwnerId === userId);
    }
  }, [userRole, userId, notifOwnerId]);

  useEffect(() => {
    if (dataApp?.applications) {
      setOptionsAppUser(dataApp.applications.map((d) => ({ value: d.id, label: d.name })));
      setOptionsSignals([]);
    }
  }, [dataApp, setOptionsAppUser]);

  useEffect(() => {
    if (dataEvt?.events) {
      setOptionsEvtUser(dataEvt.events.map((d) => ({ value: d.id, label: d.name })));
    }
  }, [dataEvt, setOptionsEvtUser]);

  useEffect(() => {
    if (dataSig?.signals) {
      setOptionsSignals(dataSig.signals.map((d) => ({ value: d.id, label: d.name })));
    }
  }, [dataSig, setOptionsSignals]);

  const totalPrct = () => inputs.items.reduce((tot, itm) => tot + itm.probability, 0);

  function handleChangeUser(value) {
    const uId = value.value;
    queryAppUser({ variables: { user: uId } });
    queryEvtUser({ variables: { user: uId } });
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
    setItem(notif);
    setShowItem(true);
  }

  function handleDeleteNotif(idNotif) {
    confirmCB = (idN) => {
      if (!idN) return;
      if (inputs.items[idN].id) {
        deleteNotificationItem({
          variables: { id: inputs.items[idN].id },
        });
      }
      const newItems = [...inputs.items];
      newItems.splice(idN, 1);
      setItem(null);
      setInputs((prev) => ({ ...prev, items: newItems }));
    };
    setArgs(idNotif);
    setIsOpen(true);
  }

  function handleCloseItem(newItem) {
    if (newItem.id) {
      const idItem = inputs.items.findIndex((i) => i.id === newItem.id);
      if (idItem >= 0) {
        inputs.items[idItem] = newItem;
      } else {
        const items = [...inputs.items];
        items.push(newItem);
        setInputs({ ...inputs, items });
      }
    }
    setShowItem(false);
  }

  function handleDeleteNotification(e) {
    e.preventDefault();
    confirmCB = deleteNotification;
    setArgs({
      update: (cache, payload) => cache.evict(cache.identify(payload.data.deleteNotification)),
      variables: { id },
    });
    setIsOpen(true);
  }

  function handleUpdateNotification(e) {
    if (e) e.preventDefault();
    const newInputs = validate();
    if (!newInputs) return;

    if (wasTouched('owner.id')) newInputs.owner = { connect: { id: newInputs.owner.id } };
    if (wasTouched('application.id'))
      newInputs.application = { connect: { id: newInputs.application.id } };
    if (wasTouched('signal.id')) newInputs.signal = { connect: { id: newInputs.signal.id } };
    if (wasTouched('event.id')) newInputs.event = { connect: { id: newInputs.event.id } };
    // newInputs.id = id;
    if (isEmpty(newInputs.icon)) delete newInputs.icon;
    return updateNotification({
      update: (cache, payload) => cache.evict(cache.identify(payload.data.updateNotification)),
      variables: { id, data: newInputs },
    });
  }

  async function addContent() {
    setItem(defaultItem);
    setShowItem(true);
  }

  function handleChangeApp(app) {
    handleChange({
      name: 'application.id',
      value: app?.value,
    });
    if (app?.value) {
      querySignal({ variables: { appId: app.value } });
    }
  }

  useEffect(() => {
    const uId = initialData?.data?.notification?.owner?.id;
    if (uId) {
      queryAppUser({ variables: { user: uId } });
      queryEvtUser({ variables: { user: uId } });
    }
    const appId = initialData?.data?.notification?.application?.id;
    if (appId) querySignal({ variables: { appId } });
  }, [initialData, queryAppUser, querySignal, queryEvtUser]);

  if (errorDelete) return <DisplayError error={errorDelete} />;
  if (errorUpdate) return <DisplayError error={errorUpdate} />;
  if (errorDeleteItem) return <DisplayError error={errorDeleteItem} />;

  return (
    <>
      <Head>
        <title>
          UCheck In - {t('notification')} {inputs.name}
        </title>
      </Head>
      <Help contents={helpContent} visible={helpVisible} handleClose={toggleHelpVisibility} />
      <Confirm cb={confirmCB} />
      {showItem && (
        <NotificationContent open={showItem} onClose={handleCloseItem} item={item} notifId={id} />
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
          <ButtonBack route="/notifications" label={t('navigation:notifications')} />
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
                      value={inputs.owner?.id}
                      onChange={handleChangeUser}
                    />
                    <FieldError error={validationError['owner.id']} />
                  </Row>
                  <Row>
                    <Label>{t('type')}</Label>
                    <Select
                      theme={selectTheme}
                      className="select"
                      required
                      value={notificationTypesOptions.find((n) => n.value === inputs.type)}
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
                        ISOStringValue={inputs.startDate || dateNow()}
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
                        ISOStringValue={inputs.endDate || dateNow()}
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
                      value={optionsAppUser.find((n) => n.value === inputs.application?.id)}
                      onChange={(sel) => handleChangeApp(sel)}
                      options={optionsAppUser}
                    />
                    <FieldError error={validationError['application.id']} />
                  </Row>
                  <Row>
                    <Label required>{t('signal')}</Label>
                    <Select
                      className="select"
                      theme={selectTheme}
                      required
                      value={optionsSignals.find((n) => n.value === inputs.signal?.id)}
                      onChange={(n) =>
                        handleChange({
                          name: 'signal.id',
                          value: n.value,
                        })
                      }
                      options={optionsSignals}
                    />
                  </Row>
                  <FieldError error={validationError['signal.id']} />
                  <Row>
                    <Label required>{t('event')}</Label>
                    <Select
                      theme={selectTheme}
                      className="select"
                      required
                      value={optionsEvtUser.find((n) => n.value === inputs.event?.id)}
                      onChange={(n) =>
                        handleChange({
                          name: 'event.id',
                          value: n.value,
                        })
                      }
                      options={optionsEvtUser}
                    />
                    <FieldError error={validationError['application.id']} />
                  </Row>
                  <Row />
                  <Row>
                    <IconContainer>
                      <ImageSelection>
                        <div {...getRootProps({ className: 'dropzone' })}>
                          <input {...getInputProps()} />
                          <p>{t('icon')} (512x512px)</p>
                        </div>
                      </ImageSelection>
                      <Image image={inputs.icon} size={100} border />
                    </IconContainer>
                  </Row>
                  <Row>
                    <Counter
                      input={inputs.delayBetweenDisplay}
                      min={0}
                      name="delayBetweenDisplay"
                      handleChange={handleChange}
                      label={t('delay-between-display')}
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
                    <span>{inputs.owner?.name}</span>
                  </RowReadOnly>
                  <RowReadOnly>
                    <Label>{t('type')}</Label>
                    {inputs.type && <span>{NotificationType(inputs.type)}</span>}
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
                    <span>{inputs.application?.name}</span>
                  </RowReadOnly>
                  <RowReadOnly>
                    <Label>{t('signal')}</Label>
                    <span>{inputs.signal?.name}</span>
                  </RowReadOnly>
                  <RowReadOnly>
                    <Label>{t('event')}</Label>
                    <span>{inputs.event?.name}</span>
                  </RowReadOnly>
                  <RowReadOnly>
                    <Image image={inputs.icon} size={100} border />
                  </RowReadOnly>
                  <RowReadOnly>
                    <Label>{t('delay-between-display')}</Label>
                    <span>{inputs.delayBetweenDisplay}</span>
                  </RowReadOnly>
                </>
              )}
            </FormBody>
            <FormBodyFull>
              <Separator />
              <Row>
                <H3>{t('contents')}</H3>
              </Row>
              {inputs.type !== 'simple' && (
                <Row>
                  <Counter
                    input={nbNotif}
                    min={Math.max(inputs.items?.length || 0, 2)}
                    max={10}
                    handleChange={(value) => setNbNotif(value.value)}
                    label={t('nb-notif')}
                    name="nbNotif"
                  />
                </Row>
              )}
              <Row>
                {Array.isArray(inputs.items) && (
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
                        total={totalPrct()}
                      />
                    ))}
                    {inputs.items.length < nbNotif && <AddNotif onClick={addContent} />}
                  </NotifContainer>
                )}{' '}
              </Row>
            </FormBodyFull>
          </div>
          {Array.isArray(inputs.items) && (
            <div>
              <Phone>
                <Notif item={inputs.items[selectedItem]} type={inputs.type} />
              </Phone>
            </div>
          )}
        </NotificationContainer>
        <FormFooter>
          {canEdit && id && (
            <ButtonValidation disabled={loadingUpdate} onClick={handleUpdateNotification} update />
          )}
          {canEdit && id && (
            <ButtonDelete disabled={loadingDelete} onClick={handleDeleteNotification} />
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

const IconContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr minmax(100px, 1fr);
  align-items: center;
  width: 100%;
`;

export function Notif({
  item,
  typeNotif,
  onClick,
  withDetails,
  deleteNotif,
  editNotif,
  style,
  total,
}) {
  const [element, setElement] = useState();
  const { t } = useTranslation('notification');

  useEffect(() => {
    const el = document.getElementById(`html-content-container-${item?.id}`);
    setElement(el);
  }, [item]);

  useEffect(() => {
    if (element && item?.htmlContent?.document)
      element.innerHTML = serializeHtml({ children: item.htmlContent.document });
  }, [element, item]);

  if (!item) return null;
  return (
    <NotifStyle onClick={onClick} style={style}>
      {item.displayType === 'image' && item?.image?.publicUrlTransformed && (
        <img className="image" src={item.image.publicUrlTransformed} alt={item.name} />
      )}
      {item.displayType === 'html' && (
        <div className="html-content">
          {withDetails ? (
            <div className="icon">
              <Code size={64} />
            </div>
          ) : (
            <div id={`html-content-container-${item.id}`} />
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
              {item.defaultNotification ? (
                <span>{t('default')}</span>
              ) : (
                <span>
                  {item.probability} ({total ? formatPrct(item.probability / total) : '-'})
                </span>
              )}
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
  total: PropTypes.number,
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
  @media (max-width: var(--break-screen)) {
    grid-template-columns: 1fr;
  }
`;

const AddContainer = styled.div`
  display: grid;
  place-items: center;
  border: 1px dashed var(--light-grey);
  border-radius: 5px;
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
  @media (max-width: var(--break-screen)) {
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
  border: 1px solid var(--light-grey);
  padding: 3px;
  border-radius: 5px;
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
    border: 1px solid var(--light-grey);
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
    text-align: center;
  }
`;
