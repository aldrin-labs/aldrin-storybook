// https://stackoverflow.com/questions/2685911/is-there-a-way-to-round-numbers-into-a-reader-friendly-format-e-g-1-1k

export function abbrNum(inputNumber: number, decPlaces: number) {
  // 2 decimal places => 100, 3 => 1000, etc
  decPlaces = Math.pow(10, decPlaces)

  // Enumerate number abbreviations
  var abbrev = ['k', 'm', 'b', 't']
  var strNumber = ''

  // Go through the array backwards, so we do the largest first
  for (var i = abbrev.length - 1; i >= 0; i--) {
    // Convert array index to "1000", "1000000", etc
    var size = Math.pow(10, (i + 1) * 3)

    // If the number is bigger or equal do the abbreviation
    if (size <= inputNumber) {
      // Here, we multiply by decPlaces, round, and then divide by decPlaces.
      // This gives us nice rounding to a particular decimal place.
      inputNumber = Math.round(inputNumber * decPlaces / size) / decPlaces

      // Handle special case where we round up to the next abbreviation
      if (inputNumber == 1000 && i < abbrev.length - 1) {
        inputNumber = 1
        i++
      }

      // Add the letter for the abbreviation
      strNumber = inputNumber + abbrev[i]

      // We are done... stop
      break
    }
  }

  return strNumber
}
