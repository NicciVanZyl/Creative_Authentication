import react from "react";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Stack from 'react-bootstrap/Stack';
import './App.css';
import TextField from "./components/TextFields";
import PasswordField from "./components/passwordField";
import { useState, useEffect } from 'react';
import placeHolder from './Images/image.png'
import 'bootstrap/dist/css/bootstrap.min.css';
import TypingTest from "./components/TypingTest";

function App() {
  const [errorFound, setErrorFound] = useState(false);

  const [minDwellTime, setMinDwellTime] = useState();
  const [minFlightTime, setMinFlightTime] = useState();
  const [maxDwellTime, setMaxDwellTime] = useState();
  const [maxFlightTime, setMaxFlightTime] = useState();

  const [emailVal, setEmailVal] = useState('');
  const [passwordVal, setPasswordVal] = useState('');
  
  
  const [loginFlightTime, setLoginFlightTime] = useState([]);
  const [loginDwellTime, setLoginDwellTime] = useState([]);

  const [regFlightTime1, setRegFlightTime1] = useState([]);
  const [regDwellTime1, setRegDwellTime1] = useState([]);
  const [regFlightTime2, setRegFlightTime2] = useState([]);
  const [regDwellTime2, setRegDwellTime2] = useState([]);
  const [regFlightTime3, setRegFlightTime3] = useState([]);
  const [regDwellTime3, setRegDwellTime3] = useState([]);

  const [page, setPage] = useState('login');

 
  const useEffect = () => ({
    if (loginFlightTime) {
      
    }

  }, [loginFlightTime])

  const currentPage = (currentPage) => {

    if (currentPage == 'login') {
      return (
        <Stack gap={5} direction="vertical">
          <h1>Creative Authentication</h1>
          <h2>Login</h2>
          <TextField
            displayLabel="Email"
            value={emailVal}
            onChangeVal={setEmailVal}
          />
          <PasswordField
            value={passwordVal}
            onChangePass={setPasswordVal}
          />

          <TypingTest returnDwellTime={setLoginDwellTime} returnFlightTime={setLoginFlightTime}></TypingTest>
        </Stack>
      )
    } else {
      <Stack>
        <h1>Creative Authentication</h1>
        <h2>Registration</h2>
        <TextField
          displayLabel="Email"
          value={emailVal}
          onChangeVal={setEmailVal}
        />
        <PasswordField
          value={passwordVal}
          onChangePass={setPasswordVal}
        />


      </Stack>
    }

  }

  return (
    <Container fluid className="background">
      <Row className="loginContainers">
        <Col lg={6} md={12} className="imageContainer">
          <img className="image" src={placeHolder}></img>
        </Col>
        <Col lg={6} md={12} className="loginContainer">
          {currentPage(page)}
        </Col>

      </Row>
    </Container>
  );
}

export default App;
