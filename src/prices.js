const prices = {
  // BiciMAD
  monthlyBiciMAD: 10,
  halfHourBiciMAD: 0.5,
  oneHourBiciMAD: 1,
  // Monthly CRTM
  monthlyEMT: 21.8, // 54.6 (60%)
  monthlyEMTUnder26: 8, // 20 (60%)
  monthlyEMTOver65: 0,
  // Yearly CRTM
  yearlyEMT: 273, // 546 (60%)
  yearlyEMTUnder26: 100, // 200 (60%)
  yearlyEMTOver65: 0,
  // Trips CRTM
  tenTripsEMT: 6.1, // 12.2 (50%)
  // Conditions
  doesYearlyEMTExist: false,
  isBiciMADFree: new Date() < new Date('01/02/2024'),
  // Discounts CRTM (%)
  disability: 0.2,
  largeFamily: { general: 0.2, special: 0.5 }
}

export default prices
