const subCities = [
  { id: 'sc1', name: 'Addis Ketema', woredas: 15 },
  { id: 'sc2', name: 'Akaki Kaliti', woredas: 14 },
  { id: 'sc3', name: 'Arada', woredas: 13 },
  { id: 'sc4', name: 'Bole', woredas: 15 },
  { id: 'sc5', name: 'Gulele', woredas: 13 },
  { id: 'sc6', name: 'Kirkos', woredas: 13 },
  { id: 'sc7', name: 'Kolfe Keranio', woredas: 15 },
  { id: 'sc8', name: 'Lideta', woredas: 12 },
  { id: 'sc9', name: 'Nifas Silk-Lafto', woredas: 15 },
  { id: 'sc10', name: 'Yeka', woredas: 14 },
  { id: 'sc11', name: 'Lemi Kura', woredas: 10 },
];

const woredas = [];

subCities.forEach(sc => {
  for (let i = 1; i <= sc.woredas; i++) {
    woredas.push({
      id: `${sc.id}-w${i}`,
      name: `Woreda ${i}`,
      subCityId: sc.id
    });
  }
});

module.exports = { subCities, woredas };