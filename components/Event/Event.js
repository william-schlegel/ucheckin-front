import { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { useLazyQuery, useMutation } from '@apollo/client';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';
import Select from 'react-select';
import gql from 'graphql-tag';
import { useDropzone } from 'react-dropzone';

import styled from 'styled-components';
import Head from 'next/head';
import isEmpty from 'lodash.isempty';
import DisplayError from '../ErrorMessage';
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
  H2,
} from '../styles/Card';
import useForm from '../../lib/useForm';
import { SearchUser } from '../SearchUser';
import ButtonBack from '../Buttons/ButtonBack';
import ButtonCancel from '../Buttons/ButtonCancel';
import ButtonValidation from '../Buttons/ButtonValidation';
import ButtonDelete from '../Buttons/ButtonDelete';
import { DELETE_EVENT_MUTATION, UPDATE_EVENT_MUTATION } from './Queries';
import { useHelp, Help, HelpButton } from '../Help';
import { useUser } from '../User/Queries';
import DatePicker from '../DatePicker';
import Image from '../Tables/Image';
import FieldError from '../FieldError';
import selectTheme from '../styles/selectTheme';
import { ImageSelection } from '../styles/ImageSelection';
import EventHome from './EventHome';
import Phone from '../styles/Phone';
import ActionButton from '../Buttons/ActionButton';
import EventContent from './EventContent';
import HtmlEditor from '../HtmlEditor';
import useConfirm from '../../lib/useConfirm';

const QUERY_APP_FROM_USER = gql`
  query QUERY_APP_FROM_USER($user: ID!) {
    allApplications(where: { owner: { id: $user } }) {
      id
      name
    }
  }
`;

// make mutable object
const makeData = (data) => {
  const dN = data.Event;
  return {
    name: dN.name || '',
    location: dN.location || '',
    owner: { id: dN.owner?.id, name: dN.owner?.name },
    application: { id: dN.application?.id, name: dN.application?.name },
    publishStart: dN.publishStart,
    publishEnd: dN.publishEnd,
    imageHome: { publicUrlTransformed: dN.imageHome?.publicUrlTransformed },
    description: dN.description || '',
    validityStart: dN.validityStart,
    validityEnd: dN.validityEnd,
    imageEvent: { publicUrlTransformed: dN.imageEvent?.publicUrlTransformed },
    eventDescription: dN.eventDescription || '',
  };
};

