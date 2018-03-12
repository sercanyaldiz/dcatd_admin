import { FETCH_UI_DATASET_SUCCESS, SET_UI_DATASET_ORDER } from '../actions/uiDataset';

const initialState = {};

export default function (state = initialState, action) {
  switch (action.type) {
    case FETCH_UI_DATASET_SUCCESS:
      return { ...action.uiDataset };
    case SET_UI_DATASET_ORDER:
      return {
        ...state,
        'ui:order': action.schema['x-order']
      };
    default:
      return state;
  }
}
