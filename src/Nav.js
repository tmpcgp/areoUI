import { useSelector, useDispatch } from 'react-redux';
import { isLoggedIn } from './isLoggedInSlice';
import { useNavigate } from "react-router-dom";
import "./nav.css";


function Nav () {

  const isLogged_in = useSelector((state) => state.logged_in.value);
  const dispatch    = useDispatch();
  const nav         = useNavigate();
  const handleClick = (path) => {
    console.log("@handleClick");
    if ( path === "" ) { 
      flush();
    }
    nav ( path === "" ? "/" : path );
  }

  const flush = () => {
    // this is very dangerous 
    // (we don't know if the framework rely on the localStorage api)
    console.log("@flush");
    localStorage.clear();

    dispatch(isLoggedIn ( false ) );
    handleClick("/");
  }

  return (
    <ul>
      <li onClick={() => handleClick("/")}><a>Home</a></li>
      <li onClick={() => handleClick("/config")}><a>Config</a></li>
      <li onClick={() => handleClick("/demo")}><a>Demo</a></li>
      { isLogged_in  ? <li onClick={() => handleClick("")}><a>Logout</a></li> : "" } 
      { !isLogged_in ? <li onClick={() => handleClick("/create")}><a>Create</a></li> : "" } 
      { !isLogged_in ? <li onClick={() => handleClick("/login")}><a>Login</a></li> : "" } 
      <li onClick={() => flush("/login")}><a>Flush</a></li>
      <li onClick={() => handleClick("/about")}><a>About</a></li>
      {/*<li onClick={() => handleClick("/admin")}><a>Admin</a></li>*/}
    </ul>
  );
}

export default Nav;
