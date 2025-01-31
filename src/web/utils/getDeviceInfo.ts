// import * as firebase from 'firebase'
import { DeviceType } from '@core/types/DeviceTypes'

//mock
const firebase = {
  messaging: {
    isSupported: () => false,
  },
}

const firebaseConfig = {
  apiKey: 'AIzaSyAStchdIpX5C_wOElXUtg0PGsPG9JHx5IM',
  authDomain: 'crypto-currencies-ai.firebaseapp.com',
  databaseURL: 'https://crypto-currencies-ai.firebaseio.com',
  projectId: 'crypto-currencies-ai',
  storageBucket: 'crypto-currencies-ai.appspot.com',
  messagingSenderId: '364782928285',
  appId: '1:364782928285:web:c6b74a512928dcdc',
}
// Initialize Firebase
// why we need to check
// https://stackoverflow.com/questions/46071657/firebase-cloud-messaging-doesnt-work-on-chrome-ios
const isSupportedFirebase = firebase.messaging.isSupported()
let messaging

if (isSupportedFirebase) {
  firebase.initializeApp(firebaseConfig)
  messaging = firebase.messaging()
  messaging.usePublicVapidKey(
    'BOX1uR6f54au3dbb8rpYkP25wFkO8oH9vcr_3PGekTQiuMD3JSfdONLy0-1lLQIM0p2NafPLRPf6o4NiXXNMNVA'
  )
}

// https://stackoverflow.com/questions/9514179/how-to-find-the-operating-system-version-using-javascript
const deviceInfoStats = (function() {
  {

    const screen = window.screen
    const swfobject = window.swfobject
    var width, height
    var unknown = '-'

    // screen
    var screenSize = ''
    if (screen.width) {
      width = screen.width ? screen.width : ''
      height = screen.height ? screen.height : ''
      screenSize += '' + width + ' x ' + height
    }

    // browser
    var nVer = navigator.appVersion
    var nAgt = navigator.userAgent
    var browser = navigator.appName
    var version = '' + parseFloat(navigator.appVersion)
    var majorVersion = parseInt(navigator.appVersion, 10)
    var nameOffset, verOffset, ix

    // Opera
    if ((verOffset = nAgt.indexOf('Opera')) != -1) {
      browser = 'Opera'
      version = nAgt.substring(verOffset + 6)
      if ((verOffset = nAgt.indexOf('Version')) != -1) {
        version = nAgt.substring(verOffset + 8)
      }
    }
    // Opera Next
    if ((verOffset = nAgt.indexOf('OPR')) != -1) {
      browser = 'Opera'
      version = nAgt.substring(verOffset + 4)
    }
    // Edge
    else if ((verOffset = nAgt.indexOf('Edge')) != -1) {
      browser = 'Microsoft Edge'
      version = nAgt.substring(verOffset + 5)
    }
    // MSIE
    else if ((verOffset = nAgt.indexOf('MSIE')) != -1) {
      browser = 'Microsoft Internet Explorer'
      version = nAgt.substring(verOffset + 5)
    }
    // Chrome
    else if ((verOffset = nAgt.indexOf('Chrome')) != -1) {
      browser = 'Chrome'
      version = nAgt.substring(verOffset + 7)
    }
    // Safari
    else if ((verOffset = nAgt.indexOf('Safari')) != -1) {
      browser = 'Safari'
      version = nAgt.substring(verOffset + 7)
      if ((verOffset = nAgt.indexOf('Version')) != -1) {
        version = nAgt.substring(verOffset + 8)
      }
    }
    // Firefox
    else if ((verOffset = nAgt.indexOf('Firefox')) != -1) {
      browser = 'Firefox'
      version = nAgt.substring(verOffset + 8)
    }
    // MSIE 11+
    else if (nAgt.indexOf('Trident/') != -1) {
      browser = 'Microsoft Internet Explorer'
      version = nAgt.substring(nAgt.indexOf('rv:') + 3)
    }
    // Other browsers
    else if (
      (nameOffset = nAgt.lastIndexOf(' ') + 1) <
      (verOffset = nAgt.lastIndexOf('/'))
    ) {
      browser = nAgt.substring(nameOffset, verOffset)
      version = nAgt.substring(verOffset + 1)
      if (browser.toLowerCase() == browser.toUpperCase()) {
        browser = navigator.appName
      }
    }
    // trim the version string
    if ((ix = version.indexOf(';')) != -1) version = version.substring(0, ix)
    if ((ix = version.indexOf(' ')) != -1) version = version.substring(0, ix)
    if ((ix = version.indexOf(')')) != -1) version = version.substring(0, ix)

    majorVersion = parseInt('' + version, 10)
    if (isNaN(majorVersion)) {
      version = '' + parseFloat(navigator.appVersion)
      majorVersion = parseInt(navigator.appVersion, 10)
    }

    // mobile version
    var mobile = /Mobile|mini|Fennec|Android|iP(ad|od|hone)/.test(nVer)

    // cookie
    var cookieEnabled = navigator.cookieEnabled ? true : false

    if (typeof navigator.cookieEnabled == 'undefined' && !cookieEnabled) {
      document.cookie = 'testcookie'
      cookieEnabled = document.cookie.indexOf('testcookie') != -1 ? true : false
    }

    // system
    var os = unknown
    var clientStrings = [
      { s: 'Windows 10', r: /(Windows 10.0|Windows NT 10.0)/ },
      { s: 'Windows 8.1', r: /(Windows 8.1|Windows NT 6.3)/ },
      { s: 'Windows 8', r: /(Windows 8|Windows NT 6.2)/ },
      { s: 'Windows 7', r: /(Windows 7|Windows NT 6.1)/ },
      { s: 'Windows Vista', r: /Windows NT 6.0/ },
      { s: 'Windows Server 2003', r: /Windows NT 5.2/ },
      { s: 'Windows XP', r: /(Windows NT 5.1|Windows XP)/ },
      { s: 'Windows 2000', r: /(Windows NT 5.0|Windows 2000)/ },
      { s: 'Windows ME', r: /(Win 9x 4.90|Windows ME)/ },
      { s: 'Windows 98', r: /(Windows 98|Win98)/ },
      { s: 'Windows 95', r: /(Windows 95|Win95|Windows_95)/ },
      { s: 'Windows NT 4.0', r: /(Windows NT 4.0|WinNT4.0|WinNT|Windows NT)/ },
      { s: 'Windows CE', r: /Windows CE/ },
      { s: 'Windows 3.11', r: /Win16/ },
      { s: 'Android', r: /Android/ },
      { s: 'Open BSD', r: /OpenBSD/ },
      { s: 'Sun OS', r: /SunOS/ },
      { s: 'Chrome OS', r: /CrOS/ },
      { s: 'Linux', r: /(Linux|X11(?!.*CrOS))/ },
      { s: 'iOS', r: /(iPhone|iPad|iPod)/ },
      { s: 'Mac OS X', r: /Mac OS X/ },
      { s: 'Mac OS', r: /(MacPPC|MacIntel|Mac_PowerPC|Macintosh)/ },
      { s: 'QNX', r: /QNX/ },
      { s: 'UNIX', r: /UNIX/ },
      { s: 'BeOS', r: /BeOS/ },
      { s: 'OS/2', r: /OS\/2/ },
      {
        s: 'Search Bot',
        r: /(nuhk|Googlebot|Yammybot|Openbot|Slurp|MSNBot|Ask Jeeves\/Teoma|ia_archiver)/,
      },
    ]
    for (var id in clientStrings) {
      var cs = clientStrings[id]
      if (cs.r.test(nAgt)) {
        os = cs.s
        break
      }
    }

    var osVersion = unknown

    if (/Windows/.test(os)) {
      osVersion = /Windows (.*)/.exec(os)[1]
      os = 'Windows'
    }

    switch (os) {
      case 'Mac OS X':
        osVersion = /Mac OS X (10[\.\_\d]+)/.exec(nAgt)[1]
        break

      case 'Android':
        osVersion = /Android ([\.\_\d]+)/.exec(nAgt)[1]
        break

      case 'iOS':
        osVersion = /OS (\d+)_(\d+)_?(\d+)?/.exec(nVer)
        osVersion = osVersion[1] + '.' + osVersion[2] + '.' + (osVersion[3] | 0)
        break
    }

    // flash (you'll need to include swfobject)
    /* script src="//ajax.googleapis.com/ajax/libs/swfobject/2.2/swfobject.js" */
    var flashVersion = 'no check'
    if (typeof swfobject != 'undefined') {
      var fv = swfobject.getFlashPlayerVersion()
      if (fv.major > 0) {
        flashVersion = fv.major + '.' + fv.minor + ' r' + fv.release
      } else {
        flashVersion = unknown
      }
    }
  }

  const stats = {
    screen: screenSize,
    browser: browser,
    browserVersion: version,
    browserMajorVersion: majorVersion,
    mobile: mobile,
    os: os,
    osVersion: osVersion,
    cookies: cookieEnabled,
    flashVersion: flashVersion,
  }

  return stats
})()

