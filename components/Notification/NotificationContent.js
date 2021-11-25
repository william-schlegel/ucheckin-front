/* eslint-disable @next/next/no-img-element */
import { useMutation, useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import useTranslation from 'next-translate/useTranslation';
import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Select from 'react-select';
import SwitchComponent from 'react-switch';

import useForm from '../../lib/useForm';
import ButtonCancel from '../Buttons/ButtonCancel';
import ButtonValidation from '../Buttons/ButtonValidation';
import Counter from '../Counter';
import Drawer, { DrawerFooter } from '../Drawer';
import DisplayError from '../ErrorMessage';
import Loading from '../Loading';
import RichEditor from '../SlateEditor';
import { Form, FormBodyFull, Label, Row, RowReadOnly } from '../styles/Card';
import { ImageSelection } from '../styles/ImageSelection';
import selectTheme from '../styles/selectTheme';
import { CREATE_NOTIFICATION_ITEM, NOTIFICATION_QUERY, UPDATE_NOTIFICATION_ITEM } from './Queries';

const displayTypes = [
  { value: 'image', label: 'image' },
  { value: 'html', label: 'html' },
  { value: 'video', label: 'video' },
];

const QUERY_NOTIF_PARENT = gql`
  query QUERY_NOTIF_PARENT($id: ID!) {
    notification(where: { id: $id }) {
      id
      type
    }
  }
`;

export default function NotificationContent({ open, onClose, item, notifId }) {
  const { t } = useTranslation('notification');
  const {
    data: notification,
    error: errorNotification,
    loading: loadingNotification,
  } = useQuery(QUERY_NOTIF_PARENT, { variables: { id: notifId } });
  const [updateNotificationItem, { error: errorUpdateItem }] = useMutation(
    UPDATE_NOTIFICATION_ITEM,
    {
      onCompleted: (itm) => onClose(itm.updateNotificationItem),
      refetchQueries: [
        {
          query: NOTIFICATION_QUERY,
          variables: { id: notifId },
        },
      ],
    }
  );
  const [createNotificationItem, { error: errorCreateItem }] = useMutation(
    CREATE_NOTIFICATION_ITEM,
    {
      onCompleted: (itm) => onClose(itm.createNotificationItem),
    }
  );

  const initialValues = useRef(item);
  const { inputs, handleChange, validate, wasTouched } = useForm(initialValues.current);
  const [image, setImage] = useState('');

  const onDrop = (acceptedFile) => {
    const file = acceptedFile[0];
    const preview = URL.createObjectURL(file);
    handleChange({ name: 'image', value: Object.assign(file, { preview }) });
    setImage(preview);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: 'image/jpeg, image/png',
    multiple: false,
  });

  useEffect(() => {
    if (inputs.image?.preview) {
      setImage(inputs.image.preview);
    } else if (item.image?.name && !inputs.image?.preview) {
      const preview = URL.createObjectURL(item.image);
      inputs.image = Object.assign(item.image, { preview });
      setImage(preview);
    } else if (item.image?.publicUrlTransformed) setImage(item.image?.publicUrlTransformed);
  }, [inputs, item]);

  function handleValidation() {
    if (inputs.defaultNotification) handleChange({ name: 'probability', value: 0 });
    const newInputs = validate();
    if (newInputs) {
      if (wasTouched('htmlContent.document'))
        newInputs.htmlContent = newInputs.htmlContent.document;
      if (!item.id) newInputs.notification = { connect: { id: notifId } };
      console.log(`newInputs`, newInputs);
      if (item.id) updateNotificationItem({ variables: { id: item.id, data: newInputs } });
      else createNotificationItem({ variables: { data: newInputs } });
    }
  }

  if (loadingNotification) return <Loading />;
  if (errorNotification) return <DisplayError error={errorNotification} />;

  return (
    <Drawer onClose={onClose} open={open} title={t('content')}>
      <Form>
        <FormBodyFull>
          <Row>
            <Label htmlFor="displayType" required>
              {t('display-type')}
            </Label>
            <Select
              theme={selectTheme}
              className="select"
              value={displayTypes.find((d) => d.value === inputs.displayType)}
              onChange={(d) => handleChange({ name: 'displayType', value: d.value })}
              options={displayTypes}
            />
          </Row>
          {inputs.displayType === 'image' && (
            <>
              <Row>
                <ImageSelection>
                  <div {...getRootProps({ className: 'dropzone' })}>
                    <input {...getInputProps()} />
                    <p>{t('image-selection')}</p>
                  </div>
                  {image && <img src={image} alt="" />}
                </ImageSelection>
              </Row>
              <Row>
                <Label htmlFor="imageLink">{t('image-link')}</Label>
                <input
                  type="text"
                  id="imageLink"
                  name="imageLink"
                  value={inputs.imageLink}
                  onChange={handleChange}
                />
              </Row>
            </>
          )}
          {inputs.displayType === 'html' && (
            <Row>
              <RichEditor
                id="eventDescription"
                value={initialValues.current.htmlContent?.document}
                setValue={(value) =>
                  handleChange({
                    name: 'htmlContent.document',
                    value,
                  })
                }
                placeholder={t('notification-placeholder')}
              />
            </Row>
          )}
          {inputs.displayType === 'video' && (
            <Row>
              <Label htmlFor="videoLink">{t('video-link')}</Label>
              <input
                type="text"
                id="videoLink"
                name="videoLink"
                value={inputs.videoLink}
                onChange={handleChange}
              />
            </Row>
          )}
          <Row>
            <Counter
              input={inputs.numberOfDisplay}
              min={0}
              name="numberOfDisplay"
              handleChange={handleChange}
              label={t('nb-display')}
              fullWidth
            />
          </Row>
          <Row>
            <Counter
              input={inputs.delayBetweenDisplay}
              min={0}
              name="delayBetweenDisplay"
              handleChange={handleChange}
              label={t('delay-between-display')}
              fullWidth
            />
          </Row>
          {(notification.notification.type === 'random-draw' ||
            notification.notification.type === 'instant-win') && (
            <>
              <RowReadOnly>
                <Label>{t('default')}</Label>
                <SwitchComponent
                  onChange={(value) => handleChange({ name: 'defaultNotification', value })}
                  checked={inputs.defaultNotification}
                />
              </RowReadOnly>
              {!inputs.defaultNotification && (
                <Row>
                  <Counter
                    input={inputs.probability}
                    min={1}
                    max={100}
                    name="probability"
                    handleChange={handleChange}
                    label={t('probability')}
                    fullWidth
                  />
                </Row>
              )}
            </>
          )}
          {notification.notification.type === 'instant-win' && (
            <>
              <RowReadOnly>
                <Label>{t('default')}</Label>
                <SwitchComponent
                  onChange={(value) => handleChange({ name: 'default', value })}
                  checked={inputs.default}
                />
              </RowReadOnly>
              {!inputs.default && (
                <Row>
                  <Counter
                    input={inputs.quota}
                    min={1}
                    max={100}
                    name="quota"
                    handleChange={handleChange}
                    label={t('quota')}
                    fullWidth
                  />
                </Row>
              )}
            </>
          )}
          {/* defaultNotification quota */}
        </FormBodyFull>
      </Form>
      <DrawerFooter>
        <ButtonValidation onClick={handleValidation} />
        <ButtonCancel onClick={onClose} />
        {errorUpdateItem && <DisplayError error={errorUpdateItem} />}
        {errorCreateItem && <DisplayError error={errorCreateItem} />}
      </DrawerFooter>
    </Drawer>
  );
}

NotificationContent.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  item: PropTypes.object,
  notifId: PropTypes.string,
};
