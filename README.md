# Eventio

Eventio is a mobile application built with **React Native** and **Expo**. It allows users to create and manage events, providing features such as event creation, date/time pickers, and attendee management.

## Project Structure

The project follows a typical **Expo + React Native** structure, with the addition of TypeScript for type safety.

- **src/**: Contains the main source code for the app.
- **assets/**: Static assets such as images or icons.
- **components/**: Reusable UI components.
- **context/**: Custom React Contexts for managing global state (e.g., event data, modal visibility).
- **hooks/**: Custom React hooks that encapsulate logic for interacting with the application state and external services.
- **navigation/**: Where the application's routing and navigation logic is centralized.
- **screens/**: Different screens of the application (e.g., login, home, profile).
- **services/**: Core logic for interacting with API services.
- **storage/**: Logic to storage sensitive data.
- **utils/**: Centralized colors and string literals for the application.

## Setup

Run the following commands in the project directory

```bash
yarn install
```

To run the Expo project in development mode:

```bash
yarn start
```

To run just the android project in development mode:

```bash
yarn android
```

To run just the iOS project in development mode:

```bash
yarn ios
```

## Usage of ESLint and Prettier

ESLint is a static code analysis tool used to identify and fix problems in JavaScript and TypeScript code, ensuring consistent coding styles and catching potential errors.

Prettier is an automatic code formatter that ensures code is styled consistently by formatting code according to predefined rules, making it easier to read and maintain. Together, they help improve code quality and maintainability.

Highlight what needs to be changed:

```bash
yarn lint
```

Run automatic fixes:

```bash
yarn lint:fix
```

Fix format:

```bash
yarn prettier
```

## Environment Variables

The project uses `react-native-dotenv` to manage environment variables. Make sure to create a .env file at the root of the project with any necessary environment-specific configurations, such as API keys or URLs.

Use `.env.sample` file as a reference:

```bash
API_KEY=API_KEY
API_URL=API_URL
```

## Next Steps

So far, the implemented features are `Login`, `Event List Dashboard` and `Create Event modal`. I added to the navigation placeholders for `Sign Up`, `Profile` (where the logout button is in case you need it) and `Event Details` screens to make it easier to continue the project.

Please have in mind that the Screens in `AppNavigator.tsx` are divided into an authenticated and an unauthenticated flow for better security management of the screens.

There are still a few items remaining to be completed, that unfortunately, I wasn't able to address this sprint but I think they are necessary:

- Create a **/utils/Fonts.ts** file to centralize font styles.
- Add the app icon and splash screen to the app.
- I used icons from the `@expo/vector-icons` to simplify the development but they need to be replaced by the ones on the Figma file, specially the ones on the toggle button that are quite different.
- Change the loading spin component.
- I am aware that there are some designs specifications that needs to be adjusted in the implementation and I am planning to do it in the next iteration.
- Create a generic `EventModal` component.
- Create separated components for `FilterButtons` and `EventCard`.
- Implement the `Error Page` design and handle retries.
- Implement the `Sign Up`, `Profile` and `Event Details` features.
- Fix Maestro test and create new tests
- I also noticed a little bug about how a new event or the event that changes attendees is not ordered correctly by date.

### Aditional Notes

- I am not showing the `JOIN` button when it is a past event so it doesn't make a bad request to the API, feel free to change it if you have a better solution for that case.
