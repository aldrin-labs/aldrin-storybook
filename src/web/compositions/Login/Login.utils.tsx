export const isEmailValid = ({ email }: { email: string }): boolean => {
  const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

  return emailRegex.test(email)
}

export const scorePassword = (pass) => {
  let score = 0
  if (!pass)
    return [
      score,
      { digits: false, lower: false, upper: false, nonWords: false },
    ]

  // award every unique letter until 5 repetitions
  const letters = new Object()
  for (let i = 0; i < pass.length; i++) {
    letters[pass[i]] = (letters[pass[i]] || 0) + 1
    score += 5.0 / letters[pass[i]]
  }

  // bonus points for mixing it up
  const variations = {
    digits: /\d/.test(pass),
    lower: /[a-z]/.test(pass),
    upper: /[A-Z]/.test(pass),
    nonWords: /\W/.test(pass),
  }

  let variationCount = 0
  for (let check in variations) {
    variationCount += !!variations[check] ? 1 : 0
  }
  score += (variationCount - 1) * 10

  return [score, variations]
}
