import React, { Component } from 'react';
import Container from '@material-ui/core/Container';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import FormDialog from './modal';
import OptionsDialog from './options';
import './tree.css';

export default class TreeItems extends Component {
  state = {
    root: {
      id: 'root',
      parentId: null,
      name: 'root',
      collapsed: true,
      childrens: [],
      args: [],
      childCounter: 0,
    },
    anchorEl: null,
    open: false,
    options: false,
    current: null,
    tab: 0,
  };

  handleClick = event => {
    this.setState({
      anchorEl: event.currentTarget,
    });
  };

  handleClose = () => {
    this.setState({
      anchorEl: null,
    });
  };

  handleOpenForm = item => {
    this.setState({
      open: true,
      current: item,
    });
  };

  handleSubmitForm = name => {
    const { current } = this.state;
    this.addItem(name, current.id);
    this.setState({
      open: false,
    });
  };

  handleCloseForm = () => {
    this.setState({
      open: false,
      options: false,
      current: null,
    });
  };

  saveItem = (id, name, args) => {
    this.changeItem(id, 'name', name);
    this.changeItem(id, 'args', args);
    this.handleCloseForm();
  };

  addItem(name, parentId) {
    this.setState(state => {
      const { root } = state;
      const child = {
        name,
        childrens: [],
        args: [],
        childCounter: 0,
        collapsed: false,
        parentId,
      };
      let parent = null;
      const callback = node => {
        if (node.id === parentId) {
          parent = node;
        }
      };
      this.traverse(callback, root);
      if (parent) {
        child.id = `${parentId}_${parent.childCounter + 1}`;
        parent.childrens.push(child);
        parent.childCounter += 1;
        parent.collapsed = true;
      } else {
        throw new Error('Cannot add node to a non-existent parent.');
      }
      return { root };
    });
  }

  changeItem(id, key, value) {
    this.setState(state => {
      const { root } = state;
      let item = null;
      const callback = node => {
        if (node.id === id) {
          item = node;
        }
      };
      this.traverse(callback, root);
      if (item) {
        item[key] = value;
      } else {
        throw new Error('Cannot change a non-existent node.');
      }
      return { root };
    });
  }

  deleteItem(id, parentId) {
    this.setState(state => {
      const { root } = state;
      let parent = null;
      const callback = node => {
        if (node.id === parentId) {
          parent = node;
        }
      };
      this.traverse(callback, root);
      if (parent) {
        const index = parent.childrens.findIndex(node => node.id === id);
        if (index !== -1) {
          parent.childrens.splice(index, 1);
        } else {
          throw new Error('Cannot delete non-existent node.');
        }
      } else {
        throw new Error('Cannot delete node to a non-existent parent.');
      }
      return { root };
    });
  }

  collapseItem(item) {
    this.changeItem(item.id, 'collapsed', !item.collapsed);
  }

  // eslint-disable-next-line class-methods-use-this
  traverse(callback, root) {
    (function recurse(currentNode) {
      for (let i = 0, { length } = currentNode.childrens; i < length; i += 1) {
        recurse(currentNode.childrens[i]);
      }
      callback(currentNode);
    })(root);
  }

  renderItem(item) {
    const { anchorEl } = this.state;
    return (
      <li key={item.id}>
        <div>
          <IconButton
            aria-label="collapse"
            size="small"
            onClick={() => {
              this.collapseItem(item);
            }}
            className={item.collapsed ? 'rotate active' : 'rotate'}
          >
            <ArrowDownwardIcon fontSize="inherit" />
          </IconButton>
          <Button
            className="name"
            onClick={() => {
              this.setState({
                current: item,
                options: true,
              });
            }}
          >
            {item.name}
          </Button>
          <IconButton
            aria-label="more"
            aria-controls={`${item.id}__long-menu`}
            aria-haspopup="true"
            onClick={this.handleClick}
            size="small"
          >
            <MoreVertIcon />
          </IconButton>
          <Menu
            id={`${item.id}__long-menu`}
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(
              anchorEl &&
                anchorEl.getAttribute('aria-controls') ===
                  `${item.id}__long-menu`,
            )}
            onClose={this.handleClose}
            PaperProps={{
              style: {
                maxHeight: 48 * 4.5,
              },
            }}
          >
            <MenuItem
              onClick={() => {
                this.handleOpenForm(item);
                this.handleClose();
              }}
            >
              Добавить элемент
            </MenuItem>
            <MenuItem
              onClick={() => {
                this.addItem('Custom name', item.id);
              }}
            >
              Добавить элемент (быстро)
            </MenuItem>
            <MenuItem
              onClick={() => {
                this.setState({
                  options: true,
                });
                this.handleClose();
              }}
            >
              Редактировать элемент
            </MenuItem>
            <MenuItem
              onClick={() => {
                this.deleteItem(item.id, item.parentId);
                this.handleClose();
              }}
            >
              Удалить
            </MenuItem>
          </Menu>
        </div>
        {item.collapsed && item.childrens.length > 0 && (
          <ul className="list">
            {item.childrens.map(child => this.renderItem(child))}
          </ul>
        )}
      </li>
    );
  }

  render() {
    const { root, open, tab, options, current } = this.state;
    return (
      <div>
        <AppBar position="static">
          <Tabs
            value={tab}
            onChange={(event, value) => {
              this.setState({ tab: value });
            }}
            aria-label="simple tabs example"
          >
            <Tab
              label="Дерево"
              id="full-width-tab-0"
              aria-controls="full-width-tabpanel-0"
            />
            <Tab
              label="JSON"
              id="full-width-tab-1"
              aria-controls="full-width-tabpanel-1"
            />
          </Tabs>
        </AppBar>
        {tab === 0 && (
          <Container>
            <ul className="list">{this.renderItem(root)}</ul>
          </Container>
        )}
        {tab === 1 && (
          <Container>
            <div className="json">{JSON.stringify(root, null, 4)}</div>
          </Container>
        )}
        <FormDialog
          open={open}
          handleClose={this.handleCloseForm}
          handleSubmit={this.handleSubmitForm}
        />
        <OptionsDialog
          open={options}
          handleClose={this.handleCloseForm}
          handleSubmit={this.saveItem}
          item={current}
        />
      </div>
    );
  }
}
