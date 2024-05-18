import { useState, useRef, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { v4 as uuid } from 'uuid'
import auth from "./auth";
import axios from 'axios';
import Nav from "./Nav.js";

import "./input.css";
import "./form.css";
import "./button.css";
import "./container.css";
import "./label.css";
import "./nav.css";
import "./span.css";

import {ok} from "./globals.js";
import { useSelector, useDispatch } from 'react-redux';
import { isLoggedIn } from './isLoggedInSlice';

function Login () {

  const isLogged_in = useSelector((state) => state.logged_in.value);
  const dispatch    = useDispatch()
  const input       = useRef();
  const nav         = useNavigate();
  const ERR         = 1;
  const OK          = 0;
  const NONE        = 2;

  const [status, setStatus] = useState ({content : "", type : NONE});

  var REACT_APP_URL_LOGIN_PROD;

  const compute_class_name = () => {
    const type = status.type;
    switch ( type ){
      case ERR :
        return "span-err";
      case OK  :
        return "span-ok";
      default  :
        return "";
    }
  }

  useEffect ( () => {
    console.log("@Login mouting component");
    REACT_APP_URL_LOGIN_PROD = window.RequestVars.requestvar("REACT_APP_URL_LOGIN_PROD");

    if ( auth() ) {
      // this will be the dev token : 9f01a721-debc-40c2-b5d5-00b6c39cf9ee
      // to avoid looking in the localStorage
      dispatch( isLoggedIn(true) );
      nav("/");
    }
    else {
      // maybe send some params ,
      // do nothing.
    }
  },[]);

  const reconstitute_config = () => {
    console.log("@reconstitute_config");
  }

  const handleSubmit = (e) => {
    console.log("@handleSubmit");
    e.preventDefault();


    const input_value   = input.current.value.trim();
    input.current.value = "";

    const data = {
      key : input_value,
    };

    axios.post (REACT_APP_URL_LOGIN_PROD, data).then ( (msg) => {
      console.log ( msg );

      const msg_info    = msg.data.msg; 
      const account_info= msg.data.acc;
      const status_code = msg.data.status;

      console.log(account_info);

      if ( ok ( status_code ) ) {
        // @Incomplete redirect somewhere else
        // perhaps have something saved ...
        setStatus ( {content : msg_info, type : OK} );
        dispatch ( isLoggedIn(true) );

        const name_cache = account_info.name;
        const key_cache  = account_info.key;

        localStorage.setItem("name", account_info.name);
        localStorage.setItem("spec", account_info.spec);
        localStorage.setItem("key" , input_value);

        // set config.
        // @Incomplete.

        nav ("/");
      } else {
        setStatus ( {content : msg_info + "``" + input_value + "``.", type : ERR} );
      }
    }).catch ( (e) => {
      setStatus ( {content : "Something went wrong when connecting to the server.", type : ERR} );
    });

  }

  return (
    <>
      <Nav/>
      <div className="container-form-create">
        <form onSubmit={(e) => handleSubmit(e)}>
          <span className={compute_class_name()}>{status.content}</span>
          <br/>
          <label>Your Key</label>
          <br/>
          <input required type="text" placeholder="🗝️" ref={input}/>
          <div className="container-button-submit-sign-form">
            <button type="submit">Login</button>
          </div>
        </form>
      </div>
    </>
  )

}

export default Login;
