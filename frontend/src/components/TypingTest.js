import react from "react";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Stack from 'react-bootstrap/Stack';
import { useState, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import TextField from '@mui/material/TextField';
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

function TypingTest({ returnFlightTime, returnDwellTime, isTestDone, passPhrase, displayLabel }) {

    const sentence = passPhrase ? passPhrase : "Fork Paris Water Mushroom";
    const [endVal, setEndVal] = useState(sentence.split(''));
    const keyDown = useRef([]);
    const keyUp = useRef([]);
    const downTime = useRef([]);
    const flightTime = useRef([]);
    const [hasError, setHasError] = useState(false);
    const [testDone, setTestDone] = useState(false);
    const [value, setValue] = useState('');


    const calculateFlightTime = (currentDownTime, currentKeyUpArr) => {
        if (currentKeyUpArr.length === 0) return;
        const lastUpTime = currentKeyUpArr[currentKeyUpArr.length - 1];
        const flight = currentDownTime - lastUpTime;
        flightTime.current.push(flight);
    };

    const calculateDownTime = (currentUpTime, currentKeyDownArr) => {
        if (currentKeyDownArr.length === 0) return;
        const lastDownTime = currentKeyDownArr[currentKeyDownArr.length - 1];
        const down = currentUpTime - lastDownTime;
        downTime.current.push(down);
    };



    const handleChange = (e) => {
        let currentInput = e.target.value;
        setValue(e.target.value);
        if (currentInput.length === 0) {
            setHasError(false);
            return;
        }

        const correctInput = currentInput.split('').every(
            (char, i) => char == endVal[i]
        );

        if (!correctInput) {
            setHasError(true);

        } else {
            setHasError(false);

        }

        if (currentInput.length == endVal.length) {
            if (correctInput) {
                if (returnDwellTime) returnDwellTime(downTime.current);
                if (returnFlightTime) returnFlightTime(flightTime.current);
                setTestDone(true);
                if (isTestDone) isTestDone(true);
                setHasError(false);

            } else {
                setHasError(true)
            }
        }

    }

    const resetTest = () => {
        flightTime.current = [];
        downTime.current = [];
        setHasError(false);
        keyDown.current = [];
        keyUp.current = [];
        setTestDone(false);
        setValue('');
    }

    return (
        <Stack>
            <ThemeProvider theme={theme}>
                <TextField

                    onChange={(e) => handleChange(e)}

                    onKeyDown={(e) => {
                        const time = performance.now();
                        keyDown.current.push(time);
                        calculateFlightTime(time, keyUp.current);
                    }}
                    onKeyUp={(e) => {
                        const time = performance.now();
                        keyUp.current.push(time);
                        calculateDownTime(time, keyDown.current);
                    }}
                    error={hasError}
                    helperText={hasError ? "The passphrase is Incorrect please try again" : ""}
                    disabled={testDone}
                    label={displayLabel}
                    value={value}
                    autoComplete="off" 
                />
            </ThemeProvider>
            <button onClick={() => resetTest()}>Reset</button>
        </Stack>
    );
};

export default TypingTest;

