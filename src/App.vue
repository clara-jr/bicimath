<script>
import prices from './prices.js'

export default {
  data() {
    return {
      age: null,
      travelRange: 1,
      tripsByMonth: null,
      tripIn30min: 'true',
      result: null
    }
  },
  computed: {
    isButtonDisabled() {
      return !this.age || !this.travelRange || !this.tripsByMonth
    }
  },
  methods: {
    getResult() {
      const monthlyEMT =
        this.age < 26
          ? prices.monthlyEMTUnder26
          : this.age > 65
          ? prices.monthlyEMTOver65
          : prices.monthlyEMT
      const yearlyEMT = monthlyEMT * 10
      const payByMonthEMT = monthlyEMT * this.travelRange
      const payByYearEMT = Math.round(yearlyEMT)

      const tenTripsEMT = prices.tenTripsEMT
      const numberOfTenTripsTicketsEMT = Math.ceil((this.tripsByMonth * this.travelRange) / 10)
      const payByTripEMT = Math.round(tenTripsEMT * numberOfTenTripsTicketsEMT)

      const yearlyBiciMAD = prices.yearlyBiciMAD
      const singleTripBiciMAD =
        this.tripIn30min === 'true' ? prices.halfHourBiciMAD : prices.oneHourBiciMAD
      const payByYearBiciMAD = Math.round(
        yearlyBiciMAD + singleTripBiciMAD * this.tripsByMonth * this.travelRange
      )

      const options = {
        payByMonthEMT: payByMonthEMT,
        payByTripEMT: payByTripEMT,
        payByYearBiciMAD: payByYearBiciMAD
      }

      const results = {
        payByMonthEMT:
          +this.travelRange > 1
            ? `La opción más económica en tu caso será pagar por el abono mensual del CRTM y tendrá un coste total de ${payByMonthEMT} € (${monthlyEMT} € al mes).`
            : `La opción más económica en tu caso será pagar por el abono mensual del CRTM y tendrá un coste de ${payByMonthEMT} €.`,
        payByTripEMT:
          numberOfTenTripsTicketsEMT > 1
            ? `La opción más económica en tu caso será utilizar abonos de 10 viajes del CRTM y tendrá un coste total de ${payByTripEMT} € (${numberOfTenTripsTicketsEMT} billetes de 10 viajes a un precio de ${tenTripsEMT} € cada uno).`
            : `La opción más económica en tu caso será utilizar un abono de 10 viajes del CRTM y tendrá un coste de ${payByTripEMT} €`,
        payByYearBiciMAD: `La opción más económica en tu caso será utilizar un abono anual de BiciMAD por un precio total de ${payByYearBiciMAD} € (${yearlyBiciMAD} € iniciales y ${singleTripBiciMAD} € cada trayecto).`
      }

      if (prices.doesYearlyEMTExist) {
        options.payByYearEMT = payByYearEMT
        results.payByYearEMT = `La opción más económica en tu caso será pagar por el abono anual del CRTM y tendrá un coste de ${payByYearEMT}.`
      }

      if (prices.isBiciMADFree) {
        options.isBiciMADFree = 0
        results.isBiciMADFree =
          this.tripIn30min === 'true'
            ? `La opción más económica este año es utilizar BiciMAD ya que, hasta el 31 de diciembre de 2023, los viajes de menos de 30 minutos son gratuitos.`
            : `La opción más económica este año es utilizar BiciMAD ya que, hasta el 31 de diciembre de 2023, los viajes de menos de 30 minutos son gratuitos (y siempre puedes ir enlazando bicis de una estación de BiciMAD a otra).`
      }

      const [[lowestKey]] = Object.entries(options).sort(([, valA], [, valB]) => valA - valB)
      this.result = results[lowestKey]
    }
  }
}
</script>

<template>
  <header>
    <h1>BiciMATH 🚲</h1>
  </header>
  <main>
    <div class="form">
      <div class="input-group">
        <label for="age">¿Cuál es tu edad?</label>
        <input type="number" id="age" v-model="age" placeholder="Introduce tu edad" required />
      </div>

      <div class="input-group">
        <label for="travelRange">¿Durante cuánto tiempo vas a viajar en transporte público?</label>
        <select v-model="travelRange" name="travelRange" id="travelRange">
          <option value="1">1 mes o menos</option>
          <option value="2">2 meses</option>
          <option value="3">3 meses</option>
          <option value="4">4 meses</option>
          <option value="5">5 meses</option>
          <option value="6">6 meses</option>
          <option value="7">7 meses</option>
          <option value="8">8 meses</option>
          <option value="9">9 meses</option>
          <option value="10">10 meses</option>
          <option value="11">11 meses</option>
          <option value="12">1 año</option>
        </select>
      </div>

      <div v-if="travelRange" class="input-group">
        <label for="tripsByMonth">{{
          travelRange === 1
            ? '¿Cuántos viajes harás en ese periodo de tiempo?'
            : '¿Cuántos viajes harás al mes?'
        }}</label>
        <p>* La ida y la vuelta cuentan como viajes separados.</p>

        <input type="number" id="tripsByMonth" v-model="tripsByMonth" required />
      </div>

      <div class="input-group">
        <label for="tripIn30min">{{
          '¿Cada trayecto podrías hacerlo generalmente en menos de 30 minutos en bici?'
        }}</label>

        <p>
          <input type="radio" v-model="tripIn30min" value="true" name="yes" checked />{{ ' Sí' }}
        </p>
        <p><input type="radio" v-model="tripIn30min" value="false" name="no" />{{ ' No' }}</p>
      </div>

      <div>
        <button :disabled="isButtonDisabled" @click="!isButtonDisabled && getResult()">
          ¿Qué me sale mejor?
        </button>
      </div>

      <div v-if="result" id="result">
        {{ result }}
      </div>
    </div>
  </main>
</template>

<style scoped>
header {
  display: flex;
  justify-content: center;

  margin-bottom: 2rem;
}

main {
  display: flex;
  justify-content: center;
}

.form {
  width: 50%;
}

#result {
  padding: 10px;
  margin-top: 20px;
  border: 1px solid #888;
  border-radius: 4px;
}

.input-group {
  display: flex;
  flex-direction: column;

  margin-bottom: 1rem;
}
</style>
