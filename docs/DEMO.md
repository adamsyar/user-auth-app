# Demonstration checklist

Use invented details, for example `user 1`, `user@test.com`, and `secret123`.
Do not use a personal password.

1. Start Metro and open the app with `npm run ios`.
2. On Login, submit empty fields and show required-field errors. Try `user@` and
   `12345` to show invalid-email and minimum-length errors.
3. Choose Go to Signup. Submit an empty form to show all three required-field errors.
4. Enter the example details. Toggle the eye button to show and hide the password.
5. Tap Signup. Home displays the user's name and email.
6. Tap Logout. Login appears and Home is no longer reachable using back navigation.
7. Try signing up again with the same email to show the duplicate-account error.
8. Return to Login. Enter the email and a wrong password to show incorrect credentials.
9. Enter `secret123` and tap Login. Home appears again.
10. Close and reopen Expo Go and open the same project. Home restores automatically.
11. Tap Logout, close and reopen again, and confirm Login appears.

After a full JavaScript reload, the in-memory account registry resets. Sign up again
if you want to repeat the credentials portion of the demo. Session restoration does
not preserve that registry.

For a recording, use Simulator's recording controls while performing this checklist.
Screenshots in `screenshots/` are captured from the actual iOS simulator, not mockups.

## Automated iOS simulator flow

`.maestro/auth.yaml` runs the actual Expo Go UI: registration errors, signup,
password visibility, logout, failed/successful login, restoration after process
restart, and logout persistence. It captures screenshots along the way.

With Metro running on port 8081 and a booted iOS simulator, install
[Maestro CLI](https://docs.maestro.dev/maestro-cli/how-to-install-maestro-cli)
and run from the repository root:

```sh
maestro test .maestro/auth.yaml
```

Begin signed out. The flow restarts Expo Go, which clears the in-memory account
registry but keeps any saved session. If you are already signed in, tap Logout
before running it. The flow finishes signed out. Maestro saves captures beneath
its reported test output directory (`auth/takeScreenshot/docs/screenshots/`).
Copy those PNGs into `docs/screenshots/` to refresh the submission images.

The automation enters passwords with visibility enabled, then hides them before
submission. This avoids the simulator runner's bulk-entry issue with secure text
fields and also exercises the visibility controls. These are disposable demo values.
