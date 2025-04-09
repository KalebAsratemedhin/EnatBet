// CountdownTimer.tsx
import React, { useEffect, useState } from 'react';

const CountdownTimer = ({ targetTime }: { targetTime: string }) => {
  const calculateTimeLeft = () => {
    const difference = +new Date(targetTime) - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="text-center text-lg font-medium text-gray-700">
      {timeLeft.minutes != null ? (
        <p>
          Next Order In: {timeLeft.minutes}m {timeLeft.seconds}s
        </p>
      ) : (
        <p>No Upcoming Orders</p>
      )}
    </div>
  );
};

export default CountdownTimer;
