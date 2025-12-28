import { useEffect, useState } from "react";
import Snowfall from "react-snowfall";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

const getSeason = () => {
  const month = new Date().getMonth() + 1;
  if (month === 12 || month <= 2) return "winter";
  if (month >= 3 && month <= 5) return "spring";
  if (month >= 6 && month <= 8) return "summer";
  return "autumn";
};

export default function SeasonEffect() {
  const [season] = useState(getSeason());

  const particlesInit = async (engine) => {
    await loadFull(engine);
  };

  if (season === "winter") {
    return (
      <Snowfall
        snowflakeCount={120}
        style={{ position: "fixed", width: "100%", height: "100%", zIndex: 9999 }}
      />
    );
  }

  if (season === "spring") {
    return (
      <Particles
        init={particlesInit}
        options={{
          particles: {
            number: { value: 25 },
            shape: {
              type: "image",
              image: {
                src: "https://pngimg.com/uploads/sakura/sakura_PNG15.png",
                width: 20,
                height: 20,
              },
            },
            move: { direction: "bottom", speed: 1 },
            size: { value: 15 },
          },
        }}
        style={{ position: "fixed", inset: 0, zIndex: 9999 }}
      />
    );
  }

  if (season === "autumn") {
    return (
      <Particles
        init={particlesInit}
        options={{
          particles: {
            number: { value: 20 },
            shape: {
              type: "image",
              image: {
                src: "https://pngimg.com/uploads/autumn_leaves/autumn_leaves_PNG3615.png",
                width: 25,
                height: 25,
              },
            },
            move: { direction: "bottom", speed: 1.5 },
            size: { value: 18 },
          },
        }}
        style={{ position: "fixed", inset: 0, zIndex: 9999 }}
      />
    );
  }

  // ☀️ Summer
  return (
    <Particles
      init={particlesInit}
      options={{
        particles: {
          number: { value: 15 },
          color: { value: "#FFD700" },
          opacity: { value: 0.4 },
          size: { value: 8 },
          move: { speed: 0.5 },
        },
      }}
      style={{ position: "fixed", inset: 0, zIndex: 9999 }}
    />
  );
}