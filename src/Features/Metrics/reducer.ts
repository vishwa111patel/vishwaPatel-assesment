import { createSlice, PayloadAction } from 'redux-starter-kit';
import { ApiErrorAction } from '../Weather/reducer';

export type metricsType = {
  metrics: string;
};

const initialState = {
  metrics: '',
};

const slice = createSlice({
  name: 'metrics',
  initialState,
  reducers: {
    metricUpdated: (state, action: PayloadAction<metricsType>) => {
      let { metrics } = action.payload;
      state.metrics = metrics;
    },
    metricApiErrorUpdated: (state, action: PayloadAction<ApiErrorAction>) => state,
  },
});
export const reducer = slice.reducer;
export const actions = slice.actions;
