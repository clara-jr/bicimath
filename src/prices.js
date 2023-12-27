const prices = {
  // BiciMAD
  monthlyBiciMAD: 10,
  halfHourBiciMAD: 0.5,
  oneHourBiciMAD: 1,
  // Monthly CRTM
  monthlyEMT: 21.8,
  monthlyEMTUnder26: 8,
  monthlyEMTOver65: 0,
  // Yearly CRTM
  yearlyEMT: 273,
  yearlyEMTUnder26: 100,
  yearlyEMTOver65: 0,
  // Trips CRTM
  tenTripsEMT: 6.1,
  // Conditions
  doesYearlyEMTExist: new Date() >= new Date('01/01/2024'),
  isBiciMADFree: new Date() < new Date('01/02/2024')
}

export default prices
