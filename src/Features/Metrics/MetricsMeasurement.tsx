import React from 'react';
import { Provider, createClient, useQuery } from 'urql';
import { Line } from 'react-chartjs-2';
import { useSelector } from 'react-redux';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { IState } from '../../store';

const client = createClient({
  url: 'https://react.eogresources.com/graphql',
});

const query = `
query($input: MeasurementQuery!) {
  getMeasurements(input: $input) {
      metric
      at
      value
      unit  
    }
}
`;

export default () => {
  return (
    <Provider value={client}>
      <MetricsMeasurement />
    </Provider>
  );
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    line: {
      width: '60%',
    },
  }),
);

const MetricsMeasurement = () => {
  const classes = useStyles();

  const metricValues = (state: IState) => {
    const { metrics } = state.metrics;
    return { metrics };
  };
  let { metrics } = useSelector(metricValues);
  const input = { metricName: metrics };
  const [result] = useQuery({
    query,
    variables: { input },
  });
  const { data } = result;
  if (data != null) {
    let measurementValues = data.getMeasurements;
    if (Array.isArray(measurementValues)) {
      measurementValues = measurementValues.filter(a => a.metric === metrics && a.at % 60 === 0);
      if (Array.isArray(measurementValues)) {
        const label = measurementValues.slice(measurementValues.length - 60).map(a => {
          const date = new Date(a.at);
          const hours = date.getHours();
          const minutes = '0' + date.getMinutes();
          return hours + ':' + minutes.substr(-2);
        });
        const dataValue = measurementValues.slice(measurementValues.length - 60).map(a => a.value);

        const state = {
          labels: label,
          datasets: [
            {
              label: metrics,
              fill: false,
              lineTension: 0.5,
              backgroundColor: 'rgba(75,192,192,1)',
              borderColor: 'rgba(0,0,0,1)',
              borderWidth: 2,
              data: dataValue,
            },
          ],
        };
        if (measurementValues.length > 0) {
          return (
            <div className={classes.line}>
              <Line
                type="line"
                data={state}
                options={{
                  title: {
                    display: true,
                    text: 'Average Rainfall per month',
                    fontSize: 20,
                  },
                  legend: {
                    display: true,
                    position: 'right',
                  },
                }}
              />
            </div>
          );
        }
      }
    }
  }
  return null;
};
