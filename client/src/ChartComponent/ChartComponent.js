import React from 'react';
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
// import './ChartComponent.css';

const lyricFreq = lyrics => {
  const freqChart = [];

  Object.values(lyrics).forEach((song) => {
    song.forEach((key) => {
      if (freqChart.hasOwnProperty(key)) {
        freqChart[key]++;
      } else {
        freqChart[key] = 1;
      }
    });
  });

  const sorted = Object.keys(freqChart).map(function(key) {
      return [key, freqChart[key]];
    }).sort(function(first, second) {
      return second[1] - first[1];
    });

  return sorted;
}

const ChartComponent = ({ lyrics, artist }) => {
  if (!lyrics || !Object.keys(lyrics).length)
    return;

  const freqChart = lyricFreq(lyrics);
  const chart = {
    chart: {
      type: 'bar',
      width: 800,
      height: 1000
    },
    title: {
      text: 'Words ' + artist.artist_name + ' uses'
    },
    xAxis: {
      categories: freqChart.map(pair => pair[0])
    },
    series: [{
      name: artist.artist_name,
      data: freqChart.map(pair => pair[1])
    }]
  };

  return (
    <HighchartsReact
      highcharts={Highcharts}
      options={chart}
    />
  );
};

export default ChartComponent;
