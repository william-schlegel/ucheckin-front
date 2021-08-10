import { useEffect, useRef, useState } from 'react';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import useTranslation from 'next-translate/useTranslation';
import Select from 'react-select';
import { useDropzone } from 'react-dropzone';
import SwitchComponent from 'react-switch';
import { useMutation, useQuery } from '@apollo/client';

import Drawer, { DrawerFooter } from '../Drawer';
import ButtonValidation from '../Buttons/ButtonValidation';
import ButtonCancel from '../Buttons/ButtonCancel';
import { FormBodyFull, Label, Row, Form, RowReadOnly } from '../styles/Card';
import useForm from '../../lib/useForm';
import Counter from '../Counter';
import selectTheme from '../styles/selectTheme';
import { UPDATE_NOTIFICATION_ITEM, CREATE_NOTIFICATION_ITEM } from './Queries';
import DisplayError from '../ErrorMessage';
import Loading from '../Loading';
import { ImageSelection } from '../styles/ImageSelection';
import HtmlEditor from '../HtmlEditor';

const displayTypes = [
  { value: 'image', label: 'image' },
  { value: 'html', label: 'html' },
  { value: 'video', label: 'video' },
];

const QUERY_NOTIF_PARENT = gql`
  query QUERY_NOTIF_PARENT($id: ID!) {
    Notification(where: { id: $id }) {
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
    }
  );
  const [createNotificationItem, { error: errorCreateItem }] = useMutation(
    CREATE_NOTIFICATION_ITEM,
    {
      onCompleted: (itm) => onClose(itm.createNotificationItem),
    }
  );

  const initialValues = useRef(item);
  const { inputs, handleChange, validate } = useForm(initialValues.current);
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
    } else if (item.image?.publicUrlTransformed)
      setImage(item.image?.publicUrlTransformed);
  }, [inputs, item]);

  function handleValidation() {
    if (inputs.defaultNotification)
      handleChange({ name: 'probability', value: 0 });
    const newInputs = validate();
    if (newInputs) {
      newInputs.notification = { connect: { id: notifId } };
      if (item.id)
        updateNotificationItem({ variables: { id: item.id, data: newInputs } });
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
              onChange={(d) =>
                handleChange({ name: 'displayType', value: d.value })
              }
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
              <HtmlEditor
                value={item.htmlContent}
                handleChange={(e) =>
                  handleChange({
                    name: 'htmlContent',
                    value: e.target.getContent(),
                  })
                }
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
          {(notification.Notification.type === 'random-draw' ||
            notification.Notification.type === 'instant-win') && (
            <>
              <RowReadOnly>
                <Label>{t('default')}</Label>
                <SwitchComponent
                  onChange={(value) =>
                    handleChange({ name: 'defaultNotification', value })
                  }
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
          {notification.Notification.type === 'instant-win' && (
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
  onClose: PropTypes.func.isRequired,
  item: PropTypes.object,
  notifId: PropTypes.string,
};
