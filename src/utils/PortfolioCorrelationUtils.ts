export function optimizeMocks(): { rows: string[]; cols: any[][] } {
  const m = {}
  const o = Object.keys(m).map((key) => ({ [key]: m[key] }))
  const rows = o.map((a) => {
    const arr = Object.keys(a)

    return arr[0].slice(0, -7)
  })

  const cols = o.map((a) =>
    Object.keys(a).map((key) => {
      const s = a[key]

      return Object.keys(s).map((keyV) => s[keyV])
    })
  )

  return { rows, cols }
}

export function getColor(
  value: string
): { backgroundColor: string; textColor: string } {
  const n = Number(value)
  if (n >= 0.9) {
    return { backgroundColor: '#4caf50', textColor: 'white' }
  } else if (n >= 0.8 && n < 0.9) {
    return { backgroundColor: '#449d48', textColor: 'white' }
  } else if (n >= 0.7 && n < 0.8) {
    return { backgroundColor: '#3d8b40', textColor: 'white' }
  } else if (n >= 0.6 && n < 0.7) {
    return { backgroundColor: '#357a38', textColor: 'white' }
  } else if (n >= 0.5 && n < 0.6) {
    return { backgroundColor: '#2d6830', textColor: 'white' }
  } else if (n >= 0.4 && n < 0.5) {
    return { backgroundColor: '#265628', textColor: 'white' }
  } else if (n >= 0.3 && n < 0.4) {
    return { backgroundColor: '#1e4520', textColor: 'white' }
  } else if (n >= 0.2 && n < 0.3) {
    return { backgroundColor: '#163318', textColor: 'white' }
  } else if (n >= 0.1 && n < 0.2) {
    return { backgroundColor: '#163318', textColor: 'white' }
  } else if (n >= 0 && n < 0.1) {
    return { backgroundColor: '#173317', textColor: 'white' }
  } else if (n >= -0.1 && n < 0) {
    return { backgroundColor: '#700a05', textColor: 'white' }
  } else if (n >= -0.2 && n < -0.1) {
    return { backgroundColor: '#561500', textColor: 'white' }
  } else if (n >= -0.3 && n < -0.2) {
    return { backgroundColor: '#701b00', textColor: 'white' }
  } else if (n >= -0.4 && n < -0.3) {
    return { backgroundColor: '#892100', textColor: 'white' }
  } else if (n >= -0.5 && n < -0.4) {
    return { backgroundColor: '#a22700', textColor: 'black' }
  } else if (n >= -0.6 && n < -0.5) {
    return { backgroundColor: '#bc2d00', textColor: 'black' }
  } else if (n >= -0.7 && n < -0.6) {
    return { backgroundColor: '#d53300', textColor: 'black' }
  } else if (n >= -0.8 && n < -0.7) {
    return { backgroundColor: '#ee3900', textColor: 'black' }
  } else if (n >= -0.9 && n < -0.8) {
    return { backgroundColor: '#ff4408', textColor: 'black' }
  } else if (n >= -1 && n < -0.9) {
    return { backgroundColor: '#ff5722', textColor: 'black' }
  }
}

export function getHeatMapData(
  data: { pair: string; values: { [key: string]: string }[] }[]
) {
  const result: { x: number; y: number }[] = []
  data.forEach((item, i) => {
    item.values.forEach((value, idx) => {
      result.push({
        x: i + 1,
        y: idx * 2,
        color: getColor(value.v).backgroundColor,
      })
    })
  })

  return result
}
