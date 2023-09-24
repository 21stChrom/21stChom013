import React, { useState, useEffect, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import localforage from 'localforage';

function App() {
  const [counter, setCounter] = useState(0);
  const [timer, setTimer] = useState(0);
  const [chartData, setChartData] = useState({});
  const intervalRef = useRef(null);

  useEffect(() => {
    // Load data from local storage on app startup
    loadData();
  }, []);

  useEffect(() => {
    // Update the chart data whenever the counter or timer changes
    updateChartData();
    // Save data to local storage whenever the counter or timer changes
    saveData();
  }, [counter, timer]);

  const incrementCounter = () => {
    setCounter(counter + 1);
  };

  const decrementCounter = () => {
    setCounter(counter - 1);
  };

  const resetCounter = () => {
    setCounter(0);
  };

  const startTimer = () => {
    if (!intervalRef.current) {
      intervalRef.current = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1);
      }, 1);
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
    setChartData({
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
  };

  const saveData = () => {
    localforage.setItem('userData', { counter, timer });
  };

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