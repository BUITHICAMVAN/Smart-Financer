export const convertRateCurrency = (amount, rates, currenecyUnit) => {
  return Number(amount) * rates[currenecyUnit]
}

