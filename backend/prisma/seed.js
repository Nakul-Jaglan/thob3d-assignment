const prisma = require('../src/prismaClient');

async function main() {
  console.log('Seeding assets...');

  // remove existing assets (optional)
  await prisma.asset.deleteMany();

  const assets = [
    {
      ownerId: 'user1',
      name: 'Sunset Photo',
      description: 'A high-resolution photo of a sunset over the hills.',
      url: 'https://example.com/assets/sunset.jpg',
      category: 'photo',
      format: 'jpg',
      size: 245760,
      tags: ['sunset', 'nature', 'photo'],
    },
    {
      ownerId: 'user2',
      name: 'Product Mockup',
      description: 'Transparent PNG product mockup.',
      url: 'https://example.com/assets/mockup.png',
      category: 'design',
      format: 'png',
      size: 512000,
      tags: ['mockup', 'product', 'design'],
    },
    {
      ownerId: 'user1',
      name: 'Explainer Video',
      description: 'Short explainer animation.',
      url: 'https://example.com/assets/explainer.mp4',
      category: 'video',
      format: 'mp4',
      size: 10485760,
      tags: ['video', 'animation'],
    },
    {
      ownerId: 'user3',
      name: 'Icon Set',
      description: 'SVG icon set for UI.',
      url: 'https://example.com/assets/icons.zip',
      category: 'icon',
      format: 'zip',
      size: 102400,
      tags: ['icons', 'svg', 'ui'],
    },
    {
      ownerId: 'user2',
      name: 'Background Music',
      description: 'Loopable background music track.',
      url: 'https://example.com/assets/music.mp3',
      category: 'audio',
      format: 'mp3',
      size: 3072000,
      tags: ['audio', 'music', 'loop'],
    },
  ];

  for (const a of assets) {
    await prisma.asset.create({ data: a });
  }

  console.log(`Seeded ${assets.length} assets.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
