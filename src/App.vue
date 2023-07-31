<script>
import prices from './prices.js'

export default {
  data() {
    return {
      age: null,
      travelRange: 1,
      tripsByMonth: null,
      tripIn30min: 'true',
      result: null,
      useBiciMAD: true,
      useBus: true,
      useMetro: true
    }
  },
  computed: {
    isButtonDisabled() {
      return (
        !this.age ||
        !this.travelRange ||
        !this.tripsByMonth ||
        (!this.useBus && !this.useMetro && !this.useBiciMAD)
      )
    }
  },
  methods: {
    getResult() {
      // Abono mensual CRTM
      const monthlyEMT =
        this.age < 26
          ? prices.monthlyEMTUnder26
          : this.age > 65
          ? prices.monthlyEMTOver65
          : prices.monthlyEMT
      const payByMonthEMT = monthlyEMT * this.travelRange

      // Abono anual CRTM
      const yearlyEMT = monthlyEMT * 10
      const payByYearEMT = Math.round(yearlyEMT)

      // Billete 10 viajes CRTM
      const tenTripsEMT = prices.tenTripsEMT
      const numberOfTenTripsTicketsEMT = Math.ceil((this.tripsByMonth * this.travelRange) / 10)
      const payByTripEMT = Math.round(tenTripsEMT * numberOfTenTripsTicketsEMT)

      // Abono anual BiciMAD
      const yearlyBiciMAD = prices.yearlyBiciMAD
      const singleTripBiciMAD =
        this.tripIn30min === 'true' ? prices.halfHourBiciMAD : prices.oneHourBiciMAD
      const payByYearBiciMAD = Math.round(
        yearlyBiciMAD + singleTripBiciMAD * this.tripsByMonth * this.travelRange
      )

      // BiciMAD ocasional
      const singleTripBiciMADOcasional = prices.oneHourBiciMADOccasional
      const payByTripBiciMAD = Math.round(
        singleTripBiciMADOcasional * this.tripsByMonth * this.travelRange
      )

      const options = {}
      const results = {}

      if (this.useBus || this.useMetro) {
        options.payByMonthEMT = payByMonthEMT
        options.payByTripEMT = payByTripEMT
        results.payByMonthEMT =
          +this.travelRange > 1
            ? `La opción más económica en tu caso será pagar por el abono mensual del CRTM y tendrá un coste total de ${payByMonthEMT} € (${monthlyEMT} € al mes).`
            : `La opción más económica en tu caso será pagar por el abono mensual del CRTM y tendrá un coste de ${payByMonthEMT} €.`
        results.payByTripEMT =
          numberOfTenTripsTicketsEMT > 1
            ? `La opción más económica en tu caso será utilizar abonos de 10 viajes del CRTM y tendrá un coste total de ${payByTripEMT} € (${numberOfTenTripsTicketsEMT} billetes de 10 viajes a un precio de ${tenTripsEMT} € cada uno).`
            : `La opción más económica en tu caso será utilizar un abono de 10 viajes del CRTM y tendrá un coste de ${payByTripEMT} €`

        if (prices.doesYearlyEMTExist) {
          options.payByYearEMT = payByYearEMT
          results.payByYearEMT = `La opción más económica en tu caso será pagar por el abono anual del CRTM y tendrá un coste de ${payByYearEMT}.`
        }
      }

      if (this.useBiciMAD) {
        options.payByYearBiciMAD = payByYearBiciMAD
        options.payByTripBiciMAD = payByTripBiciMAD
        results.payByYearBiciMAD =
          this.tripIn30min === 'true'
            ? `La opción más económica en tu caso será utilizar un abono anual de BiciMAD por un precio total de ${payByYearBiciMAD} € (${yearlyBiciMAD} € iniciales y ${singleTripBiciMAD} € cada trayecto de menos de 30 min).`
            : `La opción más económica en tu caso será utilizar un abono anual de BiciMAD por un precio total de ${payByYearBiciMAD} € (${yearlyBiciMAD} € iniciales y ${singleTripBiciMAD} € cada trayecto de menos de 1 h).`
        results.payByTripBiciMAD = `La opción más económica en tu caso será utilizar BiciMAD de forma ocasional por un precio total de ${payByTripBiciMAD} € (${singleTripBiciMADOcasional} € cada trayecto de menos de 1 h).`

        if (prices.isBiciMADFree) {
          options.isBiciMADFree = 0
          results.isBiciMADFree =
            this.tripIn30min === 'true'
              ? `La opción más económica este año es utilizar BiciMAD ya que, hasta el 31 de diciembre de 2023, los viajes de menos de 30 minutos son gratuitos.`
              : `La opción más económica este año es utilizar BiciMAD ya que, hasta el 31 de diciembre de 2023, los viajes de menos de 30 minutos son gratuitos (y siempre puedes ir enlazando bicis de una estación de BiciMAD a otra).`
        }
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
      <p id="intro" class="input-group">
        Si alguna vez te has preguntado cuál era la mejor opción para moverte por Madrid, estás en
        el sitio indicado para resolver tus dudas. ¿Te compensa el abono mensual? ¿El abono anual?
        ¿Utilizar BiciMAD sería más económico? Completa el formulario y lo descubrirás.
      </p>
      <div class="input-group">
        <label for="transportType">{{ '¿Qué medios de transporte podrías usar?' }}</label>
        <p class="radio">
          <input
            type="checkbox"
            id="useBiciMAD"
            name="useBiciMAD"
            value="useBiciMAD"
            v-model="useBiciMAD"
            checked
          />{{ ' BiciMAD' }}
        </p>
        <p class="radio">
          <input
            type="checkbox"
            id="useMetro"
            name="useMetro"
            value="useMetro"
            v-model="useMetro"
            checked
          />{{ ' Metro' }}
        </p>
        <p class="radio">
          <input
            type="checkbox"
            id="useBus"
            name="useBus"
            value="useBus"
            v-model="useBus"
            checked
          />{{ ' Bus EMT' }}
        </p>
      </div>
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
        <p class="tooltip">* La ida y la vuelta cuentan como viajes separados.</p>

        <input
          type="number"
          id="tripsByMonth"
          v-model="tripsByMonth"
          placeholder="Introduce el nº de viajes"
          required
        />
      </div>

      <div class="input-group" v-if="useBiciMAD">
        <label for="tripIn30min">{{
          '¿Cada trayecto podrías hacerlo generalmente en menos de 30 minutos en bici?'
        }}</label>

        <p class="radio">
          <input type="radio" v-model="tripIn30min" value="true" name="yes" checked />{{ ' Sí' }}
        </p>
        <p class="radio">
          <input type="radio" v-model="tripIn30min" value="false" name="no" />{{ ' No' }}
        </p>
      </div>

      <div class="submit">
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
