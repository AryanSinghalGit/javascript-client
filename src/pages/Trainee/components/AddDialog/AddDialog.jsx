import React from 'react';
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  InputAdornment,
} from '@material-ui/core';
import EmailIcon from '@material-ui/icons/Email';
import PersonIcon from '@material-ui/icons/Person';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import Grid from '@material-ui/core/Grid';
import { DIALOG_SCHEMA } from '../../../../configs/constants';

export class AddDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      nameError: '',
      emailError: '',
      passwordError: '',
      confirmPasswordError: '',
    };
  }

  hasErrors = () => {
    const {
      name, email, password, confirmPassword, nameError,
      emailError, passwordError, confirmPasswordError,
    } = this.state;
    return (!(name && email && password && confirmPassword)
      || (nameError || emailError || passwordError || confirmPasswordError));
  }

  getError = async (label, labelValue) => {
    const key = `${[label]}Error`;
    try {
      await DIALOG_SCHEMA.validateAt(label, { [label]: labelValue });
      return { [key]: '' };
    } catch (error) {
      return { [key]: error.errors };
    }
  }

  isDisabled = () => !!(this.hasErrors())

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleSubmit = () => {
    this.setState({ open: false });
    const { name, email, password } = this.state;
    console.log({ name, email, password });
  };

  handleNameChange = (event) => {
    const { value } = event.target;
    this.getError('name', value)
      .then((state) => this.setState({ ...state, name: value }))
      .catch((stateError) => (
        this.setState({ ...stateError, name: value })
      ));
  }

  handleEmailChange = (event) => {
    const { value } = event.target;
    this.getError('email', value)
      .then((state) => this.setState({ ...state, email: value }))
      .catch((stateError) => (
        this.setState({ ...stateError, email: value })
      ));
  }

  handlePasswordChange = (event) => {
    const { value } = event.target;
    this.getError('password', value)
      .then((state) => this.setState({ ...state, password: value }))
      .catch((stateError) => (
        this.setState({ ...stateError, password: value })
      ));
  }

  handleConfirmPasswordChange = (event) => {
    const { password } = this.state;
    const { value } = event.target;
    DIALOG_SCHEMA.validateAt('confirmPassword', { confirmPassword: value }, { context: { password } })
      .then(() => this.setState({ confirmPasswordError: '', confirmPassword: value }))
      .catch((err) => {
        this.setState({
          confirmPasswordError: err.errors,
          confirmPassword: value,
        });
      });
  }

  render() {
    console.log(this.state);
    const {
      open, nameError, emailError, passwordError, confirmPasswordError,
    } = this.state;
    return (
      <div>
        <Button variant="outlined" color="primary" onClick={this.handleClickOpen}>
          ADD TRAINEE
        </Button>
        <Dialog fullWidth open={open} onClose={this.handleClose} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">ADD TRAINEE</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Enter Your Trainee Details
            </DialogContentText>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  id="name"
                  label="Name"
                  helperText={nameError}
                  error={!!(nameError)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon />
                      </InputAdornment>
                    ),
                  }}
                  variant="outlined"
                  onChange={this.handleNameChange}
                  onBlur={this.handleNameChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  helperText={emailError}
                  error={!!(emailError)}
                  id="email"
                  label="Email Address"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon />
                      </InputAdornment>
                    ),
                  }}
                  variant="outlined"
                  onChange={this.handleEmailChange}
                  onBlur={this.handleEmailChange}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  helperText={passwordError}
                  error={!!(passwordError)}
                  id="password"
                  label="Password"
                  type="password"
                  autoComplete="current-password"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <VisibilityOffIcon />
                      </InputAdornment>
                    ),
                  }}
                  variant="outlined"
                  onChange={this.handlePasswordChange}
                  onBlur={this.handlePasswordChange}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  helperText={confirmPasswordError}
                  error={!!(confirmPasswordError)}
                  id="confirm-password"
                  label="Confirm Password"
                  type="password"
                  autoComplete="current-password"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <VisibilityOffIcon />
                      </InputAdornment>
                    ),
                  }}
                  variant="outlined"
                  onChange={this.handleConfirmPasswordChange}
                  onBlur={this.handleConfirmPasswordChange}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              CANCEL
            </Button>
            <Button onClick={this.handleSubmit} color="primary" disabled={this.isDisabled()}>
              SUBMIT
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}
