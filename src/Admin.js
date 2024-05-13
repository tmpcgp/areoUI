import { useState, useRef, useEffect } from 'react';
import {quicksort, levenshtein}  from "./utils.js";

function Admin() {

  // shows all the accounts in the application.
  // registered in a bot domain.
  const URL_VOMIT  = "http://localhost:5001/accounts"; // URL Of all the accounts the central bots
  const URL_DELETE = "http://localhost:5001/delete"  ;   

  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    console.log("@Admin component is mounting.");
    get_all_accounts();
  }, []);

  const get_all_accounts = () => {
    console.log("@get_all_accounts");

    const nacc = {
      name : "somename",
      spec : "somespec",
      key  : "somekey"
    };
    setAccounts([...accounts, nacc]);
  };

  const delete_account = (i, event) => {
    console.log("@delete_account");

    event.cancelBubble = true;
    if ( event.stopPropagation ) event.stopPropagation();

    const acc_selected = accounts[i]; // for the toast implementation.
    const nacc_arr     = accounts.filter ( (_, idx) => idx !== i );

    // Delete the account by using the axios API

    setAccounts(nacc_arr);
  }

  const search_by_account_name = (n2) => {
    console.log("@search_by_account_name");

    const narr_scores = accounts.map ( (element) => {
      const n1    = element.name;
      const score = levenshtein(n1, n2);
      const ret   = {
        "current_element" : element,
        "score"           : score,
      };
      return (ret);
    });

    const init_mapping_sorted = quicksort(narr_scores).map ( (element) => element.current_element );
    setAccounts( init_mapping_sorted );
  }

  const list_all_accounts = accounts.map ( (account, idx) => 
    <div key={idx} className="accounts-pool-child">
      <span key={idx + 1}>Account's name          :: {account.name}</span><br/>
      <span key={idx + 2}>Account's specification :: {account.spec}</span><br/>
      <span key={idx + 3}>Account's private key   :: {account.key}</span><br/>
      <hr/>
      <div className="button-close-delete-container">
        <button type="button" onClick={(e) => delete_account ( idx, e ) }>Close/Delete</button>
      </div>
    </div>
  );

  // @Incomplete || @Todo(envy) : add a select item to narrow the search.
  return (
    <>
      <h1>This is the admin panel.</h1>
      <h1>List Of All accounts</h1>
      <input onChange={(e) => search_by_account_name(e.target.value)} type = "text" placeholder = "Search By Account Name 🔎"/>
      {list_all_accounts}
    </>
  );
}

/*title="Click to modify" onClick={() => handleChangeIntent(intent, idx)}*/
export default Admin;
