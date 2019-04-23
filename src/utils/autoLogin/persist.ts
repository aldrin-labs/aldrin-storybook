export const apolloCachePersist = {
  '$ROOT_QUERY.login.user': {
    'email': 'nge@nge.nge',
    'email_verified': false,
    'name': 'nge@nge.nge',
    'nickname': 'nge',
    'picture': '',
    'sub': 'auth0|5bfd48f0301a9f3aa493b8bf',
    'updated_at': '2019-04-22T13:58:18.870Z',
    '__typename': 'Profile'
  },
  '$ROOT_QUERY.login': {
    'user': {
      'type': 'id',
      'generated': true,
      'id': '$ROOT_QUERY.login.user',
      'typename': 'Profile'
    },
    'loginStatus': true,
    'modalIsOpen': false,
    'modalLogging': false,
    'authError': false,
    'authErrorText': '',
    '__typename': 'login'
  },
  'ROOT_QUERY': {
    'login': {
      'type': 'id',
      'generated': true,
      'id': '$ROOT_QUERY.login',
      'typename': 'login'
    },
  },
}

// Temperaly, need to wait for temperal test token on back
export const idTokens = [
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IlJqRkdRVEk0TWtZM1FUTTNRekZGUWtNNFJUazJNelU1TWtZMlJUSTNOekF4TVRBMk4wUXhNZyJ9.eyJuaWNrbmFtZSI6Im5nZSIsIm5hbWUiOiJuZ2VAbmdlLm5nZSIsInBpY3R1cmUiOiJodHRwczovL3MuZ3JhdmF0YXIuY29tL2F2YXRhci9kYjA1ZDA3ZDMyZWI2NGQzMjc0MjUxN2Y0MzI2ZjIxZD9zPTQ4MCZyPXBnJmQ9aHR0cHMlM0ElMkYlMkZjZG4uYXV0aDAuY29tJTJGYXZhdGFycyUyRm5nLnBuZyIsInVwZGF0ZWRfYXQiOiIyMDE5LTA0LTIyVDEzOjU4OjE4Ljg3MFoiLCJlbWFpbCI6Im5nZUBuZ2UubmdlIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJpc3MiOiJodHRwczovL2NjYWkuYXV0aDAuY29tLyIsInN1YiI6ImF1dGgwfDViZmQ0OGYwMzAxYTlmM2FhNDkzYjhiZiIsImF1ZCI6IjBONnVKOGxWTWJpemU3M0N2OXRTaGFLZHFKSG1oMVdtIiwiaWF0IjoxNTU1OTQxNDk5LCJleHAiOjE1NTYyNDE0OTksImF0X2hhc2giOiJoVzJOTHVYQkY1NHVOQzFMRkRHUlB3Iiwibm9uY2UiOiIxdVRsfkUtb05waS1ad2haSGEwcThGY0Z3NW1VX0NrOCJ9.ic4XN0EINRTmO2GBv842oGs0_hXPKviIphiTEurs4BACVl-AxUjtqWPZVS-ScNm7ab2xs-iQMUwLHabmNnrNSJYnIL0vrAWZ14ZwpQa1w3Jt6eBYqcEIYGZcPAoRRjX97iBBBS4yKCxx4nQSp3YVvhyAGzI8v7Q2mR9PLRDQ0-cU8eVx2HsyZA5EV8CpNnsSX85DXjGLP4WfTyU2j73Am2CsBxl2gpuMAPkeLxTyv-KrgumTmGU2S0bQIhT5si6w1EYhA5mqjmL504GOnqyqLJDtz7kKwCQNNlsUM5pgSWUPc0c4bSsCBjdczLIgrFMIijuoWKgGQgFm174hq6PgYQ',
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IlJqRkdRVEk0TWtZM1FUTTNRekZGUWtNNFJUazJNelU1TWtZMlJUSTNOekF4TVRBMk4wUXhNZyJ9.eyJuaWNrbmFtZSI6Im5nZTIiLCJuYW1lIjoibmdlMkBuZ2UyLm5nZSIsInBpY3R1cmUiOiJodHRwczovL3MuZ3JhdmF0YXIuY29tL2F2YXRhci9mZTRkNjZlMTQ0M2IyNDUzYWExNmRhMWE5Y2NlYTFmZD9zPTQ4MCZyPXBnJmQ9aHR0cHMlM0ElMkYlMkZjZG4uYXV0aDAuY29tJTJGYXZhdGFycyUyRm5nLnBuZyIsInVwZGF0ZWRfYXQiOiIyMDE5LTA0LTIzVDEwOjU0OjU4LjQwM1oiLCJlbWFpbCI6Im5nZTJAbmdlMi5uZ2UiLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImlzcyI6Imh0dHBzOi8vY2NhaS5hdXRoMC5jb20vIiwic3ViIjoiYXV0aDB8NWMwNjdhNWQ2NDliZDMyZGUzYmRkODlkIiwiYXVkIjoiME42dUo4bFZNYml6ZTczQ3Y5dFNoYUtkcUpIbWgxV20iLCJpYXQiOjE1NTYwMTY4OTksImV4cCI6MTU1NjMxNjg5OSwiYXRfaGFzaCI6ImdjWG9hSUM1NE1yM0d2c2llYmMteWciLCJub25jZSI6Ing3QjBDSVA2TTdSMTVILU1wZTM3UmlQZ0FCQzBMMUpYIn0.eSWA0CgmaIFWinAAF69hNtzGl5pusmGJ5MlmNZ3Zb7Wk2NhXQQvW2QZyTBTmWPpE1K2Ghoc2uR2iFRPSJWoyQS7gUuDAjmjn5lCo5HFEca2fgmIm_PK-vfRenEI2AtgbOXsKGPLis6QjjPqm3rvvTUTt306L4BDoYcWzOo8mTh8HhbFTDiIgOtB40mogN0igSlTVgQ7U0PARqxAopofui2vwk1O3lA7nxyKXmms_xhS6201rnUCUVg9fVwtLJ8bRjoxPckev2blNchV9Gvyg_c70ne4I5JYjtYnqdC0-5IRuExw7S0GdiZ1ZdXwcrAGpaUbJQNkKMnXHuXmiokcAdQ',
]

export const persistRoot = {
  user: JSON.stringify({
    'check': 'lol',
    'isShownMocks': false,
    'showBinanceWarning': false,
    'toolTip': {
      'portfolioMain': false,
      'portfolioIndustry': false,
      'portfolioRebalance': false,
      'portfolioCorrelation': false,
      'portfolioOptimization': false,
      'chartPage': false,
      'multiChartPage': false,
    },
  }),
}