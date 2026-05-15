import * as React from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme({
    components: {


        MuiAutocomplete: {
            styleOverrides: {
                //label colours
                root: {
                    '& .MuiInputLabel-root': {
                        color: '#000',
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                        color: '#000',
                    },
                },

                //input 
                input: {
                    fontSize: '16px',
                    color: '#000',
                },

            },
        },

        //outlines 
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    borderRadius: '32px',
                    '& fieldset': {
                        borderColor: '#000',
                        borderWidth: '2px',
                    },
                    '&:hover fieldset': {
                        borderColor: '#27F5CF',
                        borderWidth: '2px',
                    },
                    '&.Mui-focused fieldset': {
                        borderColor: '#27F5CF',
                        borderWidth: '2px',
                    },
                    '&.Mui-error fieldset': {
                        borderColor: 'rgb(233, 56, 56)',
                        borderWidth: '2px',
                    },
                    background: '#FAFAFA',
                },
            },
        },

        //little label 
        MuiInputLabel: {
            styleOverrides: {
                root: {
                    color: '#000',
                    background: 'transparent',
                    borderRadius: '12px 12px 0 0',
                    paddingLeft: '5px', paddingRight: '5px',
                    '&.Mui-focused': { color: '#19838A', background: 'transparent', borderRadius: '12px 12px 0 0', paddingLeft: '5px', paddingRight: '5px', },
                    '&.Mui-error': { color: 'rgb(255, 125, 125)' },
                },
            },
        },

    },
});


export default function PasswordField({ value, isError, onChangePass }) {

    const [pass, setPass] = useState(value);

    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleMouseUpPassword = (event) => {
        event.preventDefault();
    };

    return (
        <ThemeProvider theme={theme}>
            <TextField
                label="Password"
                sx={{
                    // width: '100%',
                }}
                type={showPassword ? 'text' : 'password'}
                value={pass}
                onChange={(event) => {
                    setPass(event.target.value);
                    if (onChangePass) {
                        onChangePass(event.target.value)
                    };
                }}
                error={isError}
                slotProps={{
                    input: {
                        endAdornment: <InputAdornment position="end"><IconButton 
                        sx={{
                            color:'#000',
                            '&:hover':{
                                color:'#19838A',
                            }
                        }}
                            aria-label={ //aria-labels are used for screen-readers thus makes website for accessible :D 
                                showPassword ? 'hide the password' : 'display the password' 
                            }
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            onMouseUp={handleMouseUpPassword}
                            edge="end"
                        >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton ></InputAdornment>,
                    },
                }}
            />
        </ThemeProvider>
    );
}