import React from 'react';
import Highcharts from 'highcharts/highstock';
import More from 'highcharts/highcharts-more';
import HighchartsReact from 'highcharts-react-official';
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
      type: 'category',
    },
    yAxis: {
      title: {
        text: 'Total number of words',
      }
    },
    plotOptions: {
      series: {
        borderWidth: 0,
        dataLabels: {
          enabled: true,
          format: '{point.y}'
        }
      }
    },
    series: [{
      name: 'Artists',
      colorByPoint: true,
      data: data.map(artist => {
        return {
          name: artist.name,
          y: artist.lyrics.length,
          drilldown: artist.name
        }
      })
    }]
  };

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
