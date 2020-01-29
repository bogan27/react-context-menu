import React from 'react';
import PropTypes from 'prop-types';

import MenuItem from './@components/MenuItem';

export default class ContextMenu extends React.PureComponent {
  static activeMenuID;

  constructor(props) {
    super(props);
    this.getItems = this.getItems.bind(this);
    this.openContextMenu = this.openContextMenu.bind(this);
    this.closeContextMenu = this.closeContextMenu.bind(this);
  }

  componentDidMount() {
    const { contextId } = this.props;
    const context = document.getElementById(contextId);
    context.addEventListener('contextmenu', (event) => {
      this.openContextMenu(event);
    });

    document.addEventListener('click', (event) => {
      const { closeOnClick } = this.props;
      if (closeOnClick) {
        event.preventDefault();
        this.closeContextMenu();
      }
    });
  }

  openContextMenu(event) {
    event.preventDefault();
    this.closeContextMenu();

    const xOffset = Math.max(
      document.documentElement.scrollLeft,
      document.body.scrollLeft,
    );
    const yOffset = Math.max(
      document.documentElement.scrollTop,
      document.body.scrollTop,
    );

    const id = `${event.currentTarget.id}-menu`;
    const menu = document.getElementById(id);

    menu.style.cssText +=
      'left: inherit;' + 'top: inherit;' + 'visibility: visible;';

    menu.addEventListener('mouseleave', () => {
      const { closeOnClickOut } = this.props;
      if (!closeOnClickOut) {
        this.closeContextMenu();
      }
    });

    ContextMenu.activeMenuID = id;
  }

  closeContextMenu() {
    if (ContextMenu.activeMenuID && ContextMenu.activeMenuID.length > 0) {
      const menu = document.getElementById(ContextMenu.activeMenuID);
      menu.style.cssText += 'visibility: hidden;';
    }
    ContextMenu.activeMenuID = null;
  }

  getItems() {
    const { items, closeOnClick } = this.props;
    if (closeOnClick) {
      return items.map((item) => ({
        ...item,
        onClick: () => {
          this.closeContextMenu();
          item.onClick();
        },
      }));
    } else {
      return items;
    }
  }

  render() {
    const { contextId } = this.props;
    const menuId = `${contextId}-menu`;
    return (
      <div
        id={menuId}
        className="context-menu-container"
        style={{
          position: 'absolute',
          display: 'flex',
          flexFlow: 'column',
          border: '1px solid rgba(0,0,0,0.15)',
          borderRadius: '2px',
          boxShadow: '0 1px 1px 1px rgba(0,0,0,0.05)',
          padding: '10px 15px',
          background: '#f8f8f8',
          visibility: 'hidden',
        }}
      >
        {this.getItems().map((item) => (
          <MenuItem
            className="context-menu-item"
            item={item}
            key={item.label}
          />
        ))}
      </div>
    );
  }
}

ContextMenu.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      onClick: PropTypes.func.isRequired,
      icon: PropTypes.string,
    }),
  ),
  contextId: PropTypes.string.isRequired,
  closeOnClick: PropTypes.bool,
  closeOnClickOut: PropTypes.bool,
};

ContextMenu.defaultProps = {
  items: [],
  closeOnClick: false,
  closeOnClickOut: false,
};
