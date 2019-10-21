import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default class FormDialog extends Component {
  state = {
    name: '',
  };

  handleChange = event => {
    this.setState({ name: event.target.value });
  };

  render() {
    const { open, handleClose, handleSubmit } = this.props;
    const { name } = this.state;
    return (
      <Dialog
        open={open}
        onClose={() => {
          this.setState({ name: '' });
          handleClose();
        }}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Добавить элемент</DialogTitle>
        <DialogContent>
          <DialogContentText>Введите имя нового элемента</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Имя"
            type="text"
            fullWidth
            value={name}
            onChange={this.handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              this.setState({ name: '' });
              handleClose();
            }}
            color="primary"
          >
            Закрыть
          </Button>
          <Button
            onClick={() => {
              this.setState({ name: '' });
              handleSubmit(name);
            }}
            color="primary"
          >
            Добавить
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

FormDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
};
