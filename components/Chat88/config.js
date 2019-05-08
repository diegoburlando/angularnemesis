import * as firebase from "firebase";
let database = {};
let storage = {};
let messaging = {};
let config = {
	apiKey: "AIzaSyAkibmD7a76vwEYf0IXPsvAd2_ytYWCJUU",
	authDomain: "chatweb-187810.firebaseapp.com",
	databaseURL: "https://chatweb-187810.firebaseio.com",
	projectId: "chatweb-187810",
	storageBucket: "chatweb-187810.appspot.com",
	messagingSenderId: "898703236398"
};

firebase.initializeApp(config);
database = firebase.database();
storage = firebase.storage();
messaging = firebase.messaging();
export {database,firebase,storage, messaging};  



