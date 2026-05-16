import * as React from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import EmailIcon from '@mui/icons-material/Email';
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


export default function TextFields({ displayLabel, value, isError, errorText, onChangeVal }) {

    const [val, setVal] = useState(value||'');
    const [isFocused, setIsFocused] = useState(false);

    return (
        <ThemeProvider theme={theme}>
            <TextField
                label={displayLabel}
                sx={{
                    // width: '100%',
                }}
                type='text'
                value={val}
                onChange={(event) => {
                    setVal(event.target.value);
                    if (onChangeVal) {
                        onChangeVal(event.target.value)
                    };
                }}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                error={isError}
                helperText={errorText}
                slotProps={{
                    input: {
                        startAdornment: isFocused || val ? //if it is focused or has a value the adornment will appear otherwise it doesn't
                            <InputAdornment position="start">
                                <EmailIcon sx={{ color: '#000' }} />
                            </InputAdornment> : false,
                    },
                }}
            />
        </ThemeProvider>
    );
}