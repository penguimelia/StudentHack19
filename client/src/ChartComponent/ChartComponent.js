import React from 'react';
import Highcharts from 'highcharts/highstock';
import More from 'highcharts/highcharts-more';
import HighchartsReact from 'highcharts-react-official';
// import './ChartComponent.css';

More(Highcharts)

const ChartComponent = ({ freq, artist }) => {
  const title = 'Words ' + artist.artist_name + ' uses';
  const barChart = {
    chart: {
      type: 'bar',
      height: 500,
      scrollablePlotArea: true,
    },
    title: { text: title },
    xAxis: {
      categories: freq.map(pair => pair[0]),
      min: 0,
      max: 20,
      scrollbar: { enabled: true }
    },
    yAxis: {
      min: 0,
      max: Math.max(...freq.map(pair => pair[1]))
    },
    series: [{
      name: artist.artist_name,
      data: freq.map(pair => pair[1])
    }]
  };

  const topFreq = freq.slice(0, 30);
  const objArray = [];
  topFreq.forEach(pair => {
    objArray.push({name: pair[0], value: pair[1]});
  });



  const bubbleChart = {
    chart: {
      type: 'packedbubble',
      height: 500
    },
    title: {
      text: title
    },
    tooltip: {
        useHTML: true,
        pointFormat: '<b>{point.name}:</b> {point.y}'
    },
    plotOptions: {
      packedbubble: {
        dataLabels: {
          enabled: true,
          format: '{point.name}',
          filter: {
            property: 'y',
            operator: '>',
            value: 10
          },
          style: {
            color: 'black',
            textOutline: 'none',
            fontWeight: 'normal'
          },
        },
        minPointSize: 5,
      },
    },
    series: [{
      name: artist.artist_name,
      data: objArray
    }]
  };

  return (
    <div>
      <HighchartsReact
        highcharts={Highcharts}
        options={barChart}
      />
      <br />
      <HighchartsReact
        highcharts={Highcharts}
        options={bubbleChart}
      />
    </div>

  );
};

export default ChartComponent;
