import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Form from 'react-jsonschema-form';
import extraFields from 'react-jsonschema-form-extras';

// import Modal from '../Modal/Modal';
import transformErrors from '../../services/transform-errors/transform-errors';
import scrollToError from '../../services/scroll-to-error/scroll-to-error';
import isEqual from '../../services/is-equal/is-equal';
import localFields from '../../fields';
import widgets from '../../widgets';

import '../../../node_modules/react-day-picker/lib/style.css';
import '../dcatd-form.scss';
import './dataset-detail.scss';

const fields = {
  ...extraFields,
  ...localFields
};

class DatasetDetail extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dataset: props.dataset
    };

    this.handleResourceToDataset = this.handleResourceToDataset.bind(this);
    this.hasDataset = this.hasDataset.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  componentDidMount() {
    if (this.hasDataset()) {
      this.props.onFetch(this.props.id);
    } else {
      this.props.onEmpty();
    }
    this.props.onEmptyResource();
  }

  componentWillReceiveProps(props) {
    this.setState({
      dataset: { ...props.dataset }
    });

    if (props.resourceToDataset['dcat:accessURL']) {
      this.handleResourceToDataset(props.resourceToDataset);
    }
  }

  handleResourceToDataset(resource) {
    let distributions = [...this.state.dataset['dcat:distribution'] || []];
    const id = resource['@id'];

    if (id) {
      if (resource['dcat:accessURL'] === 'remove') {
        // remove resource
        distributions = distributions.filter(distribution => distribution['@id'] !== id);
      } else {
        distributions = distributions.map((distribution) => {
          if (distribution['@id'] === id) {
            return { ...resource };
          }
          return { ...distribution };
        });
      }
    } else {
      // create new resource
      resource['@id'] = `_:${Math.random().toString(36).substr(2, 10)}`;
      distributions.push(resource);
    }

    this.setState({
      dataset: {
        ...this.state.dataset,
        'dcat:distribution': [...distributions]
      }
    });
  }

  hasDataset() {
    return this.props.id;
  }

  handleSubmit(event) {
    if (this.hasDataset()) {
      this.props.onUpdate(event.formData);
    } else {
      this.props.onCreate(event.formData);
    }
  }

  handleChange(event) {
    this.setState({
      dataset: event.formData
    });
  }

  handleCancel() {
    const equal = isEqual(this.state.dataset, this.props.dataset, ['@context', 'ams:spatialUnit']);
    if (!equal) {
      this.props.onUpdateModal({
        actionLabel: 'OK',
        content: 'Wijzigingen op deze pagina zijn nog niet opgeslagen',
        open: true,
        onProceed: () => {
          console.log('proceed cancel');
          // this.props.onRemove(dataset);
        }
      });
    }
  }

  render() {
    const { dataset } = this.state;
    return (
      <div>
        <Form
          className="dcatd-form dataset-form"
          idPrefix="dataset"
          schema={this.props.schema}
          formData={dataset}
          widgets={widgets}
          fields={fields}
          uiSchema={this.props.uiDataset}
          noHtml5Validate
          showErrorList={false}
          transformErrors={transformErrors}
          onError={scrollToError}
          onSubmit={event => this.handleSubmit(event)}
          onChange={event => this.handleChange(event)}
        >
          <div>
            <button
              className="dcatd-form-button dcatd-form-button-submit"
              type="submit"
            >
              Opslaan</button>
            <button
              className="dcatd-form-button dcatd-form-button-cancel"
              onClick={() => this.handleCancel()}
              type="button"
            >
              Annuleren</button>
            {this.hasDataset() ?
              <button
                onClick={() => this.props.onUpdateModal({
                  actionLabel: 'Dataset verwijderen',
                  content: 'Door de dataset te verwijderen, gaan alle gegevens verloren',
                  open: true,
                  onProceed: () => {
                    this.props.onRemove(dataset);
                  }
                })}
                type="button"
                className="dcatd-form-button dcatd-form-button-remove"
              >
                Dataset verwijderen
              </button>
              : ''}
          </div>
        </Form>
      </div>
    );
  }
}

DatasetDetail.defaultProps = {
  id: null,
  dataset: {},
  resourceToDataset: {},

  onFetch: () => {},
  onEmpty: () => {},
  onCreate: () => {},
  onRemove: () => {},
  onUpdate: () => {},
  onEmptyResource: () => {},
  onUpdateModal: () => {}
};

DatasetDetail.propTypes = {
  schema: PropTypes.object.isRequired,
  uiDataset: PropTypes.object.isRequired,
  id: PropTypes.string,
  dataset: PropTypes.object,
  resourceToDataset: PropTypes.object,

  onFetch: PropTypes.func,
  onEmpty: PropTypes.func,
  onCreate: PropTypes.func,
  onRemove: PropTypes.func,
  onUpdate: PropTypes.func,
  onEmptyResource: PropTypes.func,
  onUpdateModal: PropTypes.func
};

export default DatasetDetail;
