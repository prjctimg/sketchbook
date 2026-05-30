export const easing = {
  standard: [0.4, 0, 0.2, 1] as const,
  decelerate: [0.0, 0, 0.2, 1] as const,
  accelerate: [0.4, 0, 1, 1] as const,
  sharp: [0.4, 0, 0.6, 1] as const,
};

export const duration = {
  micro: 0.2,
  compact: 0.3,
  medium: 0.4,
  expressive: 0.5,
};

export const hoverScale = {
  whileHover: { scale: 1.02 },
  whileTap: { scale: 0.97 },
  transition: { duration: duration.micro, ease: easing.standard },
};
