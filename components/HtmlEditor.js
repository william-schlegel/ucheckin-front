import PropTypes from 'prop-types';
import { Editor } from '@tinymce/tinymce-react';

export default function HtmlEditor({ value, handleChange, height }) {
  return (
    <Editor
      apiKey="oyb6nt5ajzb6jpmyqwzshct37caxfq2vza1r3pup5gsg9w25"
      initialValue={value}
      init={{
        height,
        width: '100%',
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
      onChange={handleChange}
    />
  );
}

HtmlEditor.defaultProps = {
  height: 500,
};

HtmlEditor.propTypes = {
  value: PropTypes.string,
  handleChange: PropTypes.func,
  height: PropTypes.number,
};
