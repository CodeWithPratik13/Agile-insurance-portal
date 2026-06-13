import { useMemo } from "react";

export const MiniBars = ({ values = [60, 75, 45, 90, 65, 80, 55, 70, 85, 50, 95, 78], color = "#2563eb" }) => (
  <div className="flex h-28 items-end gap-2">
    {values.map((value, index) => (
      <div key={`${value}-${index}`} className="flex flex-1 items-end">
        <div className="w-full rounded-t" style={{ height: `${value}%`, backgroundColor: color }} title={`${value}%`} />
      </div>
    ))}
  </div>
);

export const LineSpark = ({ values = [30, 55, 40, 70, 50, 85, 60, 75, 45, 90, 65, 80], color = "#2563eb" }) => {
  const points = useMemo(() => {
    const max = Math.max(...values);
    const min = Math.min(...values);
    const range = Math.max(max - min, 1);
    return values
      .map((value, index) => {
        const x = (index / Math.max(values.length - 1, 1)) * 260;
        const y = 96 - ((value - min) / range) * 82;
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(" ");
  }, [values]);

  return (
    <svg viewBox="0 0 260 110" className="h-28 w-full" role="img" aria-label="Trend line chart">
      <polyline points={points} fill="none" stroke={color} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      {points.split(" ").map((point) => {
        const [x, y] = point.split(",");
        return <circle key={point} cx={x} cy={y} r="4" fill="white" stroke={color} strokeWidth="3" />;
      })}
    </svg>
  );
};
