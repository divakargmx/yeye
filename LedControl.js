import React, { useState, useEffect } from 'react';
import mqtt from 'mqtt';

const LedControl = () => {
  const [ledStates, setLedStates] = useState({
    D1: { mode: 0, val: 0 },
    D2: { mode: 0, val: 0 },
    D3: { mode: 0, val: 0 },
    D4: { mode: 0, val: 0 },
  });

  useEffect(() => {
    const client = mqtt.connect('mqtt://your-mqtt-broker-url');

    client.on('connect', () => {
      client.subscribe('your-mqtt-topic');
    });

    client.on('message', (topic, message) => {
      const data = JSON.parse(message.toString());
      setLedStates(data.data);
    });

    return () => {
      client.end();
    };
  }, []);

  const handleToggle = (led) => {
    const newState = {
      ...ledStates,
      [led]: {
        ...ledStates[led],
        mode: 1,
        val: ledStates[led].val === 0 ? 1 : 0,
      },
    };

    setLedStates(newState);

    // Publish the updated state to MQTT
    const client = mqtt.connect('mqtt://your-mqtt-broker-url');
    client.publish('your-mqtt-topic', JSON.stringify({ data: newState }));
    client.end();
  };

  return (
    <div>
      <h1>LED Control</h1>
      <div>
        <label>
          LED 1:
          <input
            type="checkbox"
            checked={ledStates.D1.val === 1}
            onChange={() => handleToggle('D1')}
          />
        </label>
      </div>
      <div>
        <label>
          LED 2:
          <input
            type="checkbox"
            checked={ledStates.D2.val === 1}
            onChange={() => handleToggle('D2')}
          />
        </label>
      </div>
      <div>
        <label>
          LED 3:
          <input
            type="checkbox"
            checked={ledStates.D3.val === 1}
            onChange={() => handleToggle('D3')}
          />
        </label>
      </div>
      <div>
        <label>
          LED 4:
          <input
            type="checkbox"
            checked={ledStates.D4.val === 1}
            onChange={() => handleToggle('D4')}
          />
        </label>
      </div>
    </div>
  );
};

export default LedControl;
