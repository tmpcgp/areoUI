function ChoicesListView ({choices, handleChangeChoice, persistChoice, deleteChoice, modify_state, CHOICE_TYPE}) {
  return choices.map ( (choice, idx ) => (
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
  ))
}

export default ChoicesListView;
