// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: "AIzaSyBMChoVrmq48xoSnLwVhgX3ZIZQkHustHw",
    authDomain: "bimbackend.firebaseapp.com",
    databaseURL: "https://bimbackend.firebaseio.com",
    projectId: "bimbackend",
    storageBucket: "bimbackend.appspot.com",
    messagingSenderId: "315609333100"
  },
  stripeKey: 'pk_test_XopyJS2ntwqB3j7bd6mzHRSn',
  apiUrl: 'https://us-central1-bimbackend.cloudfunctions.net/'
  // apiUrl: 'http://localhost:5001/bimbackend/us-central1/'
};
