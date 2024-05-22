import { useState, useRef, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import Nav from "./Nav.js";
import auth from "./auth";
import {quicksort, levenshtein}  from "./utils.js";
import { useParams } from 'react-router-dom'
import useHotkeys from "@reecelucas/react-use-hotkeys";

import 'reactflow/dist/style.css';
import "./label.css"; import "./form.css";
import "./span.css";
import "./container.css";
import "./input.css";
import "./config.css";
import "./ta.css";
import "./svg.css";
import "./button.css";

// components
import IntentsListView from "./Components/IntentsListView";
import StatesListView  from "./Components/StatesListView";
import AnswersListView from "./Components/AnswersListView.js";
import ChoicesListView from "./Components/ChoicesListView.js";
import GraphView       from "./Components/GraphView.js";

import NewWindow from 'react-new-window'
import toast, { Toaster } from 'react-hot-toast';
import { useSelector, useDispatch } from 'react-redux';
import { isLoggedIn } from './isLoggedInSlice';

//docs : https://reactflow.dev/learn
import React, { useCallback } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from 'reactflow';
 
function Config() {

  const U_REDIRECT_VALUE = "unknown_redirect_value";
  const U_ONINTENT_VALUE = "unknown_on_intent_value";
  const SSTATE           = "sState";
  const SINTENT          = "sIntent";
  const ERRCON           = "error_connection";

  const time         = 2_000;
  const GRAPH        = 1;
  const FORM         = 2;
  const ANS_TYPE     = 1;
  const CHOICE_TYPE  = 2;
  const STATE_TYPE   = 4;
  const NOTHING_TYPE = 3;

  const OK           = 0;
  const WARNING      = 2;
  const DEFAULT      = -1;
  const ERR          = 1;

  // ref for intents
  const id_config   = useParams();
  const name_intent = useRef();
  const t_sentences = useRef();
  const nav         = useNavigate();

  const isLogged_in = useSelector((state) => state.logged_in.value);
  const dispatch    = useDispatch();

  // refs for status
  const name_status = useRef();
  const ans_status  = useRef();

  const forms_id    = [
    "intent",
    "state",
  ]
  const modes       = [
    "Several Answers",
    "Choices",
  ];

  // hot keys 
  useHotkeys("Control+d", () => {
    console.log("@hitting shotcut key control+d");
    handleDemo();
  });
  useHotkeys("Control+s", () => {
    console.log("@hitting shotcut key control+v");
    persistAll();
  });
  // hot keys [end]


  // query those vars from the electron app.
  let REACT_APP_URL_GET_CONFIG_ALL_PROD;
  let REACT_APP_URL_CREATE_CONFIG_DEMO;

  // to show to everyone
  const [mode_viz, setModeViz]                = useState ( FORM );
  const [loading_intent, setLoading_intent]   = useState ("");
  const [loading_state, setLoading_state]     = useState ("");
  const [loading, setLoading]                 = useState ( false );
  const [mode, setMode]                       = useState ({"current" : true}); // true if the current mode is answers
  const [modify_intent, setModify_intent]     = useState ( {content_idx : 0, status : false} );
  const [modify_state, setModify_state]       = useState ( {content_idx : 0, status : false, type : NOTHING_TYPE} ); // type : "ans" | "choice" | "Nothing", status -> if we're modifying stuff.
  const [redirect, setRedirect]               = useState ( "" );
  const [answers, setAnswers]                 = useState ( [] );
  const [states, setStates]                   = useState ( [] ); 
  const [onIntent, setOnIntent]               = useState ( "" );
  const [intents, setIntents]                 = useState ( [] );
  const [choices, setChoices]                 = useState ( [] );
  const [newWindowIntent, setNewWindowIntent] = useState(false);
  const [newWindowState, setNewWindowState]   = useState(false);
  const [nodes, setNodes, onNodesChange]      = useNodesState([]);
  const [edges, setEdges, onEdgesChange]      = useEdgesState([]);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  useEffect(() => {
    // laoding globals 
    window.RequestVars.requestvar("REACT_APP_URL_CREATE_CONFIG_DEMO").then((url) => {
      REACT_APP_URL_CREATE_CONFIG_DEMO = url;
    });
    window.RequestVars.requestvar("REACT_APP_URL_GET_CONFIG_ALL_PROD").then((url) => {
      REACT_APP_URL_GET_CONFIG_ALL_PROD = url;
    });

    // loading demos ?
    const storage = JSON.parse(localStorage.getItem("dconfig"));

    console.log("@storage >> "+JSON.stringify(storage));
    console.log("@storage.intents >> "+JSON.stringify(storage.intents));
    console.log("@storage.states  >> "+JSON.stringify(storage.states));

    setIntents(storage.intents);
    setStates(storage.states);

    /*
    const config        = {
      intents : intents,
      states  : states ,
    };
    */

    // computing config
    /* for the demo at school, since the backend is not finished.
    console.log("@id_config >> "+JSON.stringify(id_config.id));
    */
  },[]);


  useEffect(() => {
    if (mode_viz === GRAPH) {
      console.log("@computing nodes.");
      // transpiling all the states and intents
      // to nodes and edges.
      // and intent and state are linked through the onIntent state's attribute.

      var y_incremental    = 0;
      var x_incremental    = 0;
      var transpiled_nodes = [];
      var transpiled_edges = [];

      // mocking
      const states_cpy  = states;
      const intents_cpy = intents;

      intents_cpy.map((intent_) => {
        transpiled_nodes.push({
          id: intent_.name,
          position: {x: x_incremental, y: y_incremental},
          data: {label:"Intent :: " + intent_.name}
        });

        y_incremental += 50;
      });

      y_incremental  = 0;
      x_incremental += 175;

      states_cpy.map((state_) => {
        transpiled_nodes.push({
          id: state_.name,
          position: {x:x_incremental, y:y_incremental},
          data: {label:"State :: " + state_.name}
        });

        y_incremental += 50;
      });

      setNodes(transpiled_nodes);

      console.log("@Computing Edges.");
      // N^2
      states_cpy.map((state_) => {
        transpiled_edges.push({
          id: "e"+state_.name+"-"+state_.onIntent,
          source: state_.onIntent.name,
          target: state_.name,
          label: "If " + state_.onIntent.name
        });
        
        state_.choices.map((choice) => {
          transpiled_edges.push({
            id: "e"+state_.name+"-"+choice.redirect_value.name,
            source: state_.name,
            target: choice.redirect_value.name,
            label: "If click "+choice.name
          });
        });
      });

      setEdges(transpiled_edges);
    }
    else {
      // do nothing
    }
  }, [mode_viz]);

  const toggleModeViz = () => {
    setModeViz(mode_viz === GRAPH ? FORM : GRAPH);
  }

  /*
  const reconstitute_config = () => {
    console.log("@reconstitute_config");
    // make request
    // parse the content
    // useState
    const key  = localStorage.getItem("key")
    const data = { key : key };

    console.log("@data " + JSON.stringify(data));
    console.log("@key" + key);

    axios.post(REACT_APP_URL_GET_CONFIG_ALL_PROD, data).then( (r) => {
      console.log ( r );

      const config_obj  = r.data.config;
      const states_arr  = config_obj.states;
      const intents_arr = config_obj.intents;

      setStates (states_arr );
      setIntents(intents_arr);

    }).catch ( (e) => {
      toast.error("Something went wrong when connecting to the server. Couldn't restitute config file.", {id : "networking err" });
    });
  }
  */

  const toggleMode = () => {
    console.log ( "@toogleMode" );

    const nbool               = !mode.current;
    ans_status.current.value  = "";

    setMode ({
      "current" : nbool,
    });
  }

  const verify_if_intent_exist = ( name ) => { 
    const arr_only_names = intents.map ( (i) => i.name );
    return arr_only_names.includes ( name );
  }
  
  const handleSubmitIntent = (e) => {
    console.log ( "@handleSubmitIntent" );

    e.preventDefault();

    // getting the values in a temp
    const name_value         = name_intent.current.value;
    const t_sentences_value  = t_sentences.current.value;
    const arr                = t_sentences_value.split ( "\n" );

    if ( !verify_if_intent_exist(name_value) ) {

      // trigger reset of all the inputs
      const curr_form_id = "intent";
      reset_inputs(curr_form_id);

      let nintent = {
        "name"              : name_value,
        "trainingSentences" : arr,
      };

      if ( modify_intent.status ) {
        const idx_mod = modify_intent.content_idx;

        const nintent_arr = intents.map ( (el, idx) => {
          if ( idx === idx_mod ) {
            return nintent;
          }
          else {
            return el;
          }
        });

        setIntents(nintent_arr);
        setModify_intent ( {content_idx : 0, status: false } );
        toast.success("Modified Intent with name ``" + name_value + "``", {id : "mod ok intent" });
      }
      else {
        setIntents( [...intents, nintent] );
        toast.success("Added new Intent with name ``" + name_value + "``", {id : "add intent" });
      }
    } else {
      toast.error("Intent with name ``" + name_value + "`` already exists.", {id : "500 intent" });
    }
  }

  const handleChangeIntent = (intent_to_change, idx) => {
    console.log ("@handleChangeIntent");

    const curr_form_id = "intent";
    reset_inputs ( curr_form_id );
    
    name_intent.current.value = intent_to_change.name;
    t_sentences.current.value = intent_to_change.trainingSentences.join("\n");

    setModify_intent ( {content_idx : idx, status : true } );
    toast.custom(<div>{"⚠️ Modifying intent with name ``" + intent_to_change.name + "``"}</div>, {id : "mod curr intent" }); // this is the warning one
  }
  
  const deleteIntent = ( i, event ) => {
    // must stop the event from propagating
    console.log ( "@deleteIntent" );

    event.cancelBubble = true;
    if ( event.stopPropagation ) event.stopPropagation();

    const intent_selected = intents[i];
    const nintent_arr     = intents.filter ( (_, idx) => idx !== i );

    setIntents ( nintent_arr );
    toast.success("Deleted Intent with name ``" + intent_selected.name + "``", {id : "del intent" });

    const curr_form_id = "intent";
    reset_inputs ("intent");
  }

  const appendMultAns = () => {
    console.log( "@appendMultAns" );

    const content   = ans_status.current.value;
    ans_status.current.value = "";

    console.log ( "@content " + content );

    if ( !(content === "") ) {
      // check if we're Modifying
      if ( modify_state.status ) {

        // check if we're modifying the ans
        if ( modify_state.type === ANS_TYPE ) {

          console.log ( "@appendMultans @ANS_TYPE" );
          const idx      = modify_state.content_idx;
          const nanswers = answers.map ( (_, i) => {
            if ( i === idx ) {
              return content;
            }
          });

          setAnswers( nanswers );
          setModify_state( {content_idx : 0, status : false, type : NOTHING_TYPE});
          toast.success("Updated Answer with content ``" + content + "``", {id : "upt state" });
        }
      }

      setAnswers( [...answers, content] );
      toast.success("Added new Answer with content ``" + content + "``", {id : "add state" });
    }

  }
  
  const appendChoices = () => {
    console.log( "@appendChoices" );

    const content_choice = ans_status.current.value.trim();
    const redirect_value = redirect;

    const is_valid_redirect_value = verify_redirect_value_gross();
    const is_content_choice       = content_choice !== "";

    const nchoice = {
      content : content_choice,
      redirect_value : redirect,
    };

    // ,but b4 resetting, you should maybe disable that !
    if ( is_valid_redirect_value && is_content_choice ){
      ans_status.current.value      = "";
      // check if modifying
      if ( modify_state.status ) {
        // check whiich type are we modifying
        if ( modify_state.type === CHOICE_TYPE ) {
          const idx      = modify_state.content_idx;
          const nchoices = choices.map ( (_, i) => {
            if ( i === idx ) {
              return nchoice;
            }
          });

          setChoices( nchoices );
          setModify_state( {content_idx : 0, status : false, type : NOTHING_TYPE} );
          toast.success("Updated Choice with content ``" + content_choice + "``", {id : "upt choice" });
        }
        else {
          setChoices( [...choices, nchoice] );
          toast.success("Added new Choice with content ``" + content_choice + "``", {id : "add choice" });
        }
      }
    } 
    else {  
      if (is_valid_redirect_value){
        toast.error("Cannot submit an empty choice content.", {id:"empty choice content"});
      } else {
        toast.error("Cannot submit an non-existant redirect value.", {id:U_REDIRECT_VALUE});
      }
    }
  }

  const reset_inputs = (type_form) => {
    if ( type_form === "intent" ) {
      name_intent.current.value = "";
      t_sentences.current.value = "";
    }
    else if ( type_form === "state" ) {
      ans_status.current.value      = "";
      name_status.current.value     = "";
      setRedirect ( "" );
      setOnIntent ( "" );
    }
  }

  const verify_if_intent_gross = () => {

    const intents_names = intents.map ( ( i ) => {
        return i.name
    });

    var ret_bool = false;
    var ret_int  = undefined;

    for ( let i = 0; i < intents_names.length; i ++ ) {
      if ( intents_names[i] === onIntent ) {
        ret_bool = true;
        ret_int  = intents[i];
      }
      else continue;
    }

    return [ret_bool, ret_int];
  }


  const verify_choices = (arr) => {
    // frst check if we have choicews
    // we configure array of choices redirect only
    if (arr.length !== 0) {
      const arr_names = arr.map ( (c) => {
        return c.redirect_value;
      });

      // for each of those redirects we check
      // if the states pointers are existing
      const states_names = states.map ( (state) => {
        return state.name;
      });

      for ( let i = 0; i < arr_names.length; i++ ) {
        if ( !states_names.includes(arr_names[i]) ) {
          toast.error("Unknown state @choice with name ``" + arr_names[i] + "``", {id : "unknw choice" });
          return [arr[i], false];
        }
      };

      return ["", true];
    } else {
      return   ["", true];
    }
  }

  // @Incomplete something wrong about submitting incorrect choices.
  const handleSubmitState = (e) => {
    console.log ("@handleSubmitState");

    e.preventDefault();

    const name_value      = name_status.current.value;
    const answers_value   = answers;
    const choices_value   = choices;

    //@Incomplete, check on the client side if the buttons
    //are redirecting corretly.
    
    var [is_valid_on_intent, ret_intent] = verify_if_intent_gross();
    is_valid_on_intent                   = is_valid_on_intent || (onIntent === "");

    // if we have no choices then dont look into the redirects.
    // @Incomplete to test
    const [ret_choice, is_choices] = verify_choices( choices_value );
    console.log("@is_valid_choices " + is_choices);
    console.log("@is_valid_on_intent " + is_valid_on_intent);

    const nstate = {
      "name"     : name_value,
      "answers"  : answers_value,
      "choices"  : choices,
      "onIntent" : ret_intent,
    };

    if ( is_valid_on_intent && is_choices ) {
      // check if we're currently modifying something
      if ( modify_state.type === STATE_TYPE ) {
        const nstates_arr = states.map ( (state, i) => {
          if ( i === modify_state.current_idx ) {
            return nstate;
          }
        });

        setStates ( nstates_arr );
        toast.success("Modified state ``" + name_value + "``", {id : "mod state" });
      }
      else {
        setStates ( [...states, nstate] );
        toast.success("Added new state ``" + name_value + "``", {id : "add state" });
      }

      // resets
      setChoices( [] );
      setAnswers( [] );

      const current_form_id = "state";
      reset_inputs ( current_form_id );

    }
    else { 
      // that means that the choices are wrong
      // however this one you can't dismiss it.
      if( is_valid_on_intent ) {
        toast.error("Unknown redirect value in choice ``" + ret_choice.redirect_value + "``", {id : U_REDIRECT_VALUE });
      } else {
        // means that the onIntent is invalid
        // if we click on the dismiss we add the state.
        toast.error("Unknown onIntent value ``" + onIntent + "``", {id : U_ONINTENT_VALUE});
      }
    }
  }

  const verify_redirect_value_gross = ()  => {
    const redirect_names = states.map ( (el) => {
      return el.name;
    });

    return redirect_names.includes(redirect);
  }

  // return true -> OK, false -> NO
  const verify_redirect_value = ( event ) => {
    const redirect_value = event.target.value;
    setRedirect ( redirect_value );

    const redirect_names = states.map ( (el) => {
      return el.name;
    });

    const is_containing = redirect_names.includes ( redirect_value );
    is_containing ? toast.success("Redirect value with name ``" + redirect + "`` is valid", {id : "valid redr" }) : toast.error("Redirect value with name ``" + redirect + "`` is non-existent", {id :  U_REDIRECT_VALUE });
  }

  const handleChangeChoice  = (choice,  idx) => {
    console.log ( "@handleChangeChoice" );

    // same as handleChangeMultAns

    const content_choice     = choice.content;
    ans_status.current.value = content_choice; 

    setRedirect(choice.redirect_value);

    setModify_state ( {content_idx : idx, status : true, type : CHOICE_TYPE });
    toast.custom(<div>{"⚠️  Modifying Choice ``" + content_choice + "``"}</div>, {id : "mod curr choice" }); // this is the warning one
  }

  const handleChangeMultAns = (ans, idx) => {
    console.log ( "@handleChangeMultAns" );

    // you don't want to reset 
    // everything
    // since we're only changing one answer
    ans_status.current.value = ans;

    setModify_state ( {content_idx : idx, status : true, type : ANS_TYPE} );
    toast.custom(<div>{"⚠️  Modifying Answer ``" + ans + "``"}</div>, {id : "mod curr ans" }); // this is the warning one
  } 

  const deleteChoice = (i, e) => {
    console.log ( "@deleteChoice" );

    e.cancelBubble = true;
    if ( e.stopPropagation ) e.stopPropagation();

    const choice_selected = choices[i];
    const nchoice_arr     = choices.filter ( (_, idx) => idx !== i );

    setChoices ( nchoice_arr );
    toast.success("Deleted Choice with name ``" + choice_selected.name + "``", {id : "del choice" })

    // reset
    ans_status.current.value = "";
    setRedirect ( "" );

  }

  const deleteMultAns = (i, e) => {
    console.log ( "@deleteMultAns" );

    e.cancelBubble = true;
    if ( e.stopPropagation ) e.stopPropagation();

    const ans_selected = answers[i];
    const nans_arr     = answers.filter ( (_, idx) => idx !== i );

    setAnswers ( nans_arr );
    toast.success("Deleted ans with name ``" + ans_selected + "``", {id : "del ans" })

    // reset
    ans_status.current.value = "";

  }

  const verify_if_intent = ( event ) => {
    console.log("@verify_if_intent.");

    const nOnIntent = event.target.value;
    setOnIntent ( nOnIntent );

    const intents_names = intents.map ( ( i ) => {
      return i.name;
    });

    const is_containing = intents_names.includes ( nOnIntent );
    is_containing 
      ? 
      toast.success("onIntent with name ``" + nOnIntent + "`` is valid", {id :  U_ONINTENT_VALUE}) 
      :
      toast.error("onIntent with name ``" + nOnIntent + "`` is non-existent.", {id : U_ONINTENT_VALUE });
  }

  const persistAns = (i, e) => {

    e.cancelBubble = true;
    if ( e.stopPropagation ) e.stopPropagation();

    const nans_value = ans_status.current.value;

    // reset the answer input
    ans_status.current.value = "";

    const narr_ans   = answers.map ( (_, idx) => {
      if ( idx === i ) { 
        return nans_value;
      }
    });

    setAnswers( narr_ans );

  }

  const persistChoice = (i, e) => {
    e.cancelBubble = true;
    if ( e.stopPropagation ) e.stopPropagation();

    const nchoice_value = ans_status.current.value;

    // reset the answer input
    ans_status.current.value = "";

    const narr_choice = choices.map ( (_, idx) => {
      if ( idx === i ) { 
        return nchoice_value;
      }
    });

    setChoices( narr_choice );

 }

  const list_answers = 
    answers.map ( (ans, idx) => 
      <div key={idx} className="answers-pool-child" title="Click to modify Answer" onClick={() => {handleChangeMultAns(ans, idx)}}>
        <span key={idx+1}>Answer :: {ans}</span><br/>
        <hr/>
        {
          modify_state.type === ANS_TYPE ?
          <button type="button" onClick={(e) => persistAns(idx, e)}>{modify_intent.status ? "Create Intent" : "Modify New"}</button>
          :
          <button type="button" onClick={(e) => deleteMultAns(idx, e)}>
            Close/Delete
          </button>
        }
          
      </div>
    );

  const list_choices = 
    choices.map ( (choice, idx ) => 
      <div key={idx} className="choices-pool-child" title="Click to modify choice" onClick={() => {handleChangeChoice(choice, idx)}}>
        <span key={idx + 1}>Choice's content :: {choice.content}</span><br/>
        <span key={idx + 2}>redirect onClick :: {choice.redirect_value}</span><br/>
        <hr/>
        {
          modify_state.type === CHOICE_TYPE ?
          <button type="button" onClick={(e) => persistChoice(idx, e)}>
            Persist Choice
          </button>
          :
          <button type="button" onClick={(e) => deleteChoice(idx, e)}>
            Close/Delete
          </button>
        }
      </div>
    );

  
  const handleChangeState = (state, i) => {
    console.log( "@handleChangeState" );

    const curr_form_id = "state";
    reset_inputs ( curr_form_id );
    
    name_status.current.value = state.name;
    // setRedirect(state.redirect);  // this is with the choice object

    setChoices( state.choices );
    setOnIntent(state.onIntent);
    setAnswers( state.answers );

    setModify_state ( {content_idx : i, status : true, type : STATE_TYPE} );
    toast.custom(<div>{"⚠️ Modifying state with name ``" + state.name + "``"}</div>, {id : "mod curr state" }); // this is the warning one

  }

  const deleteState = (i, e) => {
    console.log( "@deleteState" );

    e.cancelBubble = true;
    if ( e.stopPropagation ) e.stopPropagation();

    const state_selected = states[i];
    const nstate_arr       = states.filter ( (_, idx) => idx !== i );

    setStates ( nstate_arr );
    toast.success("Deleted State with name ``" + state_selected.name + "``", {id : "del state" });

    // reset
    const curr_form_id = "state";
    reset_inputs(curr_form_id);

  }

  const list_states =
    states.map ( (state, idx ) => (
    <div key={idx} className="states-pool-child" title="Click to modify" onClick={() => handleChangeState(state, idx)}>
      <span key={idx+1}>State's name      :: {state.name}</span><br/>
      <span key={idx+2}>Number of choices :: {state.choices !== undefined ? state.choices.length : "Nothing to see here."}</span><br/>
      <span key={idx+3}>Number of answers :: {state.answers !== undefined ? state.answers.length : "Nothing to see here."}</span><br/>
      <span key={idx+4}>Execute when      :: {state.onIntent.name} is met.</span><br/>
      <hr/>
      <button type="button" onClick={(e) => deleteState( idx, e ) }>Close/Delete</button>
    </div>
  ));

  // persist the config to the main bot.
  const persistAll = () => {
    console.log ("@persistAll...");
    /*
    const api_key = localStorage.getItem("key");

    if ( api_key !== undefined ) {

      // real data.
      const choices_dt = choices;
      const intents_dt = intents;

      const intents_dt_mock = [
        {name : "test_intent first", lenght_blob : 55, content_array : ["fskjfskjf", "fksjfksj", "skjfksjfs"]},
      ];

      const states_dt_mock = [
        {name : "test_state first", answers : ["fksjfksj", "fksjfskfj", "fklsjfksjf"], redirect : "", choices : [
          { content :"Test", redirect_value : "test" }
        ], onIntent : "test_intent first"},
      ];

      const data = { 
        "states"  : states_dt_mock,
        "intents" : intents_dt_mock,
      }

      console.log ("@data_mock" + data );

      setLoading( true );

      axios.post (URL_PERSIST_CONFIG + "?api_key=" + api_key , data).then (
        (r) => {
          console.log ("@r " + r);
        }
      ).catch ( ( e ) => {
        console.log ("@e " + e);
      });

      setLoading( false );
    }
    else {
      // you need an api keys ?!
      setStatus_global ({content : "You need an api_key🗝️", type : ERR });
    }

    */
  }

  const search_by_intent_name = (n2) => {
    console.log("@search_by_intent_name");

    toast.loading ("Searching intents...", {id : SINTENT});
    const narr_scores = intents.map ( (element) => {
      const n1    = element.name;
      const score = levenshtein(n1, n2);
      const ret   = {
        "current_element" : element,
        "score"           : score,
      };
      return (ret);
    });

    const init_mapping_sorted = quicksort(narr_scores).map ( (element) => element.current_element );
    setIntents( init_mapping_sorted );
    toast.success ("Found intents", {id : SINTENT});
  }

  const search_by_state_name  = (n2) => {
    console.log("@search_by_state_name");

    toast.loading ("Searching states...", {id : SSTATE});
    const narr_scores = states.map ( (element) => {
      const n1    = element.name;
      const score = levenshtein(n1, n2);
      const ret   = {
        "current_element" : element,
        "score"           : score,
      };
      return (ret);
    });

    const init_mapping_sorted = quicksort(narr_scores).map ( (element) => element.current_element );
    setStates( init_mapping_sorted );
    toast.success ("Found states", {id : SSTATE});
  }

  // demo the current config
  const handleDemo = () => {
    console.log("@handleDemo");
    // saves the whole stuff in the localStorage
    const intents_value = intents;
    const states_value  = states;
    const config        = {
      intents : intents,
      states  : states ,
    };

    console.log("@handleDemo(states)  " + JSON.stringify(intents));
    console.log("@handleDemo(intents) " + JSON.stringify(states));
    console.log("@dconfig >> "+JSON.stringify(config));

    localStorage.setItem("dconfig", JSON.stringify(config)); // dconfig for demo-config
    
    toast.promise(
      axios.post (REACT_APP_URL_CREATE_CONFIG_DEMO, config),
      {
        loading : "Saving the demo-config RAM...",
        success : "Settings saved",
        error   : "Couldn't save the settings.",
      },
      {id: ERRCON}
    );
  }

  const haultWindowIntents = () => {
    const curr = newWindowIntent;
    setNewWindowIntent(!curr);
  };
  const haultWindowStates  = () => {
    const curr = newWindowState;
    setNewWindowState(!curr);
  };

  return (
    <div className="upper-container">
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
      <button onClick={persistAll}>
        Persist To Central(Ctrl + s)
      </button>
      <button onClick={handleDemo}>
        Persist To Demo (Ctrl + d)
      </button>
      <button onClick={toggleModeViz}>
        Toggle mode
      </button>
      <span>
        ( Current mode : {mode_viz === GRAPH ? "Graph/Scroll to zoom." : "Form/CtrlShift+, Ctrl- to zoom."})
      </span>
      {
        mode_viz === FORM ?
        <div className="parent-container">
          <div className="intents-container">
            <form className="splitted-form-at-config" onSubmit={( e ) => handleSubmitIntent ( e )}>
              <h1> Intents-form </h1>
              <br/>
              <label>Choose the intent's name</label>
              <br/>
              <input required ref={name_intent} type = "text" placeholder = "Intent's name"/>
              <br/>
              <label>Input training_sentences</label>
              <br/>
              <textarea required ref={t_sentences} type = "text"/>
              <br/>
              <div className="submit-button-form-container">
                <button type="submit">{modify_intent.status ? "Persist Intent" : "Submit Intent"}</button>
              </div>
              <hr/>
              <div className="intents-pool-container">
                <button onClick={haultWindowIntents} type="button">
                  Open in new window
                </button>
                { !newWindowIntent ?
                  <>
                    <input onChange={(e) => search_by_intent_name(e.target.value)} type = "text" placeholder = "Search By Intent Name 🔎"/>
                    <IntentsListView 
                      intents={intents}
                      handleChangeIntent={handleChangeIntent} 
                      deleteIntent={deleteIntent}/>
                  </>
                  :
                  <NewWindow onUnload={haultWindowIntents} name="Intents View" title="Intents View">
                    <input onChange={(e) => search_by_intent_name(e.target.value)} type = "text" placeholder = "Search By Intent Name 🔎"/>
                    <IntentsListView 
                      intents={intents}
                      handleChangeIntent={handleChangeIntent} 
                      deleteIntent={deleteIntent}/>
                  </NewWindow>
                }
              </div>
            </form>
          </div>

          <div className="states-container">
            <form className="splitted-form-at-config" onSubmit={(e) => handleSubmitState(e)}>
              <h1>
                States-form
              </h1>
              <br/>
              <label>Choose the State's name</label>
              <br/>
              <input required ref={name_status} type = "text" placeholder = "State's name"/>
              <br/>
              <button type="button" onClick={toggleMode}>Toggle Mode</button> <span>(current = { mode.current ? modes[0] : modes[1] })</span> 
              <br/>
              <input className="expect-answers-input" ref={ans_status} type = "text" placeholder = {mode.current ? "Enter Answer(s)" : "Enter Choice(s) content"}/> 

              { ! mode.current ? <input className="expect-answers-input" required type="text" placeholder="Redirect to State" value={redirect} onChange={(e) => verify_redirect_value(e)} /> : "" }
              { mode.current ? <button type="button" onClick={appendMultAns}> ➕ </button> : <button type="button" onClick={appendChoices}> ➕  </button> }

              <div className="mult-pool-container">
                { mode.current ?
                  <AnswersListView
                    answers={answers}
                    handleChangeMultAns={handleChangeMultAns}
                    persistAns={persistAns}
                    deleteMultAns={deleteMultAns}
                    modify_state={modify_state}
                    modify_intent={modify_intent}
                    ANS_TYPE={ANS_TYPE}
                  />
                  :
                  <ChoicesListView
                    choices={choices}
                    handleChangeChoice={handleChangeChoice}
                    persistChoice={persistChoice}
                    modify_state={modify_state}
                    CHOICE_TYPE={CHOICE_TYPE}
                  />
                }
              </div>
              <br/>
              <label>Execute when intent.</label><br/>
              <input value={onIntent} onChange={(e) => verify_if_intent(e)} placeholder = "Execute When Intent"/>
              <br/>
              <div className="submit-button-form-container">
                <button type="submit">{modify_state.type === STATE_TYPE ? "Persist State" : "Submit State"}</button>
              </div>
              <br/>
              <hr/>
              <div className="states-pool-container">
                <button onClick={haultWindowStates} type="button">
                  Open in new window
                </button>
                { !newWindowState ?
                  <>
                    <input onChange={(e) => search_by_state_name(e.target.value)} type = "text" placeholder = "Search By State Name 🔎"/>
                    <StatesListView 
                      states={states} 
                      handleChangeState={handleChangeState} 
                      deleteState={deleteState}/>
                  </>
                  :
                  <NewWindow onUnload={haultWindowStates} name="States View" title="States View">
                    <input onChange={(e) => search_by_state_name(e.target.value)} type = "text" placeholder = "Search By State Name 🔎"/>
                    <StatesListView 
                      states={states} 
                      handleChangeState={handleChangeState} 
                      deleteState={deleteState}/>
                  </NewWindow>
                }
              </div>
            </form>
          </div>
        </div>
      : 
      <GraphView
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
      />
    }
  </div>
  );
}

export default Config;
