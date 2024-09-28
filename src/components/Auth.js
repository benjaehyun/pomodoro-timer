import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  TextField, 
  Button, 
  Box,  
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
  const dispatch = useDispatch();
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');



  useEffect(() => {
    if (!open) {
      resetForm();
    }
  }, [open]);

  const resetForm = () => {
    setUsername('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setDisplayName('');
    setIsLogin(true);
    setShowPassword(false);
    setShowConfirmPassword(false);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const handleError = (resultAction) => {
      console.error('Action failed:', resultAction);
      if (resultAction.payload && resultAction.payload.message) {
        setError(resultAction.payload.message);
      } else if (resultAction.error && resultAction.error.message) {
        setError(resultAction.error.message);
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    };

    if (isLogin) {
      try {
        const resultAction = await dispatch(login({ email, password }));
        if (login.fulfilled.match(resultAction)) {
          onClose();
        } else if (login.rejected.match(resultAction)) {
          handleError(resultAction);
        }
      } catch (err) {
        console.error('Unexpected login error:', err);
        setError('An unexpected error occurred during login');
      }
    } else {
      if (password !== confirmPassword) {
        setError("Passwords don't match");
        return;
      }
      try {
        const resultAction = await dispatch(register({ username, email, password, displayName }));
        if (register.fulfilled.match(resultAction)) {
          onClose();
        } else if (register.rejected.match(resultAction)) {
          handleError(resultAction);
        }
      } catch (err) {
        console.error('Unexpected registration error:', err);
        setError('An unexpected error occurred during registration');
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

  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return re.test(String(email).toLowerCase());
  };

  const isFormValid = () => {
    if (isLogin) {
      return email && password && validateEmail(email);
    } else {
      return username && email && password && confirmPassword && displayName && 
             validateEmail(email) && password === confirmPassword;
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
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
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
            onChange={(e) => setEmail(e.target.value)}
            error={!!(email && !validateEmail(email))}
            helperText={email && !validateEmail(email) ? 'Enter a valid email address' : ''}
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
            onChange={(e) => setPassword(e.target.value)}
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
                onChange={(e) => setConfirmPassword(e.target.value)}
                error={!!(password !== confirmPassword && confirmPassword !== '')}
                helperText={password !== confirmPassword && confirmPassword !== '' ? "Passwords don't match" : ''}
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
                onChange={() => {
                  setIsLogin(!isLogin);
                  setError('');
                }}
              />
            }
            label={isLogin ? "Need an account? Register" : "Already have an account? Login"}
          />
        </Box>
      </DialogContent>
      {/* {authError && <Alert severity="error">{authError}</Alert>} */}
    </Dialog>
  );
};

export default Auth;