// prisma/seed.js
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Seed SubCities
  const subCities = [
    { id: "sc1", name: "Addis Ketema" },
    { id: "sc2", name: "Akaki Kaliti" },
    { id: "sc3", name: "Arada" },
    { id: "sc4", name: "Bole" },
    { id: "sc5", name: "Gulele" },
    { id: "sc6", name: "Kirkos" },
    { id: "sc7", name: "Kolfe Keranio" },
    { id: "sc8", name: "Lideta" },
    { id: "sc9", name: "Nifas Silk-Lafto" },
    { id: "sc10", name: "Yeka" },
    { id: "sc11", name: "Lemi Kura" }
  ];

  for (const sc of subCities) {
    await prisma.subCity.upsert({
      where: { id: sc.id },
      update: {},
      create: sc
    });
  }

  console.log("✅ SubCities seeded");

  // Seed Woredas
  const woredas = [
    { id: "sc4-w1", name: "Bole Woreda 1", subCityId: "sc4" },
    { id: "sc4-w2", name: "Bole Woreda 2", subCityId: "sc4" },
    { id: "sc4-w3", name: "Bole Woreda 3", subCityId: "sc4" },
    { id: "sc4-w4", name: "Bole Woreda 4", subCityId: "sc4" },
    { id: "sc4-w5", name: "Bole Woreda 5", subCityId: "sc4" }, // <-- your user references this
    // add more woredas for other subCities similarly
  ];

  for (const w of woredas) {
    await prisma.woreda.upsert({
      where: { id: w.id },
      update: {},
      create: w
    });
  }

  console.log("✅ Woredas seeded");
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());