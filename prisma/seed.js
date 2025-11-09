const { PrismaClient, EntryType } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  await prisma.entry.deleteMany();

  await prisma.entry.createMany({
    data: [
      {
        title: 'Inception',
        type: EntryType.MOVIE,
        director: 'Christopher Nolan',
        budget: 160000000,
        location: 'Los Angeles, USA',
        duration: 148,
        yearOrTime: '2010',
      },
      {
        title: 'The Grand Budapest Hotel',
        type: EntryType.MOVIE,
        director: 'Wes Anderson',
        budget: 25000000,
        location: 'Görlitz, Germany',
        duration: 99,
        yearOrTime: '2014',
      },
      {
        title: 'Stranger Things',
        type: EntryType.TV_SHOW,
        director: 'The Duffer Brothers',
        budget: 6000000,
        location: 'Jackson, USA',
        duration: 50,
        yearOrTime: '2016-Present',
      },
      {
        title: 'The Crown',
        type: EntryType.TV_SHOW,
        director: 'Peter Morgan',
        budget: 13000000,
        location: 'London, UK',
        duration: 58,
        yearOrTime: '2016-2023',
      },
    ],
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
