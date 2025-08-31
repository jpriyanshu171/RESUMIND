import { useEffect, useRef, useState } from "react";

const ScoreGauge = ({
  score = 75,
  size = 200,
}: {
  score: number;
  size?: number;
}) => {
  const [pathLength, setPathLength] = useState(0);
  const pathRef = useRef<SVGPathElement>(null);
  const percentage = score / 100;

  useEffect(() => {
    if (pathRef.current) {
      setPathLength(pathRef.current.getTotalLength());
    }
  }, []);

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size / 2 }}>
        <svg viewBox="0 0 100 50" width="100%" height="100%">
          <defs>
            <linearGradient
              id="gaugeGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor="#a7f3d0" />
              <stop offset="50%" stopColor="#fde68a" />
              <stop offset="100%" stopColor="#fb923c" />
            </linearGradient>
          </defs>

          {/* Background arc */}
          <path
            d="M10,50 A40,40 0 0,1 90,50"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="12"
            strokeLinecap="round"
          />

          {/* Foreground arc */}
          <path
            ref={pathRef}
            d="M10,50 A40,40 0 0,1 90,50"
            fill="none"
            stroke="url(#gaugeGradient)"
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={pathLength}
            strokeDashoffset={pathLength * (1 - percentage)}
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center pt-6">
          <span className="text-lg md:text-2xl font-bold">{score}/100</span>
        </div>
      </div>
    </div>
  );
};

export default ScoreGauge;
