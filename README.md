# XCard Research Lab

XCard Research Lab is an interactive credit-card rewards prototype built for the CSCE 490 Research Milestone. It explores whether React Native, Expo, TypeScript, Expo Router, and npm are suitable technologies for the StoneCap team’s planned XCard mobile application.

This is not the complete XCard product. It is an individual research prototype that tests the framework through two interactive experiences:

1. A rewards calculator that compares sample credit cards.
2. A five-round rewards challenge game that is not planned as part of the main XCard application.

## Features

### Rewards Calculator

The user can:

- Enter a merchant or purchase name.
- Enter a purchase amount.
- Select a spending category.
- Compare the rewards earned by three sample cards.
- Receive a ranked recommendation showing the best card.
- See validation feedback when the amount is missing or invalid.

The recommendation is calculated with stored reward rates:

```text
estimated reward = purchase amount × reward rate
```

### Rewards Challenge

The challenge gives the user five randomized purchase scenarios. For each scenario, the user must choose the card that earns the most rewards.

The challenge includes:

- Randomized purchase scenarios.
- Three possible card choices per round.
- Immediate correct or incorrect feedback.
- An explanation of the correct reward calculation.
- Score and correct-answer streak tracking.
- A final performance message.
- A replay option that generates a different scenario order.
- Haptic feedback on supported mobile devices.

## Screenshots
### Mobile rewards calculator

The user enters purchase information, compares the stored reward rules, and receives a ranked card recommendation. Amount cannot be $0, otherwise error message shows up.

Phone:

<img width="736" height="1600" alt="image" src="https://github.com/user-attachments/assets/94bf6bf5-2bec-444f-be30-8a4ca8b75cd8" />
<img width="736" height="1600" alt="image" src="https://github.com/user-attachments/assets/241e070c-658c-418f-9804-486b40e20aef" />

### Interactive rewards challenge
The challenge tests whether the user can identify the highest-earning card. It provides immediate feedback, tracks the score and streak, and produces a final result.

<img width="736" height="1600" alt="image" src="https://github.com/user-attachments/assets/165ce155-b574-4740-910b-6bc217f23d2f" />
<img width="736" height="1600" alt="image" src="https://github.com/user-attachments/assets/8831aff0-bf4a-43dd-b2d3-642d35b4d604" />
<img width="736" height="1600" alt="image" src="https://github.com/user-attachments/assets/9121ab56-fed3-40a8-80e8-aaf026429639" />

### Web version
The same Expo project also runs in a browser with platform-specific web navigation.

Web:

<img width="975" height="576" alt="image" src="https://github.com/user-attachments/assets/1bbe8a96-1ac7-4ee7-a6ee-0e9d228b8842" />
<img width="975" height="581" alt="image" src="https://github.com/user-attachments/assets/296bb088-f9d5-4083-91b0-eeec0caeb564" />

## Technology Stack

| Technology | Purpose |
| --- | --- |
| React Native | Builds the user interface with reusable cross-platform components |
| Expo | Provides the development environment, Expo Go testing, and web support |
| TypeScript | Adds static types and improves code reliability |
| Expo Router | Provides file-based navigation between the calculator and challenge |
| npm | Installs dependencies and records exact versions in `package-lock.json` |
| React Hooks | Manage form input, validation, challenge state, score, and streaks |
| Expo Haptics | Provides physical feedback for challenge answers on supported devices |

## Why This Stack Was Selected

React Native and Expo were selected because the planned XCard product is a mobile application that should support both Android and iOS from one codebase. TypeScript helps catch incorrect data shapes and logic errors before runtime, which is useful for financial calculations and reward rules.

Expo makes initial setup and device testing faster than configuring separate native Android and iOS projects. Expo Router also provides a structured navigation system that can scale as the application gains more screens.

The prototype confirmed that the same project can run on an iPhone through Expo Go and in a web browser. Android is also a supported React Native and Expo target, although this prototype was personally verified on iOS and web.

## Alternatives Considered

