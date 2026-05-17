import react from "react";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Stack from 'react-bootstrap/Stack';
import './App.css';
import TextField from "./components/TextFields";
import PasswordField from "./components/passwordField";
import { useState, useRef } from 'react';
import placeHolder from './Images/image.png'
import 'bootstrap/dist/css/bootstrap.min.css';
import TypingTest from "./components/TypingTest";
import { useForm, Controller } from "react-hook-form";
import PassphraseFields from "./components/passPhraseField";
import axios from "axios";
import Modals from "./components/Modal";
import Divider from '@mui/material/Divider';

function App() {
  const [minDwellTime, setMinDwellTime] = useState();
  const [minFlightTime, setMinFlightTime] = useState();
  const [maxDwellTime, setMaxDwellTime] = useState();
  const [maxFlightTime, setMaxFlightTime] = useState();

  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalBody, setModalBody] = useState('');
  const [modalButton, setModalButton] = useState('');

  const [emailVal, setEmailVal] = useState('');
  const [passwordVal, setPasswordVal] = useState('');
  const [returnData, setReturnData] = useState();
  const [message, setMessage] = useState('');
  const [authAttempts, setAuthAttempts] = useState(3);
  const [hasError, setHasError] = useState(false);
  const [regID, setRegID] = useState('');

  const loginFlightTime = useRef([]);
  const loginDwellTime = useRef([]);
  const [loginTestDone, setLoginTestDone] = useState();

  const regFlightTime = useRef([]);
  const regDwellTime = useRef([]);
  const [regTestDone1, setRegTestDone1] = useState(false);
  const [regTestDone2, setRegTestDone2] = useState(false);
  const [regTestDone3, setRegTestDone3] = useState(false);

  const passPhrase = useRef('');
  const [currentUserId, setCurrentUserId] = useState('');

  const [page, setPage] = useState('login');

  const loginForm = useForm({ mode: "onSubmit" });
  const signupForm = useForm({ mode: "onSubmit" });

  const {
    control: loginControl,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors },
    reset: resetLogin
  } = loginForm;

  const {
    control: signupControl,
    handleSubmit: handleSignupSubmit,
    formState: { errors: signupErrors },
    reset: resetSignup
  } = signupForm;

  const Register = async (email, password, passphrase) => {
    setMessage('');
    try {
      const res = await axios.post("http://localhost:5000/api/user/register", {
        email,
        password,
        passphrase
      });
      setRegID(res.data.id);
      passPhrase.current = passphrase;
      setPage('regAuth');
    } catch (error) {
      setMessage('Registration failed, please try again');
      setHasError(true);
    }
  };

  const Login = async (email, password) => {
    setMessage('');
    const res = await axios.post("http://localhost:5000/api/user/login", {
      email,
      password,
    });
    if (res.data.message == 'User found') {
      setMinDwellTime(res.data.minDwellTime);
      setMaxDwellTime(res.data.maxDwellTime);
      setMinFlightTime(res.data.minFlightTime);
      setMaxFlightTime(res.data.maxFlightTime);
      passPhrase.current = res.data.passphrase;

      setPage('loginAuth');
    } else {
      setMessage("Email or Password incorrect, Please try again");
      setHasError(true);
    }
  };
  const UpdateRegister = async (minDwell, maxDwell, minFlight, maxFlight) => {
    const res = await axios.put("http://localhost:5000/api/user/" + regID, {
      minDwellTime: minDwell,
      maxDwellTime: maxDwell,
      minFlightTime: minFlight,
      maxFlightTime: maxFlight,
    });
    if (res.data.message != 'User not found') {
      setHasError(false);
    } else {
      setMessage("You could not be authenticated, please try again");
      setHasError(true);
    }
  };


  const onLoginSubmit = (data) => {
    setEmailVal(data.email);
    setPasswordVal(data.password);
    Login(data.email, data.password)
    if (message == 'User found') {
      setHasError(false);
    } else {
      setHasError(true);
    }
  };

  const onSignupSubmit = (data) => {
    setEmailVal(data.email);
    setPasswordVal(data.password);
    passPhrase.current = data.passphrase;
    Register(data.email, data.password, data.passphrase);
    if (message == "User registered" && regID != null) {
      setHasError(false);
    } else {
      setHasError(true);
    }
  };

  // need a mean and Standard deviation to get a more accurate dataset to compare to the stored dataset
  //Then sort the data and remove any outlier data 
  const getStatsForDataSets = (dataset) => {
    if (!dataset || dataset.length === 0) {
      return null
    }

    //get mean and standard deveations for each dataset 
    const mean = dataset.reduce((sum, val) => sum + val, 0) / dataset.length;
    const variation = dataset.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / dataset.length;
    const standardDeviation = Math.sqrt(variation);


    return ({ mean: mean, standardDeviation: standardDeviation })
    //remove outliers
  }
  const removeOutliers = (dataset) => {
    if (!dataset || !Array.isArray(dataset) || dataset.length === 0) return [];
    if (dataset.length < 4) {
      return dataset || []
    }

    const sorted = [...dataset].sort((a, b) => a - b);
    const q1 = sorted[Math.floor(sorted.length * 0.25)];
    const q3 = sorted[Math.floor(sorted.length * 0.75)];
    const iqr = q3 - q1;
    const maxCutoff = q3 + 1.5 * iqr;
    const cleanDataset = dataset.filter(val => val <= maxCutoff);
    return (cleanDataset);
  }

  const checkAuthData = (flightTime, dwellTime) => {

    const cleanFlightTimes = removeOutliers(flightTime)
    const flightTimeStats = getStatsForDataSets(cleanFlightTimes);
    const cleanDwellTimes = removeOutliers(dwellTime)
    const dwellTimeStats = getStatsForDataSets(cleanDwellTimes);

    console.log('minDwell:', minDwellTime, 'maxDwell:', maxDwellTime);
    console.log('minFlight:', minFlightTime, 'maxFlight:', maxFlightTime);
    console.log('flightTime input:', flightTimeStats.mean);
    console.log('dwellTime input:', dwellTimeStats.mean);

    const dwellMatch = dwellTimeStats.mean >= minDwellTime && dwellTimeStats.mean <= maxDwellTime
    const flightMatch = flightTimeStats.mean >= minFlightTime && flightTimeStats.mean <= maxFlightTime

    if (dwellMatch && flightMatch) {
      //auth complete modal & logged in modal
      console.log("authentication complete");
      setShowModal(true);
      setModalBody('Checkmark');
      setModalTitle('Logged in Successfully');
      setModalButton('Reload Page');
    } else {
      if (authAttempts !== 0) {
        setMessage("Authentication failed, please try again.");
        setAuthAttempts(authAttempts - 1);

      } else {
        setShowModal(true);
        setModalBody('X');
        setModalTitle('Failed to Authenticate your identity');
        setModalButton('Reload Page');
      }
    }
  }

  const submitAuthData = (flightTime, dwellTime) => {
    console.log('flight times:', regFlightTime.current);
    console.log('dwell times:', regDwellTime.current);
    console.log('are arrays:', Array.isArray(regFlightTime.current), Array.isArray(regDwellTime.current));
    const cleanFlightTimes = removeOutliers(flightTime)
    const flightTimeStats = getStatsForDataSets(cleanFlightTimes);
    const cleanDwellTimes = removeOutliers(dwellTime)
    const dwellTimeStats = getStatsForDataSets(cleanDwellTimes);

    if (!flightTimeStats || !dwellTimeStats) {
      console.log('Not enough data to calculate stats');
      return;
    }
    const calculatedMinDwell = dwellTimeStats.mean - (1.5 * dwellTimeStats.standardDeviation);
    const calculatedMinFlight = flightTimeStats.mean - (1.5 * flightTimeStats.standardDeviation);

    setMinDwellTime(calculatedMinDwell < 15 ? 15 : calculatedMinDwell);
    setMaxDwellTime(dwellTimeStats.mean + (1.5 * dwellTimeStats.standardDeviation));

    setMinFlightTime(calculatedMinFlight < 15 ? 15 : calculatedMinFlight);
    setMaxFlightTime(flightTimeStats.mean + (1.5 * flightTimeStats.standardDeviation));



    UpdateRegister(calculatedMinDwell, dwellTimeStats.mean + (1.5 * dwellTimeStats.standardDeviation), calculatedMinFlight, flightTimeStats.mean + (1.5 * flightTimeStats.standardDeviation))
    setShowModal(true);
    setModalBody('Checkmark');
    setModalTitle('Registered Successfully!');
    setModalButton('Reload Page');
  }

  //when a user registers they'll do three rounds of the test- that data will be put into 1 array to then get a general overview of the users data. then once that data is captured and merged I have to remove outliers
  //once the outliers are removed I should be able to get a min and max dwell and flight time to add to the database. 
  //when the user tries to log in they'll need to type their passphrase and the data will be captured in one go. That data will have outliers removed and the mean of the data will be gotten. 
  //When the mean is then checked to see if it falls within the min and max dwell and flight times. 



  const currentPage = (currentPage) => {

    if (currentPage == 'login') {
      return (

        <form className="form" noValidate onSubmit={handleLoginSubmit(onLoginSubmit)}>
          <Stack gap={5} direction="vertical">
            <h1>Creative Authentication</h1>
            <h2>Login</h2>
            <p className="errorMessage">{message}</p>
            <Controller
              name="email"
              control={loginControl}
              rules={{
                required: "Email is required",
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: "Please enter a valid email"
                }
              }}
              render={({ field }) => (
                <TextField
                  displayLabel="Email"
                  value={field.value || ''}
                  onChangeVal={field.onChange}
                  isError={!!loginErrors.email} // !! forces the object value to become a bool :) 
                  errorText={loginErrors.email?.message} //check if there is a value
                />
              )}
            />

            <Controller
              name="password"
              control={loginControl}
              rules={{
                required: "Password is required",
              }}
              render={({ field }) => (
                <PasswordField
                  value={field.value || ''}
                  onChangePass={field.onChange}
                  isError={!!loginErrors.password}
                  errorText={loginErrors.password?.message}
                />
              )}
            />

            <button className="customBtn" type="submit">Log in</button>
            <Divider>OR</Divider>
            <div className="switchPage">
              <p>Don't have an account yet?: </p>
              <button className="customBtnSecondary" type="button" onClick={() => {
                resetSignup({ email: '', password: '', passphrase: '' });
                resetLogin({ email: '', password: '' });
                setHasError(false);
                setMessage('');
                setPage('signup');
              }}>Register</button>
            </div>
          </Stack>
        </form>
      )
    } else if (currentPage == 'signup') {
      return (

        <form className="form" noValidate onSubmit={handleSignupSubmit(onSignupSubmit)}>
          <Stack gap={5} direction="vertical">
            <h1>Creative Authentication</h1>
            <h2>Registration</h2>
            <p className="errorMessage">{message}</p>
            <Controller
              name="email"
              control={signupControl}
              rules={{
                required: "Email is required",
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: "Please enter a valid email"
                }
              }}
              render={({ field }) => (
                <TextField
                  displayLabel="Email"
                  value={field.value || ''}
                  onChangeVal={field.onChange}
                  isError={!!signupErrors.email} // !! forces the object value to become a bool :) 
                  errorText={signupErrors.email?.message} //check if there is a value
                />
              )}
            />

            <Controller
              name="password"
              control={signupControl}
              rules={{
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters"
                },
                pattern: {
                  value: /^(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~])/,//random string of letters is checking if there are special characters in the password that was entered
                  message: "Password must contain a special character"
                }
              }}
              render={({ field }) => (
                <PasswordField
                  value={field.value || ''}
                  onChangePass={field.onChange}
                  isError={!!signupErrors.password}
                  errorText={signupErrors.password?.message}
                />
              )}
            />

            <Controller
              name="passphrase"
              control={signupControl}
              rules={{
                required: "Passphrase is required",
                minLength: {
                  value: 20,
                  message: "Passphrase must be at least 20 characters long"
                }
              }}
              render={({ field }) => (
                <PassphraseFields
                  displayLabel="Passphrase"
                  value={field.value || ''}
                  onChangeVal={field.onChange}
                  isError={!!signupErrors.passphrase} // !! forces the object value to become a bool :) 
                  errorText={signupErrors.passphrase?.message} //check if there is a value
                />
              )}
            />

            <button className="customBtn" type="submit">Register</button>
            <Divider>OR</Divider>
            <div className="switchPage">
              <p>Already have an account?: </p>
              <button className="customBtnSecondary" type="button" onClick={() => {
                resetLogin({ email: '', password: '' });
                resetSignup({ email: '', password: '', passphrase: '' });
                setHasError(false);
                setMessage('');
                setPage('login');
              }}>Login</button>
            </div>
          </Stack>
        </form>
      )
    } else if (currentPage == 'regAuth') {
      return (

        <Stack gap={5} direction="vertical">
          <h1>Creative Authentication</h1>
          <h2>Registration Authentication</h2>
          <p className="errorMessage">{message}</p>
          <TypingTest
            returnDwellTime={(newData) => { regDwellTime.current.push(...newData); }}
            returnFlightTime={(newData) => { regFlightTime.current.push(...newData); }}
            isTestDone={setRegTestDone1}
            displayLabel={"Enter your passphrase"}
            passPhrase={passPhrase.current}
          />
          <TypingTest
            returnDwellTime={(newData) => { regDwellTime.current.push(...newData); }}
            returnFlightTime={(newData) => { regFlightTime.current.push(...newData); }}
            isTestDone={setRegTestDone2}
            displayLabel={"Enter your passphrase"}
            passPhrase={passPhrase.current}
          />
          <TypingTest
            returnDwellTime={(newData) => { regDwellTime.current.push(...newData); }}
            returnFlightTime={(newData) => { regFlightTime.current.push(...newData); }}
            isTestDone={setRegTestDone3}
            displayLabel={"Enter your passphrase"}
            passPhrase={passPhrase.current}
          />

          <button className="customBtn" disabled={regTestDone1 && regTestDone2 && regTestDone3 ? false : true} onClick={() => submitAuthData(regFlightTime.current, regDwellTime.current)}>Finish Registration</button>
        </Stack>
      )
    } else if (currentPage == 'loginAuth') {
      return (
        <Stack gap={5} direction="vertical">
          <h1>Creative Authentication</h1>
          <h2>Login Authentication</h2>
          <p className="errorMessage">{message}</p>
          <TypingTest
            returnDwellTime={(newData) => { loginDwellTime.current.push(...newData); }}
            returnFlightTime={(newData) => { loginFlightTime.current.push(...newData); }}
            isTestDone={setLoginTestDone}
            displayLabel={"Enter your passphrase"}
            passPhrase={passPhrase.current}
          />

          <button className="customBtn" disabled={loginTestDone ? false : true} onClick={() => checkAuthData(loginFlightTime.current, loginDwellTime.current)}>Authenticate</button>
        </Stack>

      )


    }

  }

  return (
    <Container fluid className="background">
      <Row className="loginContainers">
        <Col lg={6} className="imageContainer d-none d-lg-block">
          <img className="image" src={placeHolder}></img>
        </Col>
        <Col lg={6} md={12} className="loginContainer mx-auto my-sm-5 ">
          <div key={page}>
            {currentPage(page)}
          </div>
        </Col>
      </Row>
      <Modals showModal={showModal} modalTitle={modalTitle} modalBody={modalBody} modalButtons={modalButton}></Modals>
    </Container>
  );
}

export default App;
