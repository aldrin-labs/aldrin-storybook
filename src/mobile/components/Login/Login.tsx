// import * as React from 'react';
// import { Component } from 'react';
// import {
//     Alert,
//     AppRegistry,
//     Button,
//     Platform,
//     StyleSheet,
//     Text,
//     View
// } from '
// react-native';
// // import Auth0 from 'react-native-auth0';
//
// var credentials = { domain: 'ccai.auth0.com', clientId: 'SQvJyjGhN85p4Fo0G1LfMcc23h3kpapN' };
// const auth0 = new Auth0({ domain: 'ccai.auth0.com', clientId: 'SQvJyjGhN85p4Fo0G1LfMcc23h3kpapN' });
//
// export default class extends Component {
//     constructor(props) {
//         super(props);
//         this.state = { accessToken: null };
//     }
//
//     _onLogin = () => {
//         console.log('_onLogin');
//         auth0
//             .webAuth
//             .authorize({ scope: 'openid email', audience: 'https://ccai.auth0.com/userinfo' })
//             .then(credentials => {
//                 console.log(credentials);
//                 this.setState({ accessToken: credentials.accessToken });
//             })
//             .catch(error => console.log(error));
//     };
//
//     _onLogout = () => {
//         if (Platform.OS === 'android') {
//             this.setState({ accessToken: null });
//         } else {
//             auth0.webAuth
//                 .clearSession({})
//                 .then(success => {
//                     this.setState({ accessToken: null });
//                 })
//                 .catch(error => console.log(error));
//         }
//     };
//
//     render() {
//         let loggedIn = this.state.accessToken === null ? false : true;
//         return (
//             <View style={styles.container}>
//                 <Text style={styles.header}>Auth0Sample - Login</Text>
//                 <Text>
//                     You are {loggedIn ? '' : 'not '}logged in.
//         </Text>
//                 <Button
//                     onPress={loggedIn ? this._onLogout : this._onLogin}
//                     title={loggedIn ? 'Log Out' : 'Log In'}
//                 />
//             </View>
//         );
//     }
// }
//
// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         backgroundColor: '#F5FCFF'
//     },
//     header: {
//         fontSize: 20,
//         textAlign: 'center',
//         margin: 10
//     }
// });
