const fireDoomElm = document.querySelector('.fire-canvas')
const negativeElement = document.querySelector('#negative')
const firePixelArray = []
let fireWidth = 60
let fireHeight = 40
const fireColorsPalette = [{"r":7,"g":7,"b":7},{"r":31,"g":7,"b":7},{"r":47,"g":15,"b":7},{"r":71,"g":15,"b":7},{"r":87,"g":23,"b":7},{"r":103,"g":31,"b":7},{"r":119,"g":31,"b":7},{"r":143,"g":39,"b":7},{"r":159,"g":47,"b":7},{"r":175,"g":63,"b":7},{"r":191,"g":71,"b":7},{"r":199,"g":71,"b":7},{"r":223,"g":79,"b":7},{"r":223,"g":87,"b":7},{"r":223,"g":87,"b":7},{"r":215,"g":95,"b":7},{"r":215,"g":95,"b":7},{"r":215,"g":103,"b":15},{"r":207,"g":111,"b":15},{"r":207,"g":119,"b":15},{"r":207,"g":127,"b":15},{"r":207,"g":135,"b":23},{"r":199,"g":135,"b":23},{"r":199,"g":143,"b":23},{"r":199,"g":151,"b":31},{"r":191,"g":159,"b":31},{"r":191,"g":159,"b":31},{"r":191,"g":167,"b":39},{"r":191,"g":167,"b":39},{"r":191,"g":175,"b":47},{"r":183,"g":175,"b":47},{"r":183,"g":183,"b":47},{"r":183,"g":183,"b":55},{"r":207,"g":207,"b":111},{"r":223,"g":223,"b":159},{"r":239,"g":239,"b":199},{"r":255,"g":255,"b":255}]
let direction = 1
let negative = false
let rowsFire = Array.from({ length: fireHeight })
let columnsFire = Array.from({ length: fireWidth })

let debug = false

function createFireDataStructure () {
  firePixelArray.push(
    ...Array.from({ length: fireWidth * fireHeight }, () => 0)
  )
}

function renderFire () {
  
  let html = '<table cellpadding=0 cellspacing=0>'

  rowsFire.forEach((_, rowIndex) => {
    html += '<tr>'

    columnsFire.forEach((_, columnIndex) => {
      const pixelIndex = columnIndex + (fireWidth * rowIndex)
      const fireIntensity = firePixelArray[pixelIndex]
      const colors = fireColorsPalette[fireIntensity]
      const color = negative ? negativeColors(colors) : colors
      const colorString = `rgb(${color.r}, ${color.g}, ${color.b})`

      if (debug) {
        html += `<td>
          <span class="pixel-index">${pixelIndex}</span>
          <span style="color: ${colorString}">${fireIntensity}</span>
        </td>`
        return
      }
      html += `<td class="pixel" style="background-color: ${colorString}"></td>`
    })
    html += '</tr>'
  })

  html += '</table>'
  fireDoomElm.innerHTML = html
}

function createFireSource () {
  columnsFire.forEach((_, column) => {
    const overflowPixelIndex = fireWidth * fireHeight
    const pixelIndex = overflowPixelIndex - fireWidth + column
    firePixelArray[pixelIndex] = 36
  })
}

function calculateFirePropagation () {
  columnsFire.forEach((_, column) => {
    rowsFire.forEach((_, row) => {
      const pixelIndex = column + (fireWidth * row)

      updateFireIntensityPerPixel(pixelIndex)
    })
  })
  renderFire()
}

function updateFireIntensityPerPixel (currentPixelIndex) {
  const bellowPixelIndex = currentPixelIndex + fireWidth
  
  if (bellowPixelIndex >= fireWidth * fireHeight) return

  const decay = Math.floor(Math.random() * 3.0) & 3

  const belowPixelFireIntensity = firePixelArray[bellowPixelIndex]
  const newFireIntensity = belowPixelFireIntensity - decay >= 0 ? belowPixelFireIntensity - decay : 0
  const decayDirection = decay * direction

  firePixelArray[currentPixelIndex - decayDirection] = newFireIntensity
}

function destroyFireSource () {
  columnsFire.forEach((_, column) => {
    const overflowPixelIndex = fireWidth * fireHeight
    const pixelIndex = (overflowPixelIndex - fireWidth) + column

    firePixelArray[pixelIndex] = 0
  })
}

function decreaseFireSource () {
  columnsFire.forEach((_, column) => {
    const overflowPixelIndex = fireWidth * fireHeight
    const pixelIndex = (overflowPixelIndex - fireWidth) + column
    const currentFireIntensity = firePixelArray[pixelIndex]

    if (currentFireIntensity > 0) {
      const decay = Math.floor(Math.random() * 14)
      const newFireIntensity = currentFireIntensity - decay >= 0 ? currentFireIntensity - decay : 0

      firePixelArray[pixelIndex] = newFireIntensity
    }
  })
}

function increaseFireSource () {
  columnsFire.forEach((_, column) => {
    const overflowPixelIndex = fireWidth * fireHeight
    const pixelIndex = (overflowPixelIndex - fireWidth) + column
    const currentFireIntensity = firePixelArray[pixelIndex]

    if (currentFireIntensity < 36) {
      const decay = Math.floor(Math.random() * 14)
      const newFireIntensity = currentFireIntensity + decay < 36 ? currentFireIntensity + decay : 36
      
      firePixelArray[pixelIndex] = newFireIntensity
    }
  })
}

function updateColumnAndRowStructure () {
  rowsFire = Array.from({ length: fireHeight })
  columnsFire = Array.from({ length: fireWidth })
}

function debugMode () {
  if (debug) {
    fireWidth = 60
    fireHeight = 40
    debug = !debug
  } else {
    fireWidth = 25
    fireHeight = 17
    debug = !debug
  }
  updateColumnAndRowStructure()
  createFireDataStructure()
  createFireSource()
}

function changeDirection () {
  const directions = [-1, 0, 1]
  const directionIndex = (directions.indexOf(direction) + 1) % directions.length
  direction = directions[directionIndex]
}

function negativeColors (rgbObject) {
  const r = Math.abs(rgbObject.r - 255)
  const g = Math.abs(rgbObject.g - 255)
  const b = Math.abs(rgbObject.b - 255)
  return { r, g , b}
}

negativeElement.addEventListener('change', (e) => {
  negative = !negative
})

function start () {
  createFireDataStructure()
  createFireSource()
  setInterval(calculateFirePropagation, 50)
}

start()
