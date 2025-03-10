# Aldrin Storybook - Comprehensive Documentation

## Table of Contents

1. [Introduction](#introduction)
2. [Project Architecture](#project-architecture)
3. [Component Library Structure](#component-library-structure)
4. [Web Components](#web-components)
5. [Mobile Components](#mobile-components)
6. [Design System](#design-system)
7. [Development Workflow](#development-workflow)
8. [Integration Guide](#integration-guide)
9. [Component Diagrams](#component-diagrams)
10. [Troubleshooting](#troubleshooting)

## Introduction

Aldrin Storybook is a comprehensive UI component library designed for the Aldrin decentralized exchange (DEX) platform on the Solana blockchain. This library serves as the single source of truth for all UI components used across Aldrin's web and mobile applications.

### Purpose

- **Consistency**: Ensure consistent UI/UX across all Aldrin products
- **Reusability**: Promote component reuse to reduce development time
- **Documentation**: Provide clear documentation for all UI components
- **Testing**: Enable isolated component testing
- **Collaboration**: Facilitate collaboration between designers and developers

### Key Features

- Cross-platform support (Web and Mobile)
- TypeScript integration for type safety
- Material-UI integration with custom theming
- Styled-components for flexible styling
- Storybook for component documentation and testing

## Project Architecture

The Aldrin Storybook follows a modular architecture that separates concerns and promotes reusability:

### High-Level Architecture

```
                  +-------------------+
                  |    Applications   |
                  | (Web, Mobile, etc)|
                  +-------------------+
                           |
                           | imports
                           v
+----------------------------------------------------------+
|                    Aldrin Storybook                      |
+----------------------------------------------------------+
|                                                          |
|  +--------------+  +--------------+  +--------------+    |
|  |     Web      |  |    Mobile    |  |    Shared    |    |
|  | Components   |  | Components   |  |   Resources  |    |
|  +--------------+  +--------------+  +--------------+    |
|                                                          |
+----------------------------------------------------------+
                           |
                           | uses
                           v
                  +-------------------+
                  |   Design System   |
                  | (Colors, Spacing, |
                  |  Typography, etc) |
                  +-------------------+
```

### Technology Stack Diagram

```
+----------------------------------------------------------+
|                      React / React Native                |
+----------------------------------------------------------+
|                                                          |
|  +--------------+  +--------------+  +--------------+    |
|  |  TypeScript  |  | Material-UI  |  |   Styled-    |    |
|  |              |  |              |  |  Components  |    |
|  +--------------+  +--------------+  +--------------+    |
|                                                          |
+----------------------------------------------------------+
|                         Storybook                        |
+----------------------------------------------------------+
```

## Component Library Structure

The component library is organized into several key directories:

### Directory Structure

```
src/
├── web/                  # Web-specific components
│   ├── components/       # Basic UI components
│   ├── compositions/     # Higher-level component compositions
│   ├── hooks/            # React hooks
│   ├── hoc/              # Higher-order components
│   ├── utils/            # Utility functions
│   ├── styles/           # Styling utilities
│   ├── types/            # TypeScript type definitions
│   ├── dexUtils/         # DEX-specific utilities
│   ├── config/           # Configuration files
│   ├── AMMAudit/         # AMM audit related components
│   ├── images/           # Web-specific images
│   └── fonts/            # Web fonts
├── mobile/               # Mobile-specific components
│   └── stories/          # Mobile Storybook stories
├── icons/                # Shared icons
├── utils/                # Shared utilities
├── variables/            # Shared variables (colors, sizes, etc.)
└── webhooks/             # Webhook-related functionality
```

### Component Organization Philosophy

The library follows these organizational principles:

1. **Atomic Design Methodology**: Components are organized from atoms (basic UI elements) to molecules (combinations of atoms) to organisms (complex UI sections).

2. **Platform Separation**: Web and mobile components are separated to handle platform-specific requirements.

3. **Composition Over Inheritance**: Higher-level functionality is achieved through component composition rather than inheritance.

4. **Shared Resources**: Common resources like icons and utilities are shared across platforms.

## Web Components

The web components are the core of the Aldrin UI and are organized into two main categories:

### Basic Components

These are the fundamental building blocks of the UI:

| Component | Description | Usage |
|-----------|-------------|-------|
| Button | Standard button component with various styles | Forms, actions, navigation |
| Input | Text input field with validation | Forms, search, filters |
| Modal | Popup dialog component | Confirmations, forms, alerts |
| Loading | Loading indicator | Async operations, page loading |
| TooltipCustom | Tooltip for additional information | Help text, explanations |
| TokenIcon | Icon representation of tokens | Token lists, pair displays |
| Chart | Data visualization component | Price charts, analytics |
| Table | Data table component | Lists, data display |
| SwitchOnOff | Toggle switch | Settings, options |
| ... | ... | ... |

### Compositions

These are higher-level components that combine multiple basic components:

| Composition | Description | Components Used |
|-------------|-------------|----------------|
| Swap | Token swap interface | TokenSelector, AmountInput, Button, Loading |
| Staking | Staking interface | Table, Input, Button, TokenIcon |
| Dashboard | User dashboard | Chart, Table, TokenIcon, Loading |
| Chart | Advanced charting | Chart, Button, Loading |
| ... | ... | ... |

### Component Structure

Each component follows a consistent structure:

```
ComponentName/
├── index.ts                # Main export
├── ComponentName.tsx       # Component implementation
├── ComponentName.styles.ts # Styled-components definitions
├── ComponentName.types.ts  # TypeScript interfaces and types
└── ComponentName.stories.tsx # Storybook stories
```

## Mobile Components

Mobile components are designed for React Native and follow a similar structure to web components but with platform-specific considerations.

### Mobile-Specific Considerations

- Touch interactions instead of mouse events
- Different screen sizes and orientations
- Native platform capabilities
- Performance optimizations for mobile devices

### Mobile Component Examples

- Button (with touch feedback)
- Card (optimized for mobile layouts)
- Navigation components
- Mobile-specific inputs

## Design System

The design system provides a consistent visual language across all Aldrin products.

### Colors

The color system is defined in `src/variables/variables.ts`:

#### Primary Colors

```
COLORS = {
  primary: '#0E02EC',       // Primary blue
  success: '#53DF11',       // Success green
  error: '#F69894',         // Error red
  warning: '#F29C38',       // Warning orange
  bodyBackground: '#17181A', // Main background
  textAlt: '#F5F5FB',       // Primary text
  ...
}
```

#### Color Usage Guidelines

- Use primary colors for main actions and branding
- Use success/error/warning colors consistently for status indicators
- Maintain sufficient contrast for accessibility

### Typography

```
FONT_SIZES = {
  xs: '0.6875em',  // 11px
  sm: '0.8125em',  // 13px
  md: '1em',       // 16px
  lg: '1.6em',     // 26.6px
  xl: '2em',       // 32px
  ...
}

FONTS = {
  main: 'Prompt',
  demi: 'Prompt',
}
```

### Spacing and Layout

```
BORDER_RADIUS = {
  xs: '2px',
  sm: '4px',
  md: '8px',
  lg: '16px',
  xl: '32px',
  ...
}

BREAKPOINTS = {
  xs: '480px',
  sm: '540px',
  md: '768px',
  lg: '1024px',
  xl: '1200px',
  ...
}
```

## Development Workflow

### Setting Up the Development Environment

1. Clone the repository:
   ```bash
   git clone git@gitlab.com:crypto_project/frontend/storybook.git
   cd storybook
   ```

2. Install dependencies:
   ```bash
   yarn install
   ```

3. Start Storybook:
   ```bash
   yarn storybook
   ```

### Creating a New Component

1. Create a new directory in the appropriate location:
   ```bash
   mkdir -p src/web/components/MyComponent
   ```

2. Create the component files:
   ```bash
   touch src/web/components/MyComponent/index.ts
   touch src/web/components/MyComponent/MyComponent.tsx
   touch src/web/components/MyComponent/MyComponent.styles.ts
   touch src/web/components/MyComponent/MyComponent.types.ts
   ```

3. Implement the component:
   ```typescript
   // MyComponent.tsx
   import React from 'react'
   import { StyledMyComponent } from './MyComponent.styles'
   import { MyComponentProps } from './MyComponent.types'

   const MyComponent: React.FC<MyComponentProps> = ({ 
     children, 
     ...props 
   }) => {
     return (
       <StyledMyComponent {...props}>
         {children}
       </StyledMyComponent>
     )
   }

   export default MyComponent
   ```

4. Create the Storybook story:
   ```typescript
   // MyComponent.stories.tsx
   import React from 'react'
   import { storiesOf } from '@storybook/react'
   import MyComponent from './MyComponent'

   storiesOf('Components/MyComponent', module)
     .add('Default', () => (
       <MyComponent>Hello World</MyComponent>
     ))
     .add('With Props', () => (
       <MyComponent customProp="value">With Props</MyComponent>
     ))
   ```

5. Export the component:
   ```typescript
   // index.ts
   export { default } from './MyComponent'
   ```

6. Update the main components index:
   ```typescript
   // src/web/components/index.ts
   export { default as MyComponent } from './MyComponent'
   ```

### Testing Components

- Use Storybook for visual testing
- Write unit tests for component logic
- Test across different browsers and devices

## Integration Guide

### Using Components in Other Projects

1. Add the library as a dependency:
   ```bash
   yarn add git+ssh://git@gitlab.com:crypto_project/frontend/storybook.git
   ```

2. Import components:
   ```javascript
   import { Button, Loading, TooltipCustom } from 'components';
   ```

3. Use components in your application:
   ```jsx
   const MyApp = () => (
     <div>
       <Button onClick={() => console.log('Clicked')}>
         Click Me
       </Button>
       <Loading size={32} color="#0E02EC" />
     </div>
   );
   ```

### Best Practices

- Import only the components you need to reduce bundle size
- Follow the design system guidelines for consistency
- Use TypeScript for type safety
- Leverage the provided hooks and utilities

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

### Data Flow Diagram

```
    +----------------+          +----------------+
    |                |          |                |
    |    Props       +--------->+   Component    |
    |                |          |                |
    +----------------+          +-------+--------+
                                       |
                                       |
                               +-------v--------+
                               |                |
                               |   State        |
                               |                |
                               +-------+--------+
                                       |
                                       |
                               +-------v--------+
                               |                |
                               |   Render       |
                               |                |
                               +----------------+
```

### Swap Feature Component Interaction

```
    +----------------+     +----------------+     +----------------+
    |  TokenSelector |---->|  AmountInput   |---->|  SwapButton    |
    +----------------+     +----------------+     +----------------+
            |                     |                      |
            v                     v                      v
    +----------------+     +----------------+     +----------------+
    |   TokenIcon    |     |    Input       |     |    Button      |
    +----------------+     +----------------+     +----------------+
            |                     |                      |
            v                     v                      v
    +----------------+     +----------------+     +----------------+
    |    Tooltip     |     |  Validation    |     |   Loading      |
    +----------------+     +----------------+     +----------------+
```

### Staking Feature Component Interaction

```
    +----------------+     +----------------+     +----------------+
    |  StakingInfo   |---->|  StakeForm     |---->| StakingActions |
    +----------------+     +----------------+     +----------------+
            |                     |                      |
            v                     v                      v
    +----------------+     +----------------+     +----------------+
    |    Chart       |     |    Input       |     |    Button      |
    +----------------+     +----------------+     +----------------+
            |                     |                      |
            v                     v                      v
    +----------------+     +----------------+     +----------------+
    |   TokenIcon    |     |   Slider       |     |   Modal        |
    +----------------+     +----------------+     +----------------+
```

## Troubleshooting

### Common Issues and Solutions

#### Component Not Rendering

**Issue**: Component imported but not visible in the application.

**Solution**:
- Check if the component is properly exported from its directory
- Verify that the component is imported correctly
- Check for any CSS issues that might be hiding the component
- Ensure all required props are provided

#### Styling Inconsistencies

**Issue**: Component styling doesn't match the design system.

**Solution**:
- Ensure you're using the variables from `src/variables/variables.ts`
- Check for any overriding styles in parent components
- Verify that the theme provider is properly set up

#### TypeScript Errors

**Issue**: TypeScript compilation errors when using components.

**Solution**:
- Check that you're providing all required props
- Ensure you're using the correct types for props
- Update your TypeScript version if needed
- Check for any missing type definitions

### Getting Help

If you encounter issues not covered in this documentation:

1. Check the component's story in Storybook for usage examples
2. Review the component's source code for implementation details
3. Contact the Aldrin development team for assistance

## Conclusion

The Aldrin Storybook component library provides a comprehensive set of UI components for building consistent, high-quality user interfaces across Aldrin's web and mobile applications. By following the guidelines in this documentation, you can effectively use, extend, and contribute to the component library.