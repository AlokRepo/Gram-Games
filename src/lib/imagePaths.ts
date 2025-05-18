
/**
 * @fileOverview Defines paths for static image assets.
 * Images should be placed in the `public` directory at the root of your project.
 * For example, an image with path '/images/games/bubble-popper-preview.png'
 * should be located at `public/images/games/bubble-popper-preview.png`.
 * External URLs can also be used here, provided the hostname is whitelisted in next.config.js.
 */

export const GAME_PREVIEW_IMAGES: Record<string, string> = {
  'bubble-popper': 'https://images.unsplash.com/photo-1504177847824-d075f5706770?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxOHx8cG9wJTIwYnViYmxlfGVufDB8fHx8MTc0NzU0NjM0Mnww&ixlib=rb-4.1.0&q=80&w=1080',
  'melt-away': '/images/games/melt-away-preview.png',
  // Add more game IDs and their image paths here as you add games.
  // Example:
  // 'new-game-id': '/images/games/new-game-preview.png',
};
