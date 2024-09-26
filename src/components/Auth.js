import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  TextField, 
  Button, 
  Box, 
  Typography, 
  Switch, 
  FormControlLabel,
  IconButton,
  InputAdornment,
  Alert
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { login, register } from '../features/authSlice';

const Auth = ({ open, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [generalError, setGeneralError] = useState('');

  const dispatch = useDispatch();

  const resetForm = () => {
    setUsername('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setDisplayName('');
    setIsLogin(true);
    setShowPassword(false);
    setShowConfirmPassword(false);
    setPasswordError('');
    setEmailError('');
    setGeneralError('');
  };

  useEffect(() => {
    if (!open) {
      resetForm();
    }
  }, [open]);

  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError('');
    if (isLogin) {
      try {
        await dispatch(login({ email, password })).unwrap();
        onClose();
      } catch (error) {
        setGeneralError(error.message || 'An error occurred during login');
      }
    } else {
      if (password !== confirmPassword) {
        setPasswordError("Passwords don't match");
        return;
      }
      try {
        await dispatch(register({ username, email, password, displayName })).unwrap();
        onClose();
      } catch (error) {
        if (error.message === 'email already exists') {
          setEmailError('This email is already registered');
        } else if (error.message === 'username already exists') {
          setGeneralError('This username is already taken');
        } else {
          setGeneralError(error.message || 'An error occurred during registration');
        }
      }
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handlePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    if (newEmail && !validateEmail(newEmail)) {
      setEmailError('Please enter a valid email address');
    } else {
      setEmailError('');
    }
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    if (!isLogin && confirmPassword && newPassword !== confirmPassword) {
      setPasswordError("Passwords don't match");
    } else {
      setPasswordError('');
    }
  };

  const handleConfirmPasswordChange = (e) => {
    const newConfirmPassword = e.target.value;
    setConfirmPassword(newConfirmPassword);
    if (password !== newConfirmPassword) {
      setPasswordError("Passwords don't match");
    } else {
      setPasswordError('');
    }
  };

  const isFormValid = () => {
    if (isLogin) {
      return email && password && !emailError;
    } else {
      return username && email && password && confirmPassword && displayName && 
             !emailError && !passwordError && password === confirmPassword;
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      aria-labelledby="auth-dialog-title"
      disableRestoreFocus
    >
      <DialogTitle id="auth-dialog-title" sx={{ m: 0, p: 2 }}>
        {isLogin ? 'Login' : 'Register'}
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        {generalError && <Alert severity="error" sx={{ mb: 2 }}>{generalError}</Alert>}
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          {!isLogin && (
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          )}
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus={isLogin}
            value={email}
            onChange={handleEmailChange}
            error={!!emailError}
            helperText={emailError}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type={showPassword ? "text" : "password"}
            id="password"
            autoComplete={isLogin ? "current-password" : "new-password"}
            value={password}
            onChange={handlePasswordChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handlePasswordVisibility}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          {!isLogin && (
            <>
              <TextField
                margin="normal"
                required
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                error={!!passwordError}
                helperText={passwordError}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle confirm password visibility"
                        onClick={handleConfirmPasswordVisibility}
                        edge="end"
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="displayName"
                label="Display Name"
                name="displayName"
                autoComplete="name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />
            </>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={!isFormValid()}
          >
            {isLogin ? 'Sign In' : 'Sign Up'}
          </Button>
          <FormControlLabel
            control={
              <Switch 
                checked={!isLogin} 
                onChange={() => setIsLogin(!isLogin)} 
              />
            }
            label={isLogin ? "Need an account? Register" : "Already have an account? Login"}
          />
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default Auth;