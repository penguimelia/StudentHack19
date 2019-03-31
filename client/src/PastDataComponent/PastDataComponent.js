import React from 'react';
import Highcharts from 'highcharts/highstock';
import More from 'highcharts/highcharts-more';
import HighchartsReact from 'highcharts-react-official';
import theme from './PastDataComponentTheme';
// import './PastDataComponent.css';

More(Highcharts)

const PastDataComponent = ({ data }) => {
  const barChart = {
    chart: {
      type: 'column',
      scrollablePlotArea: true,
    },
    title: {
      text: 'Artists comparison',
    },
    xAxis: {
      categories: data.map(artist => artist.name),
      crosshair: true,
    },
    yAxis: {
      min: 0,
      title: {
        text: 'Total number of words',
      },
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
      name: 'Total number of words',
      data: data.map(artist => artist.lyrics.length),
    }, {
      name: 'Unique words',
      data: data.map(artist => [...new Set(artist.lyrics)].length),
    }],
  };

  console.log(theme);

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

export default PastDataComponent;
