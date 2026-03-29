import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

export const Stopwatch = ({ title }: { title?: string }) => {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prevSeconds) => prevSeconds + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <p className="text-sm flex gap-2 p-2 items-center justify-center rounded-[var(--radius)] border ">
      <Loader2 className="animate-spin h-4 w-4" />
      {title ? <span>{title}</span> : <span>Elapsed Time: </span>}
      <span>{seconds}s</span>
    </p>
  );
};
