/** Local photography in /public */
export const IMAGES = {
  heroFerns: "/hero-ferns.jpg",
  heroProduce: "/hero-produce.jpg",
  farmVideoPoster: "/video-farm.jpg",
} as const;

export const IMAGE_DIMS = {
  heroFerns: { width: 1920, height: 1080 },
  heroProduce: { width: 800, height: 800 },
  farmVideoPoster: { width: 1280, height: 720 },
} as const;
