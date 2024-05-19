import "./ConfigsListView.css";
import { useState, useRef, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import {quicksort, levenshtein}  from "../utils.js";
import PaginationControlled from "./PaginationControlled";
import { useNavigate } from "react-router-dom";
import TextField from '@mui/material/TextField';


function ConfigsListView({configs, setConfigs}) {

  const nav             = useNavigate();
  const [page, setPage] = useState(1);
  const SINTENT         = "sIntent";
  const U_CONFIG_VALUE  = "config-error";
  const size_t_max      = 6;

  const compute_pagination_size = () => {
    const usize = configs.length;
    const value = Math.ceil(usize / size_t_max);

    return value;
  }

  const handleDeleteConfigProfile = (event, id) => {
    console.log("@handleDeleteConfigProfile");

    event.cancelBubble = true;
    if ( event.stopPropagation ) event.stopPropagation();

    var name_config_selected = "";
    const nconfig_arr        = configs.filter((config) => {
      name_config_selected   = config.name;
      return config.id !== id;
    }) 

    setConfigs([...nconfig_arr]);
    toast.success("Deleted Config with name ``" + name_config_selected + "``", {id:U_CONFIG_VALUE});
  }

  const handleOpenConfig = (event, id) => {
    console.log("@handleOpenConfig");
    // @Incomplete is this even necessary ?
    /*
    event.cancelBubble = true;
    if ( event.stopPropagation ) event.stopPropagation();
    */

    // passing the id through some sort or url.
    nav("/config/"+id);
  };

  const search_by_config_name = (n2) => {
    console.log("@search_by_config_name");
    toast.loading ("Searching configs...", {id : SINTENT});

    const narr_scores = configs.map ( (element) => {
      const n1    = element.name;
      const score = levenshtein(n1, n2);
      const ret   = {
        "current_element" : element,
        "score"           : score,
      };
      return (ret);
    });

    const init_mapping_sorted = quicksort(narr_scores).map ( (element) => element.current_element );
    setConfigs(init_mapping_sorted);
    toast.success ("Found Configs", {id : SINTENT});
  }
 
  const ListConfigs = () => {
    // cursor begin, end
    var cursor_begin = size_t_max * (page-1);
    var cursor_end   = size_t_max * page;

    console.log("@cursor_begin >> "+cursor_begin);
    console.log("@cursor_end   >> "+cursor_end);

    return configs.slice(cursor_begin, cursor_end).map((config) => (
      <div key={config.id} className="childrens" title={config.note} onClick={(e) => handleOpenConfig(e, config.id)}>
        <span key={config.id+1}>name      :: {config.name}</span>
        <br/>
        <span key={config.id+2}># states  :: {config.states_length}</span>
        <br/>
        <span key={config.id+3}># intents :: {config.intents_length}</span>
        <br/>
        <button type="button" onClick={(e, id) => handleDeleteConfigProfile(e, config.id)}>Delete</button>
      </div>
    ));
  }

  if (configs.length === 0) {
    console.log(configs);
    return (
      <>
      <h3>No Configs Profile Registered.</h3>
      <br/>
      </>
    );
  }
  else {
    return (
      <>
        {/* <input  type = "text" placeholder = "Search By Config Name 🔎"/> */}
        <TextField fullWidth onChange={(e) => search_by_config_name(e.target.value)} id="outlined-basic" label="Search Config🔎" variant="outlined" />
        <ListConfigs/>
        <PaginationControlled
          configs={configs}
          size_t_max={size_t_max}
          page = {page}
          setPage = {setPage}
          count = {compute_pagination_size()}
        />
      </>
    );
  }
}


export default ConfigsListView;
