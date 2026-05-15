import react from "react";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Stack from 'react-bootstrap/Stack';
import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import TextField from '@mui/material/TextField';

function TypingTest({ returnFlightTime, returnDwellTime, passPhrase }) {

    const sentence = passPhrase;
    const [endVal, setEndVal] = useState(passPhrase.split(''));
    const [keyDown, setKeyDown] = useState([]);
    const [keyUp, setKeyUp] = useState([]);
    const [downTime, setDownTime] = useState([]);
    const [flightTime, setFlightTime] = useState([]);
    const [hasError, setHasError] = useState(false);
    const [testDone, setTestDone] = useState(false);



    const calculateFlightTime = (currentDownTime, currentKeyUpArr) => {
        if (currentKeyUpArr.length === 0) return;
        const lastUpTime = currentKeyUpArr[currentKeyUpArr.length - 1];
        const flight = currentDownTime - lastUpTime;
        setFlightTime([...flightTime, flight]);
    };

    const calculateDownTime = (currentUpTime, currentKeyDownArr) => {
        if (currentKeyDownArr.length === 0) return;
        const lastDownTime = currentKeyDownArr[currentKeyDownArr.length - 1];
        const down = currentUpTime - lastDownTime;
        setDownTime([...downTime, down]);
    };

    // need a mean and Standard deviation to get a more accurate dataset to compare to the stored dataset
    //Then sort the data and remove any outlier data 
    const getStatsForDataSets = () => {
        if (flightTime.length == 0 || downTime.length == 0) {
            return
        }

        //get mean and standard deveations for each dataset 
        const meanFT = flightTime.reduce((sum, val) => sum + val, 0) / flightTime.length;
        const variationFT = flightTime.reduce((sum, val) => sum + Math.pow(val - meanFT, 2));
        const standardVariationFT = Math.sqrt(variationFT);
        const meanDT = flightTime.reduce((sum, val) => sum + val, 0) / flightTime.length;
        const variationDT = flightTime.reduce((sum, val) => sum + Math.pow(val - meanDT, 2));
        const standardVariationDT = Math.sqrt(variationDT);

        //remove outliers

        if (flightTime.length < 4 || downTime.length < 4) {
            return
        }

        const sortedFT = flightTime.sort((a, b) => a - b);
        const q1FT = sortedFT[Math.floor(sortedFT.length * 0.25)];
        const q3FT = sortedFT[Math.floor(sortedFT.length * 0.75)];
        const iqrFT = q3FT - q1FT;
        const maxCutoffFT = q3FT + 1.5 * iqrFT;
        const cleanFT = flightTime.filter(val => val <= maxCutoffFT);
    }

    const handleChange = (e) => {
        let currentInput = e.target.value;
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
                if (returnDwellTime) returnDwellTime = downTime;
                if (returnFlightTime) returnFlightTime = flightTime;

                setTestDone(true);
                setHasError(false);

            } else {
                setHasError(true)
            }
        }

    }

    return (
        <Stack>
            <TextField

                onChange={(e) => handleChange(e)}

                onKeyDown={(e) => {
                    const time = Date.now();
                    setKeyDown([...keyDown, time]);
                    calculateFlightTime(time, keyUp);
                }}
                onKeyUp={(e) => {
                    const time = Date.now();
                    setKeyUp([...keyUp, time]);
                    calculateDownTime(time, keyDown);
                }}
                error={hasError}
                helperText={hasError ? "The passphrase is Incorrect please try again" : "Calculating Typing Cadence"}
                disabled={testDone}
            />
        </Stack>
    );
};

export default TypingTest;

