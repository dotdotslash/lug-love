import { Line } from "@react-three/drei";
import { useMemo } from "react";

type Props = {
  lugAngle?: number; // degrees from vertical in the Y-Z plane
  seatingAngle?: number; // degrees from vertical in the X-Y plane
  length?: number; // half-length of each indicator line
};

function angleToEndpoints(
  degrees: number,
  axis: "yz" | "xy",
  half: number
): [[number, number, number], [number, number, number]] {
  const rad = (degrees * Math.PI) / 180;
  const sin = Math.sin(rad);
  const cos = Math.cos(rad);
  if (axis === "yz") {
    return [[0, -half * cos, -half * sin], [0, half * cos, half * sin]];
  }
  return [[-half * sin, -half * cos, 0], [half * sin, half * cos, 0]];
}

export function AngleIndicators({ lugAngle, seatingAngle, length = 3 }: Props) {
  const lugPoints = useMemo(
    () => (lugAngle !== undefined ? angleToEndpoints(lugAngle, "yz", length) : null),
    [lugAngle, length]
  );
  const seatPoints = useMemo(
    () => (seatingAngle !== undefined ? angleToEndpoints(seatingAngle, "xy", length) : null),
    [seatingAngle, length]
  );

  return (
    <>
      {lugPoints && <Line points={lugPoints} color="#ef4444" lineWidth={2} dashed={false} />}
      {seatPoints && <Line points={seatPoints} color="#3b82f6" lineWidth={2} dashed={false} />}
    </>
  );
}
