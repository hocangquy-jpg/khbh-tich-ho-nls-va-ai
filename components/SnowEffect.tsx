import React, { useMemo } from 'react';
import { motion } from 'motion/react';

interface Snowflake {
  id: number;
  left: string;
  duration: number;
  delay: number;
  size: number;
  opacity: number;
}

const SnowEffect: React.FC = () => {
  const snowflakes = useMemo(() => {
    const counts = 50;
    const flakes: Snowflake[] = [];
    for (let i = 0; i < counts; i++) {
      flakes.push({
        id: i,
        left: `${Math.random() * 100}%`,
        duration: 10 + Math.random() * 20, // Slow falling
        delay: Math.random() * 20,
        size: 2 + Math.random() * 6,
        opacity: 0.3 + Math.random() * 0.7,
      });
    }
    return flakes;
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
      {snowflakes.map((flake) => (
        <motion.div
          key={flake.id}
          initial={{ top: '-10%', opacity: 0 }}
          animate={{
            top: '110%',
            opacity: [0, flake.opacity, flake.opacity, 0],
            x: [0, 20, -20, 0],
          }}
          transition={{
            duration: flake.duration,
            repeat: Infinity,
            delay: flake.delay,
            ease: "linear",
          }}
          style={{
            position: 'absolute',
            left: flake.left,
            width: flake.size,
            height: flake.size,
            backgroundColor: 'white',
            borderRadius: '50%',
            filter: 'blur(1px)',
          }}
        />
      ))}
    </div>
  );
};

export default SnowEffect;
