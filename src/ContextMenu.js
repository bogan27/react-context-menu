import React from 'react';
import PropTypes from 'prop-types';

import MenuItem from './@components/MenuItem';

export default class ContextMenu extends React.PureComponent {
  constructor(props) {
    super(props);
    this.getItems = this.getItems.bind(this);
    this.openContextMenu = this.openContextMenu.bind(this);
    this.closeContextMenu = this.closeContextMenu.bind(this);

    this.state = {
      target: '',
      activeMenuID: '',
    };
  }

  componentDidMount() {
    const { contextId } = this.props;
    const context = document.getElementById(contextId);
    context.addEventListener('contextmenu', (event) => {
      this.openContextMenu(event);
    });
    const id = `${event.currentTarget.id}-menu`;
    const menu = document.getElementById(id);

    menu.style.cssText =
      menu.style.cssText +
      'left: inherit;' +
      'top: inherit;' +
      'visibility: visible;';

    menu.addEventListener('mouseleave', () => {
      const { closeOnClickOut } = this.props;
      if (!closeOnClickOut) {
        this.closeContextMenu();
      }
    });

    document.addEventListener('click', (event) => {
      const { closeOnClickOut } = this.props;

      if (closeOnClickOut && !menu.contains(event.target)) {
        event.preventDefault();
        this.closeContextMenu();
      }
    });
    this.setState({ activeMenuID: id });
  }

  openContextMenu(event) {
    event.preventDefault();
    this.setState({ target: event.target });

    const xOffset = Math.max(document.documentElement.scrollLeft, document.body.scrollLeft);
    const yOffset = Math.max(document.documentElement.scrollTop, document.body.scrollTop);

  closeContextMenu(callBack) {
    const { activeMenuID } = this.state;
    if (activeMenuID && activeMenuID.length > 0) {
      const menu = document.getElementById(activeMenuID);
      menu.style.cssText = menu.style.cssText + 'visibility: hidden;';
    }
    this.setState({ activeMenuID: '' }, () => {
      if (callBack) {
        callBack();
      }
    });
  }

  getItems() {
    const { items, closeOnClick } = this.props;
    if (closeOnClick) {
      return items.map(item => ({
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
  items: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    icon: PropTypes.string,
  })),
  contextId: PropTypes.string.isRequired,
  closeOnClick: PropTypes.bool,
};

ContextMenu.defaultProps = {
  items: [],
  closeOnClick: false,
};
