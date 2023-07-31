const prices = {
  yearlyBiciMAD: 25,
  halfHourBiciMAD: 0.5,
  oneHourBiciMAD: 1.1,
  monthlyEMT: 21.8,
  monthlyEMTUnder26: 8,
  monthlyEMTOver65: 4.3,
  tenTripsEMT: 6.1,
  doesYearlyEMTExist: new Date() >= new Date('01/01/2024'),
  isBiciMADFree: new Date() < new Date('01/01/2024')
}

export default prices
