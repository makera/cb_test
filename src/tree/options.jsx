import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import DelteIcon from '@material-ui/icons/Delete';

export default function OptionsDialog(props) {
  const { open, handleClose, handleSubmit, item } = props;
  const [args, setArgs] = useState((item || {}).args || []);
  const [name, setName] = useState((item || {}).name || '');

  useEffect(() => {
    setName((item || {}).name || '');
  }, [item]);

  useEffect(() => {
    setArgs((item || {}).args || []);
  }, [item]);

  return (
    <Dialog
      open={open}
      onClose={() => {
        handleClose();
      }}
      aria-labelledby="options-dialog-title"
    >
      <DialogTitle id="options-dialog-title">Редактировать</DialogTitle>
      <DialogContent>
        <DialogContentText>Редактирование имени и параметров</DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="Имя"
          type="text"
          fullWidth
          value={name}
          onChange={event => {
            setName(event.target.value);
          }}
        />
        <Grid
          container
          spacing={3}
          alignItems="flex-end"
          justify="space-between"
        >
          {args.map((arg, index) => (
            <>
              <Grid item xs={5}>
                <TextField
                  margin="dense"
                  id={`arg${index}name`}
                  label="Имя"
                  type="text"
                  fullWidth
                  value={arg.name}
                  onChange={event => {
                    const newArgs = [...args];
                    newArgs[index] = {
                      value: newArgs[index].value,
                      name: event.target.value,
                    };
                    setArgs(newArgs);
                  }}
                />
              </Grid>
              <Grid item xs={5}>
                <TextField
                  margin="dense"
                  id={`arg${index}value`}
                  label="Значение"
                  type="text"
                  fullWidth
                  value={arg.value}
                  onChange={event => {
                    const newArgs = [...args];
                    newArgs[index] = {
                      name: newArgs[index].name,
                      value: event.target.value,
                    };
                    setArgs(newArgs);
                  }}
                />
              </Grid>
              <Grid item xs={1}>
                <IconButton
                  size="small"
                  onClick={() => {
                    const newArgs = [...args];
                    newArgs.splice(index, 1);
                    setArgs(newArgs);
                  }}
                >
                  <DelteIcon />
                </IconButton>
              </Grid>
            </>
          ))}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            setArgs([...args, { name: '', value: '' }]);
          }}
          color="primary"
        >
          Добавить параметр
        </Button>
        <Button
          onClick={() => {
            handleClose();
          }}
          color="primary"
        >
          Закрыть
        </Button>
        <Button
          onClick={() => {
            handleSubmit(item.id, name, args);
          }}
          color="primary"
        >
          Сохранить
        </Button>
      </DialogActions>
    </Dialog>
  );
}

OptionsDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  item: PropTypes.object,
  handleClose: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
};

OptionsDialog.defaultProps = {
  item: {},
};
