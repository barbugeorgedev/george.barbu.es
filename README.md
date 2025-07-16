# george.barbu.es

A universal monorepo for web and native apps, built and maintained by George Barbu.

## Getting Started

**Requirements:**
- Node.js
- Yarn v1.22.19

Install dependencies:
```sh
yarn
```

## Development

To start all apps in development mode:
```sh
yarn dev
```

To start the web app (Next.js):
```sh
yarn web:dev
```

To start the native app (Expo web):
```sh
yarn native:web
```

## Build

To build all apps:
```sh
yarn build
```

To build the web app:
```sh
yarn web:build
```

## Monorepo Structure

```
george.barbu.es/
  apps/
    native/   # Expo/React Native app
    web/      # Next.js web app
  packages/
    app/      # Shared logic
    assets/   # Shared assets (fonts, images)
    env/      # Environment utilities
    libs/     # Shared libraries (e.g., GraphQL)
    types/    # Shared TypeScript types
    ui/       # Shared UI components
```

## Technologies Used

- [Expo](https://docs.expo.dev/)
- [Next.js](https://nextjs.org/)
- [React Native](https://reactnative.dev/)
- [React Native Web](https://necolas.github.io/react-native-web/)
- [NativeWind](https://www.nativewind.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [Prettier](https://prettier.io)
- [Turborepo](https://turborepo.dev/)

## Author

[George Barbu](https://george.barbu.es)
