import gql from 'graphql-tag';

export const PAGINATION_LOCATION_QUERY = gql`
  query PAGINATION_LOCATION_QUERY {
    count: umitLocationsCount
  }
`;

export const PAGINATION_MATERIAL_QUERY = gql`
  query PAGINATION_MATERIAL_QUERY {
    count: umitMaterialsCount
  }
`;

export const PAGINATION_SENSOR_QUERY = gql`
  query PAGINATION_SENSOR_QUERY {
    count: umitSensorsCount
  }
`;

export const PAGINATION_MEASURE_QUERY = gql`
  query PAGINATION_MEASURE_QUERY {
    count: umitMeasuresCount
  }
`;

export const ALL_LOCATIONS_QUERY = gql`
  query ALL_LOCATIONS_QUERY($skip: Int = 0, $take: Int, $where: UmitLocationWhereInput) {
    umitLocations(
      take: $take
      skip: $skip
      where: $where
      orderBy: [{ company: asc }, { name: asc }]
    ) {
      id
      name
      address
      zipCode
      city
      country
      contact
      telephone
      company
    }
  }
`;

export const ALL_MATERIALS_QUERY = gql`
  query ALL_MATERIALS_QUERY($skip: Int = 0, $take: Int, $where: UmitMaterialWhereInput) {
    umitMaterials(
      take: $take
      skip: $skip
      where: $where
      orderBy: [{ company: asc }, { name: asc }]
    ) {
      id
      company
      name
      propSpeed
    }
  }
`;

export const ALL_SENSORS_QUERY = gql`
  query ALL_SENSORS_QUERY($skip: Int = 0, $take: Int, $where: UmitSensorWhereInput) {
    umitSensors(
      take: $take
      skip: $skip
      where: $where
      orderBy: [{ company: asc }, { building: asc }, { unit: asc }, { ref: asc }]
    ) {
      id
      company
      name
      description
      building
      unit
      ref
      lastMeasureAt
    }
  }
`;

export const ALL_MEASURES_QUERY = gql`
  query ALL_MEASURES_QUERY($skip: Int = 0, $take: Int, $where: UmitMeasureWhereInput) {
    umitMeasures(
      take: $take
      skip: $skip
      where: $where
      orderBy: [{ company: asc }, { measureDate: desc }]
    ) {
      id
      company
      location {
        name
      }
      sensor {
        building
        unit
        ref
        name
        alert
      }
      measureDate
      thickness
    }
  }
`;

export const LOCATION_QUERY = gql`
  query LOCATION_QUERY($id: ID!) {
    umitLocation(where: { id: $id }) {
      id
      name
      address
      zipCode
      city
      country
      contact
      telephone
      company
    }
  }
`;

export const MATERIAL_QUERY = gql`
  query MATERIAL_QUERY($id: ID!) {
    umitMaterial(where: { id: $id }) {
      id
      company
      name
      propSpeed
    }
  }
`;

export const SENSOR_QUERY = gql`
  query SENSOR_QUERY($id: ID!) {
    umitSensor(where: { id: $id }) {
      id
      company
      name
      description
      building
      unit
      ref
      lastMeasureAt
      macAddress
      frequency
      location {
        name
      }
      material {
        name
      }
      propSpeed
      startA
      startB
      widthA
      widthB
      thresholdA
      thresholdB
      alert
    }
  }
`;

export const MEASURE_QUERY = gql`
  query MEASURE_QUERY($id: ID!) {
    umitMeasure(where: { id: $id }) {
      id
      company
      location {
        name
      }
      measureDate
      sensor {
        building
        unit
        ref
        name
        alert
      }
      startA
      startB
      thickness
      thresholdA
      thresholdB
      widthA
      widthB
      points
    }
  }
`;

export const CREATE_LOCATION_MUTATION = gql`
  mutation CREATE_LOCATION_MUTATION($data: UmitLocationCreateInput!) {
    createUmitLocation(data: $data) {
      id
    }
  }
`;

export const CREATE_MATERIAL_MUTATION = gql`
  mutation CREATE_MATERIAL_MUTATION($data: UmitMaterialCreateInput!) {
    createUmitMaterial(data: $data) {
      id
    }
  }
`;

export const UPDATE_LOCATION_MUTATION = gql`
  mutation UPDATE_LOCATION_MUTATION(
    $where: UmitLocationWhereUniqueInput!
    $data: UmitLocationUpdateInput!
  ) {
    updateUmitLocation(where: $where, data: $data) {
      id
    }
  }
`;

export const UPDATE_MATERIAL_MUTATION = gql`
  mutation UPDATE_MATERIAL_MUTATION(
    $where: UmitMaterialWhereUniqueInput!
    $data: UmitMaterialUpdateInput!
  ) {
    updateUmitMaterial(where: $where, data: $data) {
      id
    }
  }
`;

export const DELETE_LOCATION_MUTATION = gql`
  mutation DELETE_LOCATION_MUTATION($where: UmitLocationWhereUniqueInput!) {
    deleteUmitLocation(where: $where) {
      id
    }
  }
`;

export const DELETE_MATERIAL_MUTATION = gql`
  mutation DELETE_MATERIAL_MUTATION($where: UmitMaterialWhereUniqueInput!) {
    deleteUmitMaterial(where: $where) {
      id
    }
  }
`;

export const DELETE_SENSOR_MUTATION = gql`
  mutation DELETE_SENSOR_MUTATION($where: UmitSensorWhereUniqueInput!) {
    deleteUmitSensor(where: $where) {
      id
    }
  }
`;
