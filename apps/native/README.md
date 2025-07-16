# Native App (Expo/React Native)

This is the native application for the george.barbu.es monorepo, built with Expo and React Native, maintained by George Barbu.

## Getting Started

**Requirements:**
- Node.js
- Yarn v1.22.19
- Expo CLI (install globally with `npm install -g expo-cli`)

Install dependencies from the monorepo root:
```sh
yarn
```

## Development

To start the native app in Expo web mode from the root:
```sh
yarn native:web
```

To start the native app on a device or simulator:
```sh
yarn workspace native dev
```

## Structure

- Source code: `src/`
- App entry: `src/app/`
- Screens: `src/screens/`
- Styles: `src/styles/`
- Templates: `src/templates/`

## Technologies Used

- [Expo](https://docs.expo.dev/)
- [React Native](https://reactnative.dev/)
- [NativeWind](https://www.nativewind.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [TypeScript](https://www.typescriptlang.org/)

## Author

[George Barbu](https://george.barbu.es)
