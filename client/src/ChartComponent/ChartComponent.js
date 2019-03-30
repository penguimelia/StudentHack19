import React from 'react';
import Highcharts from 'highcharts/highstock'
import More from 'highcharts/highcharts-more'
import HighchartsReact from 'highcharts-react-official'
// import './ChartComponent.css';

More(Highcharts)
const lyricFreq = lyrics => {
  const freq = [];

  Object.values(lyrics).forEach((song) => {
    song.forEach((key) => {
      if (freq.hasOwnProperty(key)) {
        freq[key]++;
      } else {
        freq[key] = 1;
      }
    });
  });

  const sorted = Object.keys(freq).map(function(key) {
      return [key, freq[key]];
    }).sort(function(first, second) {
      return second[1] - first[1];
    });

  return sorted;
}

const ChartComponent = ({ lyrics, artist }) => {
  if (!lyrics || !Object.keys(lyrics).length)
    return;

  const title = 'Words ' + artist.artist_name + ' uses';

  const freq = lyricFreq(lyrics);
  const barChart = {
    chart: {
      type: 'bar',
      width: 500,
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

  var objArray = []
  freq.forEach(pair => {
    objArray.push({name: pair[0], value: pair[1]})
  })

  console.log(objArray);

  const bubbleChart = {
    chart: {
      type: 'packedbubble',
      width: 500,
      height: 500
    },
    title: { text: title },
    plotOptions: {
      packedbubble: {
        dataLabels: {
          enabled: true,
          format: '{point.name}',
          filter: {
            property: 'y',
            operator: '>',
            value: 5
          },
        },
        style: {
          color: 'black',
          textOutline: 'none',
          fontWeight: 'normal'
        },
      }
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
      <HighchartsReact
        highcharts={Highcharts}
        options={bubbleChart}
      />
    </div>

  );
};

export default ChartComponent;
