import React, { useState } from 'react';
import moment from 'moment-timezone';
import './App.css';

function App() {
  const [input, setInput] = useState('');
  const [utcResult, setUtcResult] = useState('');
  const [copyMessage, setCopyMessage] = useState('');
  const [copyStatus, setCopyStatus] = useState('');
  const [warningMessage, setWarningMessage] = useState(null);
  
  const handleConvert = () => {
    // Split the input by ', ' to get date and time separately
    const [date, time] = input.split(', ').map(part => part.trim());

    // Validate the input format
    if (!date || !time) {
      setWarningMessage(true);
      setUtcResult('Please enter a valid date and time in the format YYYY-MM-DD, h:mm:ss AM/PM');
      return;
    }

    // Try to create a moment object
    const colomboTime = moment.tz(`${date} ${time}`, 'YYYY-MM-DD h:mm:ss A', 'Asia/Colombo');

    // Check if the moment object is valid
    if (!colomboTime.isValid()) {
      setWarningMessage(true);
      setUtcResult('Invalid date and time format. Please check your input.');
      return;
    }

    // Convert to UTC
    const utcTime = colomboTime.utc().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
    setUtcResult(utcTime);
    setWarningMessage(false);
  };

  const handleClear = () => {
    setInput('');
    setUtcResult('');
    setWarningMessage(null);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(utcResult).then(() => {
      setCopyStatus(true); // success;
      setCopyMessage('time converted to UTC & copied to clipboard!');
      setTimeout(() => {
        setCopyMessage('');
      }, 1000);
    }).catch(err => {
      setCopyStatus(false);
      setCopyMessage('Failed to copy: ' + err);
    });
  };
    return (
    <div className="App">
      <h2>Convert Date and Time from Asia/Colombo to UTC</h2>
      <input
        type="text"
        onClick={handleClear}
        placeholder="YYYY-MM-DD, h:mm:ss AM/PM"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <br />
      <button onClick={handleClear}>Clear</button>
      <button onClick={handleConvert}>Convert to UTC</button>
      <button onClick={handleCopy} disabled={!utcResult}>Copy UTC Time</button>
      <h3>UTC Date and Time:</h3>
        <div style = {{backgroundColor:warningMessage === false ? 'rgba(82, 185, 99, 0.4)' : warningMessage === true ? 'rgba(255, 15, 15, 0.4)' : warningMessage === null ? 'transparent' : 'transparent' , padding:'10px'}}>
          <p>{utcResult}</p>
        </div>
      
      <div style = {{backgroundColor:copyStatus === true ? 'rgba(82, 185, 99, 0.4)' : copyStatus === false ? 'rgba(255, 15, 15, 0.4)' : 'transparent' }} >
      {copyMessage && <p style={{padding:'10px', marginHorizontal:'auto', marginTop:'200px'}} className="copy-message">{copyMessage}</p>} {/* Display the copy message */}
      </div>
    </div>
  );
}

export default App;