const getFcmToken = async () => {
  return Notification.requestPermission().then((permission) => {
    if (permission === 'granted') {
      console.log('Notification permission granted.')
      return messaging
        .getToken()
        .then((currentToken) => {
          if (currentToken) {
            return currentToken
          }

          console.log(
            'No Instance ID token available. Request permission to generate one.'
          )
          return ''
        })
        .catch((err) => {
          console.log('An error occurred while retrieving token. ', err)
          return ''
        })
    } else {
      console.log('Unable to get permission to notify.')
      return ''
    }
  })
}

const getDeviceInfo = async ({
  ipAddress,
  countryCode,
}: {
  ipAddress: string
  countryCode: string
}): Promise<DeviceType> => {
  const {
    screen = '',
    browser = '',
    browserVersion = '',
    browserMajorVersion = '',
    mobile = false,
    os = '',
    osVersion = '',
    cookies = false,
    flashVersion = '',
  } = deviceInfoStats || {
    screen: '',
    browser: '',
    browserVersion: '',
    browserMajorVersion: '',
    mobile: false,
    os: '',
    osVersion: '',
    cookies: false,
    flashVersion: '',
  }

  const deviceInfo = {
    name: `${browser} ${browserMajorVersion}`,
    type: 'browser',
    // fcmToken: isSupportedFirebase ? await getFcmToken() : '',
    fcmToken: '',
    macAddress: '',
    ipAddress: ipAddress,
    lastLoginTime: Date.now(),
    countryCode,
    lastGeo: '',
    cookies,
    flashVersion,
    mobile,
    os,
    osVersion,
    screen,
  }
  return deviceInfo
}

export default getDeviceInfo
