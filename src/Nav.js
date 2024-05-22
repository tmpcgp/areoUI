import { useSelector, useDispatch } from 'react-redux';
import { isLoggedIn } from './isLoggedInSlice';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from 'react';

function Nav () {

  const [value, setValue] = useState(0);
  const isLogged_in       = useSelector((state) => state.logged_in.value);
  const dispatch          = useDispatch();
  const nav               = useNavigate();


  const handleChange = (nvalue) => {
    console.log("newValue >> "+nvalue);

    switch (nvalue) {
      case 0:
        nav("/")
        break;

      case 1:
        nav(/* for the demo at school, since the backend is not finished.
        "/configs"
        */ "/config")
        break;

      case 2:
        nav("/demo")
        break;

      case 3:
        dispatch(isLoggedIn ( false ) );
        nav("/")
        break;

      case 4:
        nav("/create")
        break;

      case 5:
        nav("/login")
        break;
        
      case 6:
        nav("/about")
        break;

      default:
        // donothing()
        break;
    };
  }

  return (
    <BottomNavigation
      showLabels
      sx={{backgroundColor: "#87ceeb", fontFamily: 'Reddit Mono'}}
      value={value}
      onChange={(_, newValue) => handleChange(newValue)}
    >
      <BottomNavigationAction label="Home"/>
      <BottomNavigationAction label=/*"Configs"*/"Config"/>
      <BottomNavigationAction label="Demo"/>
      { isLogged_in  ? <BottomNavigationAction label="Logout"/> : "" } 
      { !isLogged_in ? <BottomNavigationAction label="Create"/> : "" } 
      { !isLogged_in ? <BottomNavigationAction label="Login"/> : "" } 
      <BottomNavigationAction label="About"/>
    </BottomNavigation>
  );
}

export default Nav;
// {/*<li onClick={() => handleClick("/admin")}><a>Admin</a></li>*/}
