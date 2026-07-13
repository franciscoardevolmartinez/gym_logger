# gym_logger
Simple app to log gym progress

## Firebase setup

This app stores each user's exercises and logs in Firebase Firestore under their
own authenticated user ID.

1. Create a Firebase project at https://console.firebase.google.com/.
2. Add a Web app to the project.
3. Copy the generated Firebase config into `firebase-config.js`.
4. In Authentication, enable the Google sign-in provider.
5. In Firestore Database, create a database.
6. Paste the rules from `firestore.rules` into the Firestore Rules tab and publish them.

Data is stored as:

- `users/{uid}`: profile and schema metadata
- `users/{uid}/exercises/{exerciseId}`: exercise definitions
- `users/{uid}/logs/{logId}`: workout logs

This keeps future features isolated. For example, body measurements can later be
added as `users/{uid}/measurements/{measurementId}` without changing or deleting
existing exercise and log data.
