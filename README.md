This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app), using the [Dapp](https://github.com/chase-manning/cra-template-dapp) template.

## About

This app is a boilerplate template to be used for creating EVM Dapps! :tada:
It will require modification to fit the needs of your Dapp, but hopefully will serve as a good starting point to get you up and running quicker.  
An example Dapp is included for converting ETH to WETH, this is to show how you can use the boilerplate to make contract interractions.

## Get started

Before this Dapp is production ready, you will need to make a few changes!  
First, go to `src/app/globals.ts` and update the `INFURA_ID` with your own Infura ID (You can get one [here](https://infura.io/)).

### Firebase Setup

- Setup an account with [Firebase](https://firebase.google.com/)
- Create a new Project for the hosting
- Edit `.github/workflows/ci.yml` and replace `project-id` with your new Project ID from Firebase
- Edit `.firebaserc` and replace `project-id` with your new Project ID from Firebase
- Install Firebase CLI with `yarn install -g firebase-tools`
- Login to the Firebase CLI with `firebase login:ci`
- Copy the secret that is output to your console and create a GitHub secret for it as `FIREBASE_SECRET`
- Follow the steps [here](https://github.com/FirebaseExtended/action-hosting-deploy/blob/main/docs/service-account.md) to create a Firebase Service Account
- Copy the secret and create a GitHub secret for it as `FIREBASE_SERVICE_ACCOUNT`

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
