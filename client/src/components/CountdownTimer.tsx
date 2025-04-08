import { useEffect, useState } from 'react';

type TimeLeft = {
  minutes: number;
  seconds: number;
} | null;

const CountdownTimer = ({ targetTime }: { targetTime: string }) => {
  const calculateTimeLeft = (): TimeLeft => {
    const difference = +new Date(targetTime) - +new Date();

    if (difference > 0) {
      return {
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return null;
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="text-center text-lg font-medium text-gray-700">
      {timeLeft ? (
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
