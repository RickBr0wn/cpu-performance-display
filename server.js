const five = require("johnny-five")
const board = new five.Board()
const cpuStat = require("cpu-stat")
const si = require("systeminformation")

board.on("ready", function () {
  var i = 0
  var iface = ""
  const lcd = new five.LCD({
    // LCD pin name  RS  EN  DB4 DB5 DB6 DB7
    pins: [7, 8, 9, 10, 11, 12]
  })

  setInterval(() => {
    cpuStat.usagePercent((err, percent, seconds) => {
      lcd.cursor(0, 0).print("C:" + percent.toFixed(2))
    })
  }, 500)

  setInterval(() => {
    si.networkStats().then(data => {
      lcd.cursor(1, 0).print("T:" + (data.tx_sec / 1048576).toFixed(2))
      lcd.cursor(1, 8).print("R:" + (data.rx_sec / 1048576).toFixed(2))
    })
  }, 1000)

  let counter = 1

  setInterval(() => {
    const avgClockMHz = cpuStat.avgClockMHz()

    if (counter === 2) {
      lcd.cursor(0, 8).print('        ')
      lcd.cursor(0, 8).print(avgClockMHz + 'MHz')
      counter = 1
    } else if (counter === 1) {
      si.cpu()
        .then(data => {
          console.log(data)
          lcd.cursor(0, 8).print('        ')
          lcd.cursor(0, 8).print(data.brand.substr(6))
          counter = 2
        })
        .catch(error => console.error(error))
    }
  }, 4000)
})