export const easeSmooth = [0.22, 1, 0.36, 1] as const;

export const motionTransition = {
  duration: 0.5,
  ease: easeSmooth,
};

export const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: motionTransition,
  },
};

export const cardMotion = {
  initial: { opacity: 0, y: 14 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.15 },
  transition: motionTransition,
};

export const hoverLift = {
  y: -4,
  transition: { duration: 0.4, ease: easeSmooth },
};

export const pageMotion = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.52, ease: easeSmooth },
};
