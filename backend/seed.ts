const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding test data...');

  const subjectsData = [
    {
      title: 'Next.js 14 App Router Masterclass', slug: 'nextjs-masterclass',
      description: 'Learn Next.js 14 from the ground up! Master Server Components, Server Actions, suspense, caching, and building robust full-stack applications like Udemy clones.',
      youtube_urls: ['https://www.youtube.com/watch?v=Sklc_fQBmcs', 'https://www.youtube.com/watch?v=Zi-Q0t4gMC8']
    },
    {
      title: 'Tailwind CSS Pro', slug: 'tailwind-css-pro',
      description: 'Master utility-first CSS framework. Build beautiful, responsive designs without ever leaving your HTML.',
      youtube_urls: ['https://www.youtube.com/watch?v=_GTMOnL1M9U']
    },
    {
      title: 'Python for Beginners', slug: 'python-for-beginners',
      description: 'The ultimate Python course for beginners. Learn python syntax, loops, dictionaries, and functions.',
      youtube_urls: ['https://www.youtube.com/watch?v=mU6anWqZJcc']
    },
    {
      title: 'React Fundamentals', slug: 'react-fundamentals',
      description: 'Master React essentials including components, hooks, state, and props. Build interactive UIs.',
      youtube_urls: ['https://www.youtube.com/watch?v=bMknfKXIFA8']
    },
    {
      title: 'Node.js Backend Masterclass', slug: 'nodejs-backend-masterclass',
      description: 'Learn Node, Express, MongoDB and build real-world backend architectures from scratch.',
      youtube_urls: ['https://www.youtube.com/watch?v=Oe421EPjeBE']
    },
    {
      title: 'HTML & Web Basics', slug: 'html-web-basics',
      description: 'Start your web development journey learning HTML semantic tags, forms, and layouts.',
      youtube_urls: ['https://www.youtube.com/watch?v=qz0aGYrrlhU']
    },
    {
      title: 'CSS Styling mastery', slug: 'css-styling-mastery',
      description: 'Learn CSS properties, flexbox, CSS grid, and responsive animations.',
      youtube_urls: ['https://www.youtube.com/watch?v=1PnVor36_40']
    },
    {
      title: 'JavaScript Essentials', slug: 'javascript-essentials',
      description: 'Learn vanilla JavaScript variables, functions, closures, promises, and the DOM.',
      youtube_urls: ['https://www.youtube.com/watch?v=W6NZfCO5SIk']
    },
    {
      title: 'C++ Systems Programming', slug: 'cpp-systems-programming',
      description: 'Learn C++ memory management, pointers, and object oriented programming.',
      youtube_urls: ['https://www.youtube.com/watch?v=vLnPwxZdW4Y']
    },
    {
      title: 'C Programming 101', slug: 'c-programming-101',
      description: 'Dive deep into the C language, pointers, memory allocation, and OS level fundamentals.',
      youtube_urls: ['https://www.youtube.com/watch?v=KJgsSFOSQv0']
    },
    {
      title: 'Java Masterclass', slug: 'java-masterclass',
      description: 'Learn object oriented Java programming, classes, Spring Boot basics, and multithreading.',
      youtube_urls: ['https://www.youtube.com/watch?v=xk4_1vDrzzo']
    }
  ];

  for (const s of subjectsData) {
    await prisma.subject.upsert({
      where: { slug: s.slug },
      update: {},
      create: {
        title: s.title,
        slug: s.slug,
        description: s.description,
        is_published: true,
        sections: {
          create: [
            {
              title: 'Getting Started',
              order_index: 0,
              videos: {
                create: s.youtube_urls.map((url, index) => ({
                  title: `Lesson ${index + 1}`,
                  description: 'An introductory lesson.',
                  youtube_url: url,
                  order_index: index,
                  duration_seconds: 600,
                }))
              }
            }
          ]
        }
      }
    });
  }

  console.log('Seeding finished.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
