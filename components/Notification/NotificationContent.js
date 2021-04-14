import { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import useTranslation from 'next-translate/useTranslation';
import Select from 'react-select';
import { useDropzone } from 'react-dropzone';
import { Editor } from '@tinymce/tinymce-react';
import SwitchComponent from 'react-switch';

import styled from 'styled-components';
import Drawer, { DrawerFooter } from '../Drawer';
import ButtonValidation from '../Buttons/ButtonValidation';
import ButtonCancel from '../Buttons/ButtonCancel';
import { FormBodyFull, Label, Row, Form, RowReadOnly } from '../styles/Card';
import useForm from '../../lib/useForm';
import Counter from '../Counter';
import selectTheme from '../styles/selectTheme';

const displayTypes = [
  { value: 'image', label: 'image' },
  { value: 'html', label: 'html' },
  { value: 'video', label: 'video' },
];

export default function NotificationContent({
  open,
  onClose,
  item,
  onValidation,
  typeNotif,
}) {
  const { t } = useTranslation('notification');

  const { inputs, handleChange } = useForm(item);
  const [image, setImage] = useState('');

  const onDrop = useCallback(
    (acceptedFile) => {
      const file = acceptedFile[0];
      const preview = URL.createObjectURL(file);
      inputs.image = Object.assign(file, { preview });
      setImage(preview);
    },
    [inputs]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: 'image/jpeg, image/png',
    multiple: false,
  });

  // useEffect(() => {
  //   if (inputs.image.preview !== '') {
  //     URL.revokeObjectURL(inputs.image.preview);
  //   }
  // }, [inputs]);

  useEffect(() => {
    if (item.image.preview) {
      setImage(item.image.preview);
    } else if (item.image.name && !item.image.preview) {
      const preview = URL.createObjectURL(item.image);
      inputs.image = Object.assign(item.image, { preview });
      setImage(preview);
    } else if (item.image.publicUrlTransformed)
      setImage(item.image.publicUrlTransformed);
  }, [inputs, item]);

  function handleValidation() {
    console.log(`handleValidation - inputs`, inputs);

    onValidation(inputs);
    onClose();
  }

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
            <Row style={{ width: '100%' }}>
              <Editor
                apiKey="oyb6nt5ajzb6jpmyqwzshct37caxfq2vza1r3pup5gsg9w25"
                initialValue={item.htmlContent}
                init={{
                  height: 500,
                  plugins: [
                    'advlist',
                    'anchor',
                    'autosave',
                    'code',
                    'emoticons',
                    'image',
                    'imagetools',
                    'lists',
                    'media',
                    'table',
                  ],
                  toolbar:
                    'undo redo | bold italic | alignleft aligncenter alignright | bullist numlist outdent indent | image imagetools media emoticons | code',
                }}
                onChange={(e) =>
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
          {(typeNotif === 'random-draw' || typeNotif === 'instant-win') && (
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
          {typeNotif === 'instant-win' && (
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
          {/* 



defaultNotification
quota */}
        </FormBodyFull>
      </Form>
      <DrawerFooter>
        <ButtonValidation onClick={handleValidation} />
        <ButtonCancel onClick={onClose} />
      </DrawerFooter>
    </Drawer>
  );
}

NotificationContent.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  item: PropTypes.object,
  onValidation: PropTypes.func,
  typeNotif: PropTypes.string,
};

const ImageSelection = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  .dropzone {
    padding: 2rem;
    text-align: center;
    border: 3px dashed var(--lightGray);
    border-radius: 10px;
  }
  img {
    max-width: 60%;
    max-height: 30vh;
    height: auto;
    width: auto;
    margin: 1rem auto;
    border: 1px solid var(--lightGray);
  }
`;
