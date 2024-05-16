function StatesListView ({states, handleChangeState, deleteState}) {
  return states.map ( (state, idx ) => (
    <div key={idx} className="states-pool-child" title="Click to modify" onClick={() => handleChangeState(state, idx)}>
      <span key={idx+1}>State's name      :: {state.name}</span><br/>
      <span key={idx+2}>Number of choices :: {state.choices !== undefined ? state.choices.length : "Nothing to see here."}</span><br/>
      <span key={idx+3}>Number of answers :: {state.answers !== undefined ? state.answers.length : "Nothing to see here."}</span><br/>
      <span key={idx+4}>Execute when      :: {state.onIntent.name} is met.</span><br/>
      <hr/>
      <button type="button" onClick={(e) => deleteState( idx, e ) }>Close/Delete</button>
    </div>
  ))
}


export default StatesListView;
