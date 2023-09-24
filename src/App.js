import React, { useState, useEffect, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import localforage from 'localforage';
import { CategoryScale, Chart } from "chart.js";
Chart.register(CategoryScale);
import { Chart, LinearScale } from 'chart.js';
Chart.register(LinearScale);
import { Chart, PointElement } from 'chart.js';
Chart.register(PointElement);
import { Chart, LineController, LineElement, PointElement, LinearScale, CategoryScale } from 'chart.js';

Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale);

const ctx = document.getElementById('myChart');
new Chart(ctx, {
  type: 'line',
  data: {},
  options: {}
});



function App() {
  const [counter, setCounter] = useState(0);
  const [timer, setTimer] = useState(0);
  const [chartData, setChartData] = useState({
    labels: ['Counter', 'Timer'],
    datasets: [
      {
        label: 'Progress',
        data: [counter, timer],
        backgroundColor: 'rgba(75,192,192,0.2)',
        borderColor: 'rgba(75,192,192,1)',
        borderWidth: 1,
      },
    ],
  });
  const intervalRef = useRef(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    updateChartData();
    saveData();
  }, [counter, timer]);

  const incrementCounter = () => setCounter(counter + 1);
  const decrementCounter = () => setCounter(counter - 1);
  const resetCounter = () => setCounter(0);

  const startTimer = () => {
    if (!intervalRef.current) {
      intervalRef.current = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1);
      }, 1000); // Changed from 1 to 1000 for a one-second interval
    }
  };

  const stopTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const resetTimer = () => {
    stopTimer();
    setTimer(0);
  };

  const updateChartData = () => {
    setChartData((prevChartData) => ({
      ...prevChartData,
      datasets: [
        {
          ...prevChartData.datasets[0],
          data: [counter, timer],
        },
      ],
    }));
  };

  const saveData = () => localforage.setItem('userData', { counter, timer });

  const loadData = async () => {
    const data = await localforage.getItem('userData');
    if (data) {
      setCounter(data.counter);
      setTimer(data.timer);
    }
  };

  return (
    <div>
      <div>
        <h2>Counter</h2>
        <button onClick={decrementCounter}>-</button>
        <span>{counter}</span>
        <button onClick={incrementCounter}>+</button>
        <button onClick={resetCounter}>Reset</button>
      </div>
      <div>
        <h2>Timer</h2>
        <button onClick={startTimer}>Start</button>
        <button onClick={stopTimer}>Stop</button>
        <button onClick={resetTimer}>Reset</button>
      </div>
      <div>
        <Line data={chartData} />
      </div>
    </div>
  );
}

export default App;
