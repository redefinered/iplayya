# iplayya

## Run The Project

### On iOS Simulator

1. `yarn install`
2. `yarn ios`

### On Physical Device (iOS)

Set `ios:device` key in scripts field in package.json.

Example:

```json
{
  "scripts": {
    "ios:device": "npx react-native run-ios --device 'John’s iPhone SE'"
  }
}
```

Remember to change `--device` flag with the name of your device.

Finally, run `yarn ios:device`.
