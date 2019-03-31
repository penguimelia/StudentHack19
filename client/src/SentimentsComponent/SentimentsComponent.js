import React from 'react';
import Highcharts from 'highcharts/highstock';
import More from 'highcharts/highcharts-more';
import HighchartsReact from 'highcharts-react-official';
import theme from './SentimentsComponentTheme';

More(Highcharts)

const SentimentsComponent = ({ data }) => {
  const filteredData = data.filter(song => song.sentiment.score !== 0);
  const barChart = {
    chart: {
      type: 'column',
      scrollablePlotArea: true,
    },
    title: {
      text: 'Songs Positivity',
    },
    xAxis: {
      categories: filteredData.map(song => song.track.track_name),
      crosshair: true,
    },
    yAxis: {
      enabled: false,
    },
    tooltip: {
      headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
      pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
          '<td style="padding:0"><b>{point.y:.1f}</b></td></tr>',
      footerFormat: '</table>',
      shared: true,
      useHTML: true,
    },
    plotOptions: {
      column: {
        pointPadding: 0.2,
        borderWidth: 0
      },
      series: {
        borderWidth: 0,
        dataLabels: {
          enabled: true,
          format: '{point.y}',
        },
      }
    },
    series: [{
      name: 'Happiness\' score',
      data: filteredData.map(song => Math.round(song.sentiment.score * 100))
    }],
  };

  Object.keys(theme).forEach(key => {
    if (barChart.hasOwnProperty(key)) {
      barChart[key] = Object.assign(theme[key], barChart[key]);
    } else {
      barChart[key] = theme[key];
    }
  });

  return (
    <div>
      <HighchartsReact
        highcharts={Highcharts}
        options={barChart}
      />
    </div>

  );
};

export default SentimentsComponent;
