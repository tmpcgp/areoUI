
const auth = () => {

  const name      = localStorage.getItem("name");
  const eval_bool = name !== null;

  return eval_bool;
}

export default auth;
