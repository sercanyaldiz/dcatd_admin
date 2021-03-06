import React from 'react';

import ResourcesItem from './ResourcesItem';

const mockSchema = {
  'ams:distributionType': {
    enum: [
      'api',
      'file',
      'web'
    ],
    enumNames: ['API/Service', 'Bestand', 'Website']
  },
  'dcat:mediaType': {
    enum: [
      'n/a',
      'text/csv',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.geo+json',
      'application/gml+xml',
      'text/html',
      'application/json',
      'application/pdf',
      'image/png',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/xml',
      'application/octet-stream'
    ],
    enumNames: ['', 'CSV', 'DOCX', 'GeoJSON', 'GML', 'HTML', 'JSON', 'PDF', 'PNG', 'XLS', 'XLSX', 'XML', 'Anders']
  }
};

describe('The ResourcesItem component', () => {
  it('renders with title, description, format, file size and date', () => {
    const resource = {
      'ams:distributionType': 'file',
      'dct:title': 'Titel',
      'dcat:accessURL': 'http://ergens',
      'ams:purl': 'http://acc.ergens',
      'dct:description': 'omschrijving',
      'dcat:mediaType': 'application/pdf',
      'dcat:byteSize': '666',
      'foaf:isPrimaryTopicOf': {
        'dct:modified': '2017-11-30'
      }
    };

    const wrap = shallow(
      <ResourcesItem
        resource={resource}
        schemaProps={mockSchema}
      />
    );

    expect(wrap).toMatchSnapshot();
  });

  it('renders with title, description and date: leaving out file size for websites and APIs', () => {
    const resource = {
      'ams:distributionType': 'web',
      'dct:title': 'Titel',
      'dcat:accessURL': 'http://ergens',
      'ams:purl': 'http://acc.ergens',
      'dct:description': 'omschrijving',
      'dcat:mediaType': 'n/a',
      'dcat:byteSize': '0',
      'foaf:isPrimaryTopicOf': {}
    };

    const wrap = shallow(
      <ResourcesItem
        resource={resource}
        schemaProps={mockSchema}
      />
    );

    expect(wrap).toMatchSnapshot();
  });

  it('renders with title and url: showing url in place of description', () => {
    const resource = {
      'dct:title': 'Titel',
      'dcat:accessURL': 'http://ergens',
      'ams:purl': 'http://acc.ergens',
      'dcat:mediaType': 'n/a',
      'foaf:isPrimaryTopicOf': {}
    };

    const wrap = shallow(
      <ResourcesItem
        resource={resource}
        schemaProps={mockSchema}
      />
    );

    expect(wrap).toMatchSnapshot();
  });
});
