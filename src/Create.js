import { useState, useRef, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { v4 as uuid } from 'uuid'
import axios from 'axios';
import auth from "./auth";
import Nav from "./Nav.js";
import "./input.css";
import "./form.css";
import "./button.css";
import "./container.css";
import "./label.css";
import "./nav.css";
import "./span.css";

import toast, { Toaster } from 'react-hot-toast';
import {ok} from "./globals.js";
import { useSelector, useDispatch } from 'react-redux';
import { isLoggedIn } from './isLoggedInSlice';
import { REACT_APP_URL_ACC } from './globals.js';

function Create () {

  const time        = 2_000; // 2 seconds
  const isLogged_in = useSelector((state) => state.logged_in.value);
  const dispatch    = useDispatch();
  const nav         = useNavigate();
 
  const name_ref = useRef();
  const spec_ref = useRef();

  const [secret, setSecret] = useState("");

  useEffect (() => {
    console.log("@Create component is mouting");
    if ( auth() ) {
      nav("/");
    }
    else {
      // do nothing
    }
  },[]);

  const generateUUID = (event) => {
    console.log("@generateUUID");
    const content = event.target.value;
    if ( content === "" ) {
      setSecret ( "" );
    } else {
      setSecret ( uuid () );
    }
  }

  const handlePaste = () => {
    console.log ( "@handlePaste" );

    const config = {id : "clipboard" /* to avoid duplication of the toast */ };
    const value = secret;
    navigator.clipboard.writeText(value).then ( () => {
      toast.success("Copied the stuff.", config);
    }, (err) => {
      toast.error("Something went terribly wrong...", config);
    });
  }

  const handleSubmit = (e) => {
    console.log("@handleSubmit");
    e.preventDefault();

    const config = {id : "post create account" };
    const name   = name_ref.current.value.trim();
    const spec   = spec_ref.current.value.trim();

    name_ref.current.value = "";
    spec_ref.current.value = "";
    setSecret("");

    const user_obj = {
      name : name,
      spec : spec,
      key  : secret,
    };

    // make a post request to the api
    axios.post ( REACT_APP_URL_ACC, user_obj ).then ( (msg) => {
      console.log ( msg );

      const msg_info    = msg.data.msg; 
      const status_code = msg.data.status;

      if ( ok ( status_code ) ) {
        // @Incomplete redirect somewhere else
        // perhaps have something saved ...
        toast.success(msg_info, config);
        dispatch ( isLoggedIn(true) );

        localStorage.setItem("name", name);
        localStorage.setItem("spec", spec);
        localStorage.setItem("key", secret);

        nav ("/");
      } else {
        toast.error(msg_info, config);
      }
    }).catch ( (e) => {
      toast.error("Something went wrong when connecting to the server.", config);
    });

  }

  return (
    <>
      <div><Toaster position="bottom-right" reverseOrder={false} 
        toastOptions={{
          duration : 4000,
          style    : {
            borderRadius : "10px",
            fontFamily   : 'Reddit Mono',
            padding      : "15px",
            background   : "#d0dff7", 
        },
      }}/></div>
      <Nav/>
      <div className="container-form-create">
        <form onSubmit={(e) => handleSubmit(e)}>
          <br/>
          <label>Your name</label>
          <br/>
          <input required type="text" placeholder="What's your name ?" ref={name_ref} onChange={(e) => generateUUID(e)} />
          <br/>
          <label>Your Specialisation</label><br/>
          <input required type="text" placeholder="What's your Specialisation ?" ref={spec_ref}/>
          <hr/>
          <span id="non-selectable" title="Dont share it with anyone 🤫">Your secret token is {secret === "" ? "🤷" : secret}</span>
          <button type="button" onClick={handlePaste}>📋</button>
          <br/>
          <div className="container-button-submit-create-form">
            <button type="submit">Create account</button>
          </div>
        </form>
      </div>
    </>
  )
}

export default Create;
