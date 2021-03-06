import React from 'react';

import Form from 'react-jsonschema-form';
import ResourceForm from './ResourceForm';
import schema from './schema.json';
import uiResource from '../../definitions/uiResource';

describe('The ResourceForm component', () => {
  let props;
  let wrap;
  let instance;

  beforeEach(() => {
    global.Date.now = jest.fn(() => 1542192029769);
    props = {
      schema,
      uiResource: {},
      onSetResourceToDataset: jest.fn(),
      onEmptyResource: jest.fn(),
      setModal: jest.fn()
    };
  });

  describe('renders component', () => {
    it('renders default props and state', () => {
      wrap = shallow(<ResourceForm {...props} />);

      wrap.setProps({
        uiResource: { ...props.uiResource },
        formData: { ...props.formData },
        schema: { ...props.schema }
      });

      expect(wrap).toMatchSnapshot();
    });

    describe('handleCancel', () => {
      it('should go back', () => {
        wrap = shallow(<ResourceForm {...props} />);
        const backButton = wrap.find('.resource-form__back').first();
        expect(backButton).toBeTruthy();
        backButton.simulate('click');
        expect(props.onEmptyResource).toHaveBeenCalled();
      });

      it('should show modal when the updateStatus is busy (file is uploading) on cancel', () => {
        props = {
          ...props,
          uploadStatus: 'busy'
        };
        wrap = shallow(<ResourceForm {...props} />);
        const cancelButton = wrap.find('.dcatd-form-button-cancel').first();
        expect(cancelButton.prop('type')).toBe('button');
        cancelButton.simulate('click');
        expect(props.setModal).toHaveBeenCalled();
        expect(props.setModal.mock.calls[0][0].actionLabel).toBe('Uploaden afbreken');
      });

      it('should call empty resource when nothing changed on cancel', () => {
        props = {
          ...props
        };
        wrap = shallow(<ResourceForm {...props} />);
        const cancelButton = wrap.find('.dcatd-form-button-cancel').first();
        expect(cancelButton.prop('type')).toBe('button');
        cancelButton.simulate('click');
        expect(props.setModal).not.toHaveBeenCalled();
        expect(props.onEmptyResource).toHaveBeenCalled();
      });

      it('should call setModal on cancel when dct:modified is changed', () => {
        props = {
          ...props,
          formData: {
            'dct:modified': '',
            'foaf:isPrimaryTopicOf': {}
          }
        };
        wrap = shallow(<ResourceForm {...props} />);
        const event = { formData: { 'dct:modified': 'modified', 'ams:distributionType': 'modified' } };
        wrap.instance().setResourceSpecs(event.formData);
        const cancelButton = wrap.find('.dcatd-form-button-cancel').first();
        cancelButton.simulate('click');
        expect(props.setModal).toHaveBeenCalled();
      });
    });


    describe('internal state manipulation', () => {
      let form;

      beforeEach(() => {
        props = {
          ...props,
          uiResource
        };

        wrap = shallow(<ResourceForm {...props} />);
        form = wrap.find(Form).first();
        instance = wrap.instance();
      });

      it('should create the form', () => {
        expect(form).toBeTruthy();
      });

      describe('handleChange', () => {
        beforeEach(() => {
          instance.setVisibilityOfFields = jest.fn();
        });

        it('should call setVisibilityOfFields when form has changed', () => {
          const event = { formData: { 'ams:distributionType': 'modified' } };
          form.simulate('change', event);
          expect(instance.setVisibilityOfFields).toHaveBeenCalled();
        });
      });

      describe('setVisibilityOfFields', () => {
        beforeEach(() => {
          const formData = { 'ams:distributionType': 'file' };
          instance.setVisibilityOfFields(formData);
        });

        it('should show format field', () => {
          expect(wrap.state().uiResource['dcat:mediaType']['ui:widget']).toBe('select');
        });

        it('should show byteSize field', () => {
          expect(wrap.state().uiResource['dcat:byteSize']['ui:widget']).toBe('string');
        });

        it('should hide serviceType', () => {
          expect(wrap.state().uiResource['ams:serviceType']['ui:widget']).toBe('hidden');
        });
      });

      describe('setVisibilityOfFields', () => {
        beforeEach(() => {
          const formData = { 'ams:distributionType': 'api' };
          instance.setVisibilityOfFields(formData);
        });

        it('should hide format field', () => {
          expect(wrap.state().uiResource['dcat:mediaType']['ui:widget']).toBe('hidden');
        });

        it('should hide byteSize field', () => {
          expect(wrap.state().uiResource['dcat:byteSize']['ui:widget']).toBe('hidden');
        });

        it('should show serviceType', () => {
          expect(wrap.state().uiResource['ams:serviceType']['ui:widget']).toBe('select');
        });
      });

      describe('setVisibilityOfFields', () => {
        beforeEach(() => {
          const formData = { 'ams:distributionType': 'web' };
          instance.setVisibilityOfFields(formData);
        });

        it('should hide format field', () => {
          expect(wrap.state().uiResource['dcat:mediaType']['ui:widget']).toBe('hidden');
        });

        it('should hide byteSize field', () => {
          expect(wrap.state().uiResource['dcat:byteSize']['ui:widget']).toBe('hidden');
        });

        it('should hide serviceType', () => {
          expect(wrap.state().uiResource['ams:serviceType']['ui:widget']).toBe('hidden');
        });
      });
    });
  });
});
