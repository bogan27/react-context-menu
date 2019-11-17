# react-context-menu

A lightweight right-click context menu implemented in React.

![example right-click menu](react-context-menu.png?raw=true "example right-click menu")

To use:

Install the component in your project:

```
npm install react-context-menu --save
```

or, if using yarn:

```
yarn add --dev react-context-menu
```

Import the component into your project:

```javascript
import ContextMenu from 'react-context-menu';
```

Pass a `contextId`, and an array of menu items with labels, `onClick`
functions, and optional icon paths -- like so:

```jsx
<ContextMenu
  contextId={'clickable-area'}
  items={[
    {
      label: 'Configure',
      onClick: this.configHandler,
      icon: 'path/to/icon.svg'
    },
    {
      label: 'Delete',
      onClick: this.deleteHandler
    }
  ]} />
```

The ```contextId``` is the area in which you'd like right-click functionality.
Add a unique `id` to your right-clickable element, and react-context-menu will
be available anywhere within that element.

Pass `closeOnClick` (boolean defaulted to `false`) to ```ContextMenu``` to close
the menu upon item click.

Pass `closeOnClickOut` (boolean defaulted to `false`) to `ContextMenu` to close
the menu upon clicking outside of the menu (versus the default, which will close
the menu when the mouse moves outside of the menu boundary).
