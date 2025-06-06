# NOC List

```
    _   ______  ______   __    _      __ 
   / | / / __ \/ ____/  / /   (_)____/ /_
  /  |/ / / / / /      / /   / / ___/ __/
 / /|  / /_/ / /___   / /___/ (__  ) /_  
/_/ |_/\____/\____/  /_____/_/____/\__/  
                                         
```

This project is a minimal React + Electron application for managing contacts and email groups.

## Development

Install dependencies and start the app:

```bash
npm install
npm start
```

## Running Tests

Vitest is used for unit testing. To run the test suite:

```bash
npm test
```

## Packaging

Build the React frontend and package the Electron app into a Windows executable:

```bash
npm run package
```

The generated `release/NOCList-win32-x64` folder will contain `NOCList.exe`. Place
`groups.xlsx` and `contacts.xlsx` next to the executable so the application can
load them at runtime.

## Continuous Integration

A GitHub Actions workflow builds the Windows package on each push to `main`.
The resulting `release/NOCList-win32-x64` folder is uploaded as a workflow artifact.

