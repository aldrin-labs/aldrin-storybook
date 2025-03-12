# Aldrin Storybook Component Library

## Overview

Aldrin Storybook is a comprehensive UI component library for the Aldrin decentralized exchange (DEX) platform on Solana. This library serves as a centralized repository of reusable UI components and compositions that can be used across Aldrin's web and mobile applications.

The library uses Storybook to showcase and document components, allowing developers to:
- Browse available components
- View component variations and states
- Understand component usage and API
- Test components in isolation

## Project Structure

```
aldrin-storybook/
├── src/                      # Source code
│   ├── web/                  # Web components
│   │   ├── components/       # Basic UI components
│   │   ├── compositions/     # Higher-level component compositions
│   │   ├── hooks/            # React hooks
│   │   ├── hoc/              # Higher-order components
│   │   ├── utils/            # Utility functions
│   │   ├── styles/           # Styling utilities
│   │   ├── types/            # TypeScript type definitions
│   │   ├── dexUtils/         # DEX-specific utilities
│   │   ├── config/           # Configuration files
│   │   ├── AMMAudit/         # AMM audit related components
│   │   ├── images/           # Web-specific images
│   │   └── fonts/            # Web fonts
│   ├── mobile/               # Mobile components
│   │   └── stories/          # Mobile Storybook stories
│   ├── icons/                # Shared icons
│   ├── utils/                # Shared utilities
│   ├── variables/            # Shared variables (colors, sizes, etc.)
│   └── webhooks/             # Webhook-related functionality
├── .storybook/               # Storybook configuration
├── babel.config.js           # Babel configuration
├── package.json              # Project dependencies and scripts
└── index.js                  # Main entry point
```

## Component Organization

### Web Components

The web components are organized into two main categories:

1. **Basic Components**: Reusable UI elements like buttons, inputs, modals, etc.
   - Located in `src/web/components/`
   - Examples: Button, Input, Modal, Loading, TooltipCustom, etc.

2. **Compositions**: Higher-level components that combine multiple basic components to create complete features.
   - Located in `src/web/compositions/`
   - Examples: Swap, Staking, Dashboard, Chart, etc.

### Mobile Components

Mobile-specific components are located in `src/mobile/` and are primarily used for the React Native application.

## Technology Stack

- **React**: UI library
- **TypeScript**: Type-safe JavaScript
- **Storybook**: Component documentation and development environment
- **Material-UI**: UI component framework
- **Styled-components**: CSS-in-JS styling
- **Apollo**: GraphQL client
- **React Native**: Mobile app development

## Design System

The project uses a consistent design system defined in `src/variables/variables.ts`, which includes:

- **Colors**: Primary, secondary, and UI state colors
- **Typography**: Font families, sizes, and weights
- **Spacing**: Padding and margin values
- **Breakpoints**: Responsive design breakpoints
- **Border Radius**: Standard border radius values

### Color Palette

The primary color palette includes:
- Primary Blue: #0E02EC
- Success Green: #53DF11
- Error Red: #F69894
- Warning Orange: #F29C38
- Background Dark: #17181A
- Text White: #F8FAFF

## Setup and Usage

### Installation

```bash
# Clone the repository
git clone git@gitlab.com:crypto_project/frontend/storybook.git

# Install dependencies
yarn install
```

### Development

```bash
# Start Storybook development server for web
yarn storybook

# Start Storybook for mobile
yarn native-storybook

# For Windows users
yarn storybook-win
```

### Building

```bash
# Build Storybook for deployment
yarn build-storybook

# Build the component library for distribution
yarn build
```

### Using Components in Other Projects

To use this component library in other projects:

1. Add the library as a dependency:
   ```bash
   yarn add git+ssh://git@gitlab.com:crypto_project/frontend/storybook.git
   ```

2. Import components:
   ```javascript
   import { Button, Loading, TooltipCustom } from 'components';
   ```

## Component Diagrams

### Component Hierarchy

```
                    +----------------+
                    |     App        |
                    +----------------+
                            |
            +---------------+---------------+
            |                               |
    +-------v------+                +-------v------+
    |   Layouts    |                |  Features    |
    +--------------+                +--------------+
            |                               |
    +-------v------+                +-------v------+
    |  Compositions |               |  Compositions |
    +--------------+                +--------------+
            |                               |
            +---------------+---------------+
                            |
                    +-------v------+
                    | Basic Components |
                    +--------------+
```

### Component Flow Example (Swap Feature)

```
    +----------------+     +----------------+     +----------------+
    |  TokenSelector |---->|  AmountInput   |---->|  SwapButton    |
    +----------------+     +----------------+     +----------------+
            |                     |                      |
            v                     v                      v
    +----------------+     +----------------+     +----------------+
    |   TokenIcon    |     |    Input       |     |    Button      |
    +----------------+     +----------------+     +----------------+
```

## Contributing

To add a new component:

1. Create a new directory in `src/web/components/` or `src/web/compositions/`
2. Implement your component with TypeScript and styled-components
3. Create a story in the appropriate directory
4. Test your component in Storybook
5. Update the exports in the relevant index.ts file

## License

This project is proprietary and confidential. Unauthorized copying, distribution, or use is strictly prohibited.