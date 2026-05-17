import { Line } from "@react-three/drei";
import { useMemo } from "react";
import * as THREE from "three";

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
    const dir = new THREE.Vector3(0, cos, sin);
    return [
      dir.clone().multiplyScalar(-half).toArray() as [number, number, number],
      dir.clone().multiplyScalar(half).toArray() as [number, number, number],
    ];
  } else {
    const dir = new THREE.Vector3(sin, cos, 0);
    return [
      dir.clone().multiplyScalar(-half).toArray() as [number, number, number],
      dir.clone().multiplyScalar(half).toArray() as [number, number, number],
    ];
  }
}

export function AngleIndicators({
  lugAngle,
  seatingAngle,
  length = 3,
}: Props) {
  const lugPoints = useMemo(
    () =>
      lugAngle !== undefined
        ? angleToEndpoints(lugAngle, "yz", length)
        : null,
    [lugAngle, length]
  );

  const seatPoints = useMemo(
    () =>
      seatingAngle !== undefined
        ? angleToEndpoints(seatingAngle, "xy", length)
        : null,
    [seatingAngle, length]
  );

  return (
    <>
      {lugPoints && (
        <Line
          points={lugPoints}
          color="#ef4444"
          lineWidth={2}
          dashed={false}
        />
      )}
      {seatPoints && (
        <Line
          points={seatPoints}
          color="#3b82f6"
          lineWidth={2}
          dashed={false}
        />
      )}
    </>
  );
}