| Option | Advantages | Limitations for XCard |
| --- | --- | --- |
| React Native + Expo | One TypeScript codebase, fast development, strong mobile support, Expo Go testing | Some advanced native features may eventually require custom native code or a development build |
| Flutter | Strong cross-platform UI consistency and good performance | Requires learning Dart and would not use the team’s existing TypeScript direction |
| Native SwiftUI + Kotlin | Best access to platform-specific APIs | Requires two separate applications and more development time |
| Ionic | Familiar web technologies and rapid development | Uses a web-based rendering approach that may feel less native for a mobile-first financial application |
| Kotlin Multiplatform | Can share business logic while retaining native interfaces | More project complexity and separate UI work may still be required |

Based on this research, React Native with Expo and TypeScript is the strongest choice for the team’s available development time and cross-platform goals.

## Project Structure

```text
src/
├── app/
│   ├── _layout.tsx       # Shared application layout and navigation
│   ├── index.tsx         # Rewards calculator
│   └── explore.tsx       # Rewards challenge
├── components/
│   ├── app-tabs.tsx      # Mobile tab navigation
│   └── app-tabs.web.tsx  # Web navigation
├── constants/            # Shared theme values
└── hooks/                # Shared React hooks
```

## Running the Project

### Prerequisites

Install:

- Node.js
- npm
- Expo Go on a physical phone, if testing the mobile version

This prototype was developed using Node.js 24 and npm 11.

### Installation

Clone the repository:

```bash
git clone https://github.com/KeertanPatel-CS/XCard-research-milestone.git
cd XCard-research-milestone
```

Install the dependencies recorded in `package-lock.json`:

```bash
npm install
```

Start the Expo development server:

```bash
npx expo start
```

From the Expo terminal:

- Scan the QR code with Expo Go to test on a physical device.
- Press `w` to launch the web version.
- Press `s` if the terminal needs to switch between a development build and Expo Go.

The web version can also be started directly:

```bash
npx expo start --web
```

On Windows PowerShell systems that block the npm PowerShell script, the equivalent commands are:

```powershell
npm.cmd install
npx.cmd expo start
```

## Code Quality Checks

Run ESLint:

```bash
npx eslint .
```

Run the TypeScript compiler without generating output:

```bash
npx tsc --noEmit
```

Both checks should complete without errors.

## npm and Package Management

This project uses npm as its package manager.

- `package.json` lists project scripts and direct dependencies.
- `package-lock.json` records the exact dependency versions installed.
- `npm install` recreates the dependency tree on another computer.
- `npx` runs locally installed command-line tools such as Expo, ESLint, and TypeScript.
- `node_modules` is generated locally and is intentionally excluded from Git.

Keeping `package-lock.json` in version control helps teammates install consistent package versions and reduces “works on my machine” problems.

## What I Learned

Building this prototype provided practical experience with:

- Creating and running an Expo project.
- Writing React Native interfaces with TypeScript.
- Managing controlled text inputs and validation.
- Using state to update results without reloading the application.
- Implementing rule-based reward calculations.
- Sorting calculated results to produce a recommendation.
- Building a multi-round interactive game.
- Providing immediate user feedback and tracking score and streak state.
- Creating separate navigation behavior for native and web platforms.
- Using Expo Go for physical-device testing.
- Installing and inspecting packages with npm.
- Running ESLint and TypeScript checks.
- Using Git commits to record incremental development.

## Limitations and Future Work

The prototype uses local sample cards and transactions rather than real financial data. It does not include authentication, a backend, PostgreSQL, Supabase, or financial-account linking because the research focus was evaluating the client-side framework and package-management workflow.

A production XCard application would need:

- Secure authentication and protected sessions.
- A Node.js and Express API.
- PostgreSQL hosted through Supabase.
- Secure, tokenized transaction connections.
- Persistent card and transaction storage.
- Automated tests for reward calculations.
- Accessibility testing across supported devices.
- Additional Android and iOS device testing.

## Research Conclusion

React Native, Expo, TypeScript, Expo Router, and npm successfully supported a prototype with user input, validation, calculations, navigation, randomized interactions, device feedback, and dynamic results. The experiment supports using this stack for the XCard team project while recognizing that advanced native integrations may later require Expo development builds or custom native configuration.

## Author
Keertan Patel  
CSCE 490 Research Milestone
