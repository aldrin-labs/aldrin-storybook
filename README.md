# StoryBook

Storybook is a components library that allows you to write a representational components and combine them into compositions of components.

You can use storybook into two different ways:
1. Import Storybook as a submodule and use components/compositions that it consist.
2. Build Storybook directly and see what the components it includes and how you can customize them.


To be able to see your own component in the list of components after building storybook, you should:
1. Write you component and place it depending for what platform you wrote it. (web/mobile)
2. Create a story in (web or mobile dir)/stories/(components or compositions dir)/
3. Build storybook using development server `yarn storybook`


## Install dependencies
```
yarn
```

## Start development server
```
yarn storyboook
```

## Build storybook
```
yarn build-storybook
```
