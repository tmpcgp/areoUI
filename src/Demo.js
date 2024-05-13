import { useState, useRef, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import Nav from "./Nav.js";
/*
import "./config.css";
import "./ta.css";
import "./container.css";
import "./input.css";
import "./label.css";
import "./form.css";
import "./span.css";
import "./svg.css";
import "./button.css";
*/

import "./demo.css";
import { useSelector, useDispatch } from 'react-redux';
import auth from "./auth";
import { socket } from "./socket";
import { isLoggedIn } from './isLoggedInSlice';
import toast, { Toaster } from 'react-hot-toast';
import { REACT_APP_URL_RESTART_SERVER } from './globals.js';

function Demo() {

  const RESTART     = "restart_server";
  const C_MSG       = "clearMsgs";

  const conv_id                   = "somewierdandlongid";
  const msg                       = useRef();
  const dispatch                  = useDispatch();
  const [messages, setMessages]   = useState([]); 
  const [state_conv, setState_conv] = useState("Initiating Conversation...");
  const [connected, setConnected] = useState(false);
  var username                    = "[Some Ordinary Human]";

  const restart_server = () => {
    console.log("@restart_server");
    toast.promise (
      axios.get( REACT_APP_URL_RESTART_SERVER  ),
      {
        loading:"Restarting the server.",
        success:"Restarted the server.",
        error  :"Something went wrong when connecting to the server.",
      }, {id:RESTART}
    );

    clearMsgs();
  }

  const send = (type, message) => {
    console.log("@send");

    switch (type) {
      case "text": {

        const botMessage = {
            message: message,
            username: username,
        };

        socket.emit('user_message', botMessage);
        break;
      }

      case "button": {

        const botMessage = {
          selectedValue: message,
          username: username,
        };

        socket.emit('user_button_click', botMessage);
        break;
      }

      default:
        console.log( "Something went wrong. @send type is not existant ``" + type + "``" );
    }
  }

  useEffect (() => {

    if ( auth() ) {
      username = localStorage.getItem("name");
      dispatch ( isLoggedIn(true) );
    } else { 
      // set the username to soemthing else
      username = "tester";
    }

    socket.connect();

    socket.on('connect_error', error => {
      console.log("Cannot connect to the Xatkit server");
      setConnected ( false );
      toast.error("Something went wrong when connecting to the server.", {id : "err_conn_fail"});
    });
    socket.on('connect', () => {
      setConnected( true );
      // @Incomplete to do.
      socket.emit('init', {
        hostname: window.location.hostname,
        url: window.location.href,
        origin: window.location.origin,
        conversationId : ""
      });
    });
    socket.on('init_confirm', (session) => {
      console.log("@init_confirm " + JSON.stringify( session ));
    });
    socket.on('bot_message', (message) => {
      console.log("onBotMessage type text " + JSON.stringify(message) );
      const nmsg = {
        content : message.message,
        you     : false,
        buttons : message.quickButtonValues,
      };

      setMessages( prev => [...prev, nmsg] );
    });
    socket.on('link_snippet_with_img', (message) => {
      console.log("onBotMessage type miniCard " + JSON.stringify(message));
    });
    socket.on("audio", (message) => {
      console.log("@onBotMessage type audio " + JSON.stringify(message));
    }); 

    const onConnect = () => { setConnected( true ); }
    const init_info = () => { console.log("@init"); }
    const onERR     = () => {
      toast.error ("Connection with the server is lost.", {id : "err_lost_conn"});
    }

    const bot_msg_info       = () => { console.log("@bot_msg_info"); }
    const bot_msg_img_info   = () => { console.log("@bot_msg_img_info"); }
    const bot_msg_audio_info = () => { console.log("@bot_msg_audio_info"); }

    return () => {
      socket.off ('connect'              , onConnect);
      socket.off ('connect_error'        , onERR);
      socket.off ('init_confirm'         , init_info);
      socket.off ('bot_message'          , bot_msg_info);
      socket.off ('link_snippet_with_img', bot_msg_img_info);
      socket.off ('audio'                , bot_msg_audio_info);
    }

  },[]); 

  const handleMsg = () => {
    console.log("@handleMsg");
    const msg_value   = msg.current.value;
    msg.current.value = "";
    
    const nmsg = {
      content : msg_value,
      you     : true,
      buttons : []
    };

    setMessages(prev => [...prev, nmsg]);

    // send the msg to the bot
    const type = "text";
    send( type, msg_value );
  }

  const generic_button_onClick = (button_str, i) => {
    console.log("@generic_button_onClick");
  }

  const compute_class_name = (you) => {
    let acc = "bubble ";
    acc    += (you ? "you" : "me");
    return acc;
  }

  const list_msgs = messages.map ( (msg, idx) =>
    <div key={idx} className={compute_class_name(msg.you)}>
      <div key={idx + 1} className="chat-bubble">
        {msg.content}
      </div>
      
    </div>
  );

  const clearMsgs = () => {
    console.log("@clearMsgs");
    setMessages( [] );
    toast.success("Messages cleared.", {id : C_MSG});
  }

  return (
    <div className="container-container">
      <div><Toaster position="top-center" reverseOrder={false} 
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
      <h1>
        Demo ``Xatkit chatting with {username}``
      </h1>
      <div className="container-dialog">
        <input onChange={(e) => setState_conv("Responding...")} type="text" ref={msg} placeholder="Input something"/>
        <button onClick={handleMsg}>
          Send
        </button>
        <button onClick={restart_server}>
          Restart the server.
        </button>
      </div>
      <div className="chat-container">
        {list_msgs}
      </div>
   </div>
  )
}

export default Demo;
