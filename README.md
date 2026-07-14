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
- `users/{uid}/exercises/{exerciseId}`: exercise definitions, default slugs, and tags
- `users/{uid}/logs/{logId}`: workout logs
- `users/{uid}/measurements/{measurementId}`: body weight and circumference logs
- `globalExercises/{slug}`: approved shared exercises that sync to every user
- `exerciseSuggestions/{suggestionId}`: user-submitted exercises waiting for review
- `admins/{uid}`: admin marker documents for review/export access

This keeps future features isolated. For example, body measurements can later be
added as `users/{uid}/measurements/{measurementId}` without changing or deleting
existing exercise and log data.

Default exercises live in `default-exercises.js`. They use stable `slug` values
and are synced into each user's account at login if missing. Tags are stored as
arrays, so exercises can support future filtering such as `legs`, `upper body`,
or `push` without changing log records.

## Shared exercise review

When a user adds a custom exercise, the app also creates an
`exerciseSuggestions` document. Admin users can approve suggestions from the
Exercises tab. Approved suggestions are saved to `globalExercises` and sync into
everyone's personal exercise list on login.

To make yourself an admin:

1. Sign in to the app once.
2. In Firebase Authentication, copy your user UID.
3. In Firestore, create a document at `admins/{yourUid}`. It can contain any
   simple field, for example `role: "admin"`.
4. Publish the latest `firestore.rules`.

The admin export button downloads the approved shared catalog as CSV with
`slug`, `name`, `type`, `unit`, `tags`, and `aliases` columns.
