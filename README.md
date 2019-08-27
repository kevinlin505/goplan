## GoPlan

#### To Start:

- first time run `$ yarn && yarn start` or `$ npm && npm start` in commnad line. Otherwise just run `yarn start` or `npm start` to start the app.
- The app is running on a `webpack-dev-server` on `localhost:3000`
- Currently, the `Keys.js` under the `constants/` directory is missing, you will have to create a `Keys.js` file and paste the `Keys` object containing the `FIREBASE` object in order to connect to the firebase.


#### Functions:

1. You must have the Firebase CLI installed. If you don't have it install it with npm install -g firebase-tools and then configure it with firebase login.

2. Configure the CLI locally by using firebase use --add and select your project in the list.

3. Install Cloud Functions dependencies locally by running: cd functions; npm install; cd -

4. To be able to send emails with your Gmail account: enable access to Less Secure Apps and Display Unlock Captcha. For accounts with 2-step verification enabled Generate an App Password.

5. Set the gmail.email and gmail.password Google Cloud environment variables to match the email and password of the Gmail account used to send emails (or the app password if your account has 2-step verification enabled). For this use:

firebase functions:config:set gmail.email="myusername@gmail.com" gmail.password="secretpassword"

#### Functions Deployment:

Two projects are available: 
prod (goplan-40acb)
dev (goplan-3b4b1)

1. Choose firebase project: firebase use prod (or dev)
2. Add environment config to the project: firebase functions:config:set app.environment="prod" (or dev)
3. Repeat steps 1-2 for the dev project
4. Run this to deploy: firebase deploy --only functions:uploadReceipt