// Generate cute app names (simplified version)

const cuteAdjectives = [
  'Adorable', 'Blissful', 'Cheerful', 'Delightful', 'Elegant',
  'Friendly', 'Gentle', 'Happy', 'Inspiring', 'Joyful',
  'Kind', 'Lovely', 'Magical', 'Nice', 'Optimistic',
  'Peaceful', 'Quaint', 'Radiant', 'Sweet', 'Tender',
  'Upbeat', 'Vibrant', 'Wonderful', 'Xenial', 'Youthful', 'Zesty'
];

const cuteNouns = [
  'App', 'Buddy', 'Companion', 'Dream', 'Explorer',
  'Friend', 'Garden', 'Helper', 'Idea', 'Journey',
  'Kitty', 'Lighthouse', 'Mountain', 'Nest', 'Ocean',
  'Pal', 'Quest', 'Rainbow', 'Star', 'Treasure',
  'Unicorn', 'Voyage', 'Wonder', 'Xylophone', 'Yacht', 'Zoo'
];

export function generateCuteAppName(): string {
  const adjective = cuteAdjectives[Math.floor(Math.random() * cuteAdjectives.length)];
  const noun = cuteNouns[Math.floor(Math.random() * cuteNouns.length)];
  return `${adjective} ${noun}`;
}
