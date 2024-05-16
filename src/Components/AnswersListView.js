function AnswersListView({answers, handleChangeMultAns, persistAns, deleteMultAns, modify_state, ANS_TYPE, modify_intent}) {
  return answers.map ( (ans, idx) => (
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
  ));
}

export default AnswersListView;