export default function Event({ id, initialData }) {
  const router = useRouter();
  const [
    deleteEvent,
    { loading: loadingDelete, error: errorDelete },
  ] = useMutation(DELETE_EVENT_MUTATION, {
    variables: { id },
    onCompleted: () => {
      router.push('/events');
    },
  });
  const [
    updateEvent,
    { loading: loadingUpdate, error: errorUpdate },
  ] = useMutation(UPDATE_EVENT_MUTATION, {
    onCompleted: () => {
      router.push('/events');
    },
  });
  const [queryAppUser, { data: dataApp }] = useLazyQuery(QUERY_APP_FROM_USER);

  const { helpContent, toggleHelpVisibility, helpVisible } = useHelp('event');
  const { user } = useUser();
  const { t } = useTranslation('event');
  const initialValues = useRef(makeData(initialData.data));
  const {
    inputs,
    handleChange,
    validate,
    validationError,
    wasTouched,
  } = useForm(initialValues.current, [
    'name',
    'description',
    'owner.id',
    'application.id',
    'eventDescription',
    'location',
  ]);
  const [canEdit, setCanEdit] = useState(false);
  const { role: userRole, id: userId } = user;
  const eventOwnerId = initialValues.current?.owner?.id;
  const [optionsAppUser, setOptionsAppUser] = useState([]);

  const onDropHome = (acceptedFile) => {
    const file = acceptedFile[0];
    const preview = URL.createObjectURL(file);
    handleChange({
      name: 'imageHome',
      value: Object.assign(file, { publicUrlTransformed: preview }),
    });
  };
  const onDropEvent = (acceptedFile) => {
    const file = acceptedFile[0];
    const preview = URL.createObjectURL(file);
    handleChange({
      name: 'imageEvent',
      value: Object.assign(file, { publicUrlTransformed: preview }),
    });
  };

  const {
    getRootProps: rootPropsHome,
    getInputProps: inputPropsHome,
  } = useDropzone({
    onDrop: onDropHome,
    accept: 'image/jpeg, image/png',
    multiple: false,
  });

  const {
    getRootProps: rootPropsEvent,
    getInputProps: inputPropsEvent,
  } = useDropzone({
    onDrop: onDropEvent,
    accept: 'image/jpeg, image/png',
    multiple: false,
  });

  const { Confirm, setIsOpen, setArgs } = useConfirm({
    title: t('confirm-delete'),
    message: t('you-confirm'),
    yesLabel: t('yes-delete'),
    noLabel: t('no-delete'),
    callback: (args) => deleteEvent(args),
  });

  useEffect(() => {
    if (userRole) {
      setCanEdit(userRole?.canManageApplication || eventOwnerId === userId);
    }
  }, [userRole, userId, eventOwnerId]);

  useEffect(() => {
    if (dataApp?.allApplications) {
      setOptionsAppUser(
        dataApp.allApplications.map((d) => ({ value: d.id, label: d.name }))
      );
    }
  }, [dataApp, setOptionsAppUser]);

  function handleChangeUser(value) {
    const uId = value.value;
    queryAppUser({ variables: { user: uId } });
    handleChange(value);
  }

  function handleDeleteEvent(e) {
    if (e) e.preventDefault();
    setArgs({
      update: (cache, payload) =>
        cache.evict(cache.identify(payload.data.deleteEvent)),
      variables: { id },
    });
    setIsOpen(true);
  }

  function handleUpdateEvent(e) {
    if (e) e.preventDefault();
    const newInputs = validate();
    if (!newInputs) return;

    if (wasTouched('owner.id'))
      newInputs.owner = { connect: { id: newInputs.owner.id } };
    if (wasTouched('application.id'))
      newInputs.application = { connect: { id: newInputs.application.id } };
    if (isEmpty(newInputs.imageHome)) delete newInputs.imageHome;
    if (isEmpty(newInputs.imageEvent)) delete newInputs.imageEvent;
    return updateEvent({
      update: (cache, payload) =>
        cache.evict(cache.identify(payload.data.updateEvent)),
      variables: { id, data: newInputs },
    });
  }

  function handleChangeApp(app) {
    handleChange({
      name: 'application.id',
      value: app?.value,
    });
  }

  useEffect(() => {
    const uId = initialData?.data?.Event?.owner?.id;
    if (uId) queryAppUser({ variables: { user: uId } });
  }, [initialData, queryAppUser]);

  if (errorDelete) return <DisplayError error={errorDelete} />;
  if (errorUpdate) return <DisplayError error={errorUpdate} />;

  return (
    <>
      <Head>
        <title>{t('event')}</title>
      </Head>
      <Help
        contents={helpContent}
        visible={helpVisible}
        handleClose={toggleHelpVisibility}
      />
      <Confirm />
      <Form>
        <FormHeader>
          <FormTitle>
            {t('event')} <span>{inputs.name}</span>
            <HelpButton showHelp={toggleHelpVisibility} />
          </FormTitle>
          <ButtonBack route="/events" label={t('navigation:events')} />
        </FormHeader>
        <EventContainer>
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
                    <Label htmlFor="location" required>
                      {t('location')}
                    </Label>
                    <Block>
                      <input
                        type="text"
                        required
                        id="location"
                        name="location"
                        value={inputs.location}
                        onChange={handleChange}
                      />
                      <ActionButton
                        type="map-pin"
                        cb={() => {
                          console.log('click map');
                        }}
                      />
                    </Block>
                  </Row>
                  {eventOwnerId === userId ? (
                    <Row>
                      <Label>{t('common:owner')}</Label>
                      <SearchUser
                        required
                        name="owner.id"
                        value={inputs.owner.id}
                        onChange={handleChangeUser}
                      />
                      <FieldError error={validationError['owner.id']} />
                    </Row>
                  ) : (
                    <RowReadOnly>
                      <Label>{t('common:owner')}</Label>
                      <span>{inputs.owner.name}</span>
                    </RowReadOnly>
                  )}
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
                    <FieldError error={validationError['application.id']} />
                  </Row>
                  <Row>
                    <Block>
                      <Label htmlFor="publishStart">{t('publish-start')}</Label>
                      <DatePicker
                        id="publishStart"
                        ISOStringValue={inputs.publishStart}
                        onChange={(dt) =>
                          handleChange({
                            name: 'publishStart',
                            value: dt.toISOString(),
                          })
                        }
                      />
                    </Block>
                  </Row>
                  <Row>
                    <Block>
                      <Label htmlFor="publishEnd">{t('publish-end')} </Label>
                      <DatePicker
                        id="publishEnd"
                        ISOStringValue={inputs.publishEnd}
                        onChange={(dt) =>
                          handleChange({
                            name: 'publishEnd',
                            value: dt.toISOString(),
                          })
                        }
                      />
                    </Block>
                  </Row>
                  <Row>
                    <HomeImageContainer>
                      <ImageSelection>
                        <div {...rootPropsHome({ className: 'dropzone' })}>
                          <input {...inputPropsHome()} />
                          <p>{t('image-home')}</p>
                        </div>
                      </ImageSelection>
                      <Image image={inputs.imageHome} size={100} border />
                    </HomeImageContainer>
                  </Row>
                  <Row>
                    <Label htmlFor="description" required>
                      {t('description')}
                    </Label>
                    <input
                      type="text"
                      required
                      id="description"
                      name="description"
                      value={inputs.description}
                      onChange={handleChange}
                    />
                  </Row>
                  <Row>
                    <Block>
                      <Label htmlFor="validityStart">
                        {t('validity-start')}
                      </Label>
                      <DatePicker
                        id="validityStart"
                        ISOStringValue={inputs.validityStart}
                        onChange={(dt) =>
                          handleChange({
                            name: 'validityStart',
                            value: dt.toISOString(),
                          })
                        }
                      />
                    </Block>
                  </Row>
                  <Row>
                    <Block>
                      <Label htmlFor="validityEnd">{t('validity-end')} </Label>
                      <DatePicker
                        id="validityEnd"
                        ISOStringValue={inputs.validityEnd}
                        onChange={(dt) =>
                          handleChange({
                            name: 'validityEnd',
                            value: dt.toISOString(),
                          })
                        }
                      />
                    </Block>
                  </Row>
                  <Row>
                    <HomeImageContainer>
                      <ImageSelection>
                        <div {...rootPropsEvent({ className: 'dropzone' })}>
                          <input {...inputPropsEvent()} />
                          <p>{t('image-event')}</p>
                        </div>
                      </ImageSelection>
                      <Image
                        image={inputs.imageEvent}
                        size={100}
                        ratio={480 / 320}
                        border
                      />
                    </HomeImageContainer>
                  </Row>
                  <Row>
                    <Label htmlFor="eventDescription" required>
                      {t('event-description')}
                    </Label>
                    <HtmlEditor
                      id="eventDescription"
                      value={initialValues.current.eventDescription}
                      handleChange={(e) =>
                        handleChange({
                          name: 'eventDescription',
                          value: e.target.getContent(),
                        })
                      }
                      height={300}
                    />
                    <FieldError error={validationError.eventDescription} />
                  </Row>
                </>
              ) : (
                <>
                  <RowReadOnly>
                    <Label>{t('name')}</Label>
                    <span>{inputs.name}</span>
                  </RowReadOnly>
                  <RowReadOnly>
                    <Label>{t('application')}</Label>
                    <span>{inputs.application.name}</span>
                  </RowReadOnly>
                  <RowReadOnly>
                    <Label>{t('common:owner')}</Label>
                    <span>{inputs.owner.name}</span>
                  </RowReadOnly>
                </>
              )}
            </FormBody>
          </div>
          <div
            style={{
              borderLeft: '1px solid var(--lightGray)',
              paddingLeft: '1rem',
            }}
          >
            <H2>{t('preview')}</H2>
            <EventHomeContainer>
              <EventHome event={inputs} />
            </EventHomeContainer>
            <Phone>
              <EventContent event={inputs} />
            </Phone>
          </div>
        </EventContainer>
        <FormFooter>
          {canEdit && id && (
            <ButtonValidation
              disabled={loadingUpdate}
              onClick={handleUpdateEvent}
              update
            />
          )}
          {canEdit && id && (
            <ButtonDelete
              disabled={loadingDelete}
              onClick={handleDeleteEvent}
            />
          )}
          <ButtonCancel onClick={() => router.back()} />
        </FormFooter>
      </Form>
    </>
  );
}

Event.propTypes = {
  id: PropTypes.string,
  initialData: PropTypes.object,
};

const HomeImageContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr minmax(100px, 1fr);
  align-items: center;
  width: 100%;
`;

const EventHomeContainer = styled.div`
  margin: 20px 0;
  width: 100%;
`;

const EventContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 400px;
  grid-gap: 1rem;
  @media (max-width: 1000px) {
    grid-template-columns: 1fr;
  }
`;
