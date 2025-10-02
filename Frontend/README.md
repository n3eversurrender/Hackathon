# Frontend - Angular + Tailwind CSS + DaisyUI

Modern frontend application built with Angular, styled with Tailwind CSS and DaisyUI components.

## Tech Stack

- **Angular** (v20+) - Modern web framework
- **Tailwind CSS** (v3) - Utility-first CSS framework
- **DaisyUI** - Tailwind CSS component library
- **PostCSS** & **Autoprefixer** - CSS processing

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn

## Installation

```bash
# Install dependencies
npm install
```

## Development

```bash
# Start development server
npm start

# or
ng serve
```

Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Build

```bash
# Build for production
npm run build

# or
ng build
```

The build artifacts will be stored in the `dist/` directory.

## Project Structure

```
Frontend/
├── src/
│   ├── app/              # Application components
│   ├── styles.css        # Global styles with Tailwind directives
│   └── index.html        # Main HTML file
├── tailwind.config.js    # Tailwind CSS configuration
└── angular.json          # Angular CLI configuration
```

## Tailwind CSS + DaisyUI

This project uses Tailwind CSS for utility classes and DaisyUI for pre-built components.

### Available DaisyUI Themes
- light
- dark
- cupcake

You can change themes in `tailwind.config.js`.

### Useful Resources
- [Angular Documentation](https://angular.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [DaisyUI Documentation](https://daisyui.com)

## Additional Commands

```bash
# Run unit tests
npm test

# Run end-to-end tests
npm run e2e

# Lint the code
npm run lint
```

## License

MIT
