function IntentsListView({intents, handleChangeIntent, deleteIntent}) {
  return intents.map ( (intent, idx) => (
    <div key={idx} className="intents-pool-child" title="Click to modify" onClick={() => handleChangeIntent(intent, idx)}>
      <span key={idx + 1}>Intent's name :: {intent.name}</span><br/>
      <hr/>
      <div className="button-close-delete-container">
        <button type="button" onClick={(e) => deleteIntent ( idx, e ) }>Close/Delete</button>
      </div>
    </div>
  ))
}


export default IntentsListView;
