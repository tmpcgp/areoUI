import axios from 'axios';
import "./svg.css";
import "./title.css";
import "./span.css";
import Nav from "./Nav";
import auth from "./auth";

import React from 'react';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { useState, useRef, useEffect } from 'react';
import { isLoggedIn } from './isLoggedInSlice';
import { REACT_APP_URL_LOGIN } from './globals.js';

import 'katex/dist/katex.min.css';
import Latex from 'react-latex-next';

function App() {

  const isLogged_in = useSelector((state) => state.logged_in.value); const dispatch    = useDispatch();
  const nav         = useNavigate();

  useEffect( () => {
    console.log("App.js is mounting");

    // checks if the user is already auth.
    if ( auth() ) {
      console.log("@auth App.js");
      dispatch( isLoggedIn( true ) );
    }
    else {
      console.log("@not auth App.js");
      dispatch ( isLoggedIn ( false ) );
    }
  }, []);

  const handleLogin = () => {
    console.log("@handleLogin");
    nav("/login");
  }

  const handleCreate = () => {
    console.log("@handleCreate");
    nav("/create");
  }

  const handleChooseBot = () => {
    console.log("@handleChooseBot");
  }

  const handleSearch    = (query) => {
    console.log("@handleSearch");
    setInput ( query );
    // do some search in here.
  }

  // @Incomplete ( use some cookies for that ... )
  const [input, setInput]     = useState("");
  const [results, setResults] = useState([]);

  return (
    <div className="App">
      <Nav/>
      <Latex>
        We give illustrations for the {1 + 2} processes $e^+e^-$, gluon-gluon and $\\gamma\\gamma \\to W t\\bar b$.
      </Latex>
      <h1>
        { isLogged_in ? "Hey " + localStorage.getItem("name") + "👋" : "Configure your 🤖 now!" }
      </h1>
      {
        isLogged_in
        ? 
        <span className="spec">{localStorage.getItem("spec")}</span>
        :
        ""
      }
    </div>
  );
}

/*
<Popup trigger={<button>Trigger</button>} modal>
{ close => (
<div>
<h1>
Choisis un robot.
</h1>
<input value={input} onChange={(e) => handleSearch ( e.target.value ) } placeholder="🔎 by bot name"/> 
<div>
<ul>
<li>Local Bot</li>
{ isLogged_in ? <li>Main Bot</li> : <li>Unlock the Main bot on login.</li> }
</ul>
</div>
<button onClick={() => close()}>Close</button>
<button onClick={handleChooseBot}>Choose</button>
</div>
)}
</Popup
*/

export default App;
