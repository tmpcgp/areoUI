import toast, { Toaster } from 'react-hot-toast';
import { useState, useRef, useEffect } from 'react';
import Nav from "../Nav.js";
import axios from 'axios';
import "./ConfigsPanel.css";
import ConfigsListView from "./ConfigsListView";

import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

function ConfigsPanel() {

  var REACT_APP_URL_GET_CONFIG_ALL_PROD;
  var REACT_APP_URL_CREATE_CONFIG_PROD;

  const ERRCON         = "error_connection";
  const U_CONFIG_VALUE = "config-error";

  const [configs, setConfigs] = useState([]); // those dont contains the real config, just id, name, states.length, intents.length.
  const [valueInput, setValueInput] = useState("");
  const [config_create, setConfig_create] = useState(false);
  const valueInputRef = useRef();

 
  const handleCreateConfigProfile = (e) => {
    setConfig_create(true);
  }

  const handleDisplayConfigsProfiles = (e) => {
    setConfig_create(false);
  }

  const verify_if_config_name = (name) => {
    console.log("@verify_if_config_name");
    setValueInput(name);

    const config_names = configs.map ((config) => {
      return config.name;
    });

    const is_containing = config_names.includes(name);
    is_containing 
      ? 
      toast.error("Config with name ``"+name+"`` is already created", {id :  U_CONFIG_VALUE}) 
      :
      toast.success("Config with name ``"+name+"`` is valid.", {id : U_CONFIG_VALUE});
  }
  
  const handleSubmit = (e) => {
    console.log("@hanldeSubmit");
    e.preventDefault();

    // getting the value
    const value  = valueInput;
    const config = {
      id : Math.random()*100+1,
      name : value,
      note : valueInputRef.current.value,
      states_length : 0,
      intents_length : 0,
    }

    setValueInput("");
    valueInputRef.current.value = "";

    setConfigs([...configs, config]);
    handleDisplayConfigsProfiles(null);
    // making an axios request
    // need url config/create
    /* Incomplete need to supply the id ?
    toast.promise(
      axios.get(REACT_APP_URL_CREATE_CONFIG_PROD),
      {
        loading : "Saving Configs Profiles.",
        success : (data) => {
          console.log("@data "+JSON.stringify(data));
        },
        error   : "Couldn't Save Configs Profiles.",
      },
      {id: ERRCON}
    );
    */

  }

  useEffect(()=>{
    console.log("@component(ConfigsPanel) Is Mouting.");

    // @Incomplete need to supply the id of the user.
    /*
    const promise = window.RequestVars.requestvar("REACT_APP_URL_GET_CONFIG_ALL_PROD").then((url) => {
      toast.promise(
        axios.get(url),
        {
          loading : "Fetching Configs Profiles.",
          success : (data) => {
            console.log("@data "+JSON.stringify(data));
          },
          error   : "Couldn't Fetch Configs Profiles.",
        },
        {id: ERRCON}
      );

      REACT_APP_URL_GET_CONFIG_ALL_PROD = url;
    }).catch((e) => {
    });
    */

    // loading all the url's needed.
    window.RequestVars.requestvar("REACT_APP_URL_CREATE_CONFIG_PROD").then((url)=>{
      REACT_APP_URL_CREATE_CONFIG_PROD = url;
    });

    const mock = [
      {id:1, name:"title", states_length:55, intents_length:55, note : "Something about chickens"},
      {id:2, name:"ethingelse", states_length:5, intents_length:56, note : "A lot boutvriables"},
      {id:3, name:"hingelse", states_length:5, intents_length:56, note : "A lot abut vrles"},
      {id:4, name:"hingelse", states_length:5, intents_length:56, note : "A lot abut variables"},
      {id:5, name:"thnelse", states_length:5, intents_length:56, note : "A lot abo vrales"},
      {id:6, name:"somnelse", states_length:5, intents_length:56, note : "A lot abut variables"},
      {id:6, name:"somnelse", states_length:5, intents_length:56, note : "A lot abut variables"},
      {id:594, name:"somnelse", states_length:5, intents_length:56, note : "A lot abut variables"},
      {id:598, name:"somnelse", states_length:5, intents_length:56, note : "A lot abut variables"},
      {id:548, name:"somnelse", states_length:5, intents_length:56, note : "A lot abut variables"},
      {id:59, name:"somnelse", states_length:5, intents_length:56, note : "A lot abut variables"},
      {id:58, name:"somnelse", states_length:5, intents_length:56, note : "A lot abut variables"},
      {id:48, name:"somnelse", states_length:5, intents_length:56, note : "A lot abut variables"},
      {id:538, name:"somnelse", states_length:5, intents_length:56, note : "A lot abut variables"},
      {id:5590434, name:"somnelse", states_length:5, intents_length:56, note : "A lot abut variables"},
      {id:89573, name:"somnelse", states_length:5, intents_length:56, note : "A lot abut variables"},
      {id:428, name:"somnelse", states_length:5, intents_length:56, note : "A lot abut variables"},
      {id:7, name:"someese", states_length:5, intents_length:56, note : "A lot briables"},
      {id:8, name:"somhlse", states_length:5, intents_length:56, note : "A lot aboutles"}
    ];

    setConfigs([...configs, ...mock]);
  },[]);
  
  return (
  <div className="container">
    <Toaster
      position     = {"botton-right"}
      reverseOrder = {false}
      toastOptions = {{
        style:{
          border      : "1px solid #87ceeb",
          padding     : "16px",
          color       : "black",
          fontFamily  : 'Reddit Mono',
        }
      }}
    />
    <Nav/>
    <h1>
        Choose A Config Profile.
    </h1>
    {!config_create ?
      <div className="listing">
        <ConfigsListView 
          configs={configs}
          setConfigs={setConfigs}
        />
        <button onClick={handleCreateConfigProfile} type="button">
          Create Your Own Config Profile.
        </button>
      </div>
      :
      <form onSubmit={(e) => handleSubmit(e)}>
        <h2>Config Profile Form</h2>
        <br/>
        <label>Config Name</label>
        <br/>
        <input required type="text" placeholder="Name Your Config Profile" onChange={(e) => verify_if_config_name(e.target.value)} value={valueInput}/>
        <br/>
        <label>Config Note</label>
        <br/>
        <input title="Why Is This Config So Special" type="text" placeholder="Tell Us Something About This Config" ref={valueInputRef}/>
        <div className="container-button-submit-sign-form">
          <button type="submit">Create Config Profile</button>
          <button type="button" onClick={handleDisplayConfigsProfiles}>View Configs Profiles</button>
        </div>
      </form>
    }
  </div>
  );
}


export default ConfigsPanel;
