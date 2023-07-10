/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";

type CountdownTimerProps = {
  onFinish: () => any;
  initialTime: number;
};

function formatTime(time: number): string {
  const hours = Math.floor(time / 3600);
  const minutes = Math.floor((time % 3600) / 60);
  const seconds = time % 60;

  return `${hours}h:${minutes < 10 ? "0" : ""}${minutes}m:${
    seconds < 10 ? "0" : ""
  }${seconds}s`;
}

export const CountdownTimer = ({ onFinish, initialTime }: CountdownTimerProps) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);

  useEffect(() => {
    if (initialTime === 999999) return;

    const intervalId = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    if (timeLeft === 0) {
      clearInterval(intervalId);
      onFinish();
    }

    return () => clearInterval(intervalId);
  }, [initialTime, timeLeft]);

  const formattedTime = initialTime === 999999 ? "-- : --" : formatTime(timeLeft);

  return <div>{formattedTime}</div>;
};