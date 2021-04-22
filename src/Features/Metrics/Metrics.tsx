import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Provider, createClient, useQuery } from 'urql';
import { FormControl, Input, InputLabel, MenuItem, Select } from '@material-ui/core';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { actions } from '../Metrics/reducer';
import { IState } from '../../store';

const client = createClient({
  url: 'https://react.eogresources.com/graphql',
});

const query = `
query {
    getMetrics 
}
`;

export default () => {
  return (
    <Provider value={client}>
      <Metrics />
    </Provider>
  );
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
      maxWidth: 300,
    },
    chips: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    chip: {
      margin: 2,
    },
    noLabel: {
      marginTop: theme.spacing(3),
    },
  }),
);

const Metrics = () => {
  const classes = useStyles();
  const [result] = useQuery({
    query,
  });
  const { data } = result;

  const metricValues = (state: IState) => {
    const { metrics } = state.metrics;
    return { metrics };
  };
  const dispatch = useDispatch();
  const { metrics } = useSelector(metricValues);

  if (data != null) {
    const metricsValue: string[] = data.getMetrics;
    return (
      <>
        <FormControl className={classes.formControl}>
          <InputLabel id="demo-simple-chip-label">Metric</InputLabel>
          <Select
            labelId="demo-simple-chip-label"
            id="demo-simple-chip"
            value={metrics}
            onChange={event => {
              dispatch(actions.metricUpdated({ metrics: event.target.value as string }));
            }}
            input={<Input id="select-multiple-chip" />}
          >
            {metricsValue.map(name => (
              <MenuItem key={name} value={name}>
                {name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </>
    );
  }
  return null;
};
