import { useState } from "react";

const StatisticsLine = ({ text, value }) => {
  let output = ``;

  switch (value) {
    case "average":
      output = `${value.toFixed(2)}%`;
      break;
    case "positive":
      output = `${value.toFixed(1)}`;
      break;
    default:
      output = value;
      break;
  }

  return (
    <div>
      {text} {output}
    </div>
  );
};

const Statistics = ({ props }) => {
  return (
    <div>
      <StatisticsLine text="good" value={props.good} />
      <StatisticsLine text="neutral" value={props.neutral} />
      <StatisticsLine text="bad" value={props.bad} />
      <StatisticsLine text="all" value={props.all} />
      <StatisticsLine text="average" value={props.average} />
      <StatisticsLine text="positive" value={props.positive} />
    </div>
  );
};

const App = () => {
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  const all = good + neutral + bad;
  const average = all === 0 ? 0 : (good - bad) / all;
  const positive = all === 0 ? 0 : (good / all) * 100;

  const data = {
    good,
    neutral,
    bad,
    all,
    average,
    positive,
  };

  return (
    <div>
      <h1>Give Feedback</h1>
      <div>
        <button onClick={() => setGood((p) => p + 1)}>Good</button>
        <button onClick={() => setNeutral((p) => p + 1)}>Neutral</button>
        <button onClick={() => setBad((p) => p + 1)}>Bad</button>
      </div>
      <Statistics props={data} />
    </div>
  );
};

export default App;
