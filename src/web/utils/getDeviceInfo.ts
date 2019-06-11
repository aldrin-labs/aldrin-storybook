import * as firebase from 'firebase';

const firebaseConfig = {
    apiKey: 'AIzaSyAStchdIpX5C_wOElXUtg0PGsPG9JHx5IM',
    authDomain: 'crypto-currencies-ai.firebaseapp.com',
    databaseURL: 'https://crypto-currencies-ai.firebaseio.com',
    projectId: 'crypto-currencies-ai',
    storageBucket: 'crypto-currencies-ai.appspot.com',
    messagingSenderId: '364782928285',
    appId: '1:364782928285:web:c6b74a512928dcdc',
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();
messaging.usePublicVapidKey('BOX1uR6f54au3dbb8rpYkP25wFkO8oH9vcr_3PGekTQiuMD3JSfdONLy0-1lLQIM0p2NafPLRPf6o4NiXXNMNVA');


// https://stackoverflow.com/questions/5916900/how-can-you-detect-the-version-of-a-browser
navigator.sayswho = (function () {
    let ua = navigator.userAgent, tem,
        M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    if (/trident/i.test(M[1])) {
        tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
        return 'IE ' + (tem[1] || '');
    }
    if (M[1] === 'Chrome') {
        tem = ua.match(/\b(OPR|Edge)\/(\d+)/);
        if (tem != null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
    }
    M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
    if ((tem = ua.match(/version\/(\d+)/i)) != null) M.splice(1, 1, tem[1]);
    return M.join(' ');
})();

const getFcmToken = async () => {
    return Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
            console.log('Notification permission granted.');
            return messaging.getToken().then((currentToken) => {
                if (currentToken) {
                    return currentToken
                }

                console.log('No Instance ID token available. Request permission to generate one.');
                return ''
            }).catch((err) => {
                console.log('An error occurred while retrieving token. ', err);
                return ''
            });
        } else {
            console.log('Unable to get permission to notify.');
            return ''
        }
    });
}

const getDeviceInfo = async () => {
    const deviceInfo = {
        name: navigator.sayswho,
        type: 'browser',
        fcmToken: await getFcmToken(),
        macAddress: '',
        ipAddress: '',
        lastLoginTime: Date.now(),
        lastGeo: '',
    }
    return deviceInfo
}

export default getDeviceInfo