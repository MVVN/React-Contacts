import { useState, useEffect } from 'react';
import ReactMapGL, { Marker, Popup } from 'react-map-gl';
import { Room } from "@material-ui/icons";
import axios from "axios";

import Header from "./Components/Util/Header";
import ContactsWindow from "./Components/Contacts/ContactsWindow";

import "./app.css"
import Login from './Components/Util/Login';

function App() {
  const [allContacts, setAllContacts] = useState([]);
  const [allUser, setAllUser] = useState([]);
  const [currentUser, setCurrentUser] = useState(localStorage.getItem("user"));
  const [currentUserID, setCurrentUserID] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [isAdmin, setIsAdmin] = useState();

  const [viewport, setViewport] = useState({
    width: "100vw",
    height: "100vh",
    latitude: 52.520008,
    longitude: 13.404954,
    zoom: 11
  });

/*   useEffect(() => {
    const getAllContacts = async () => {
      try {
        const response = await axios.get("/contacts/all");
        setAllContacts(response.data);
      } catch (err) {
        console.log(err);
      }
    }
    getAllContacts();
  }, []); */

  useEffect(() => {
    const getInitData = async () => {
      try {
        const response_allContacts = await axios.get("/contacts/all");
        setAllContacts(response_allContacts.data);
        const response_allUser = await axios.get("/all");
        setAllUser(response_allUser.data);
      } catch (err) {
        console.log(err);
      }
    }
    getInitData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("userid");
    setCurrentUser(null);
    setCurrentUserID(null);
  }

  const handleLogin = () => {
    setShowLogin(!showLogin);
  }


  return (
    <div className="App">
      <ReactMapGL
        {...viewport}
        mapboxApiAccessToken={process.env.REACT_APP_MAPBOX}
        onViewportChange={nextViewport => setViewport(nextViewport)}
        // mapStyle="mapbox://styles/nagasechi/cktq959j52z4818kkillwgc9l"
        mapStyle="mapbox://styles/nagasechi/cktt41p2r5r9817ozk9i1nuv9"
      >

        {currentUser ?
          (
            <>
              <button className="button logout" onClick={handleLogout}>Logout</button>
              <ContactsWindow currentUser={currentUser} currentUserID={currentUserID} allContacts={allContacts} setAllContacts={setAllContacts} isAdmin={isAdmin} allUser={allUser} />
            </>
          ) : (
            <button className="button login" onClick={handleLogin}>Login</button>
          )}

        {showLogin && <Login setShowLogin={setShowLogin} setCurrentUser={setCurrentUser} setViewport={setViewport} currentUser={currentUser} setCurrentUserID={setCurrentUserID} setIsAdmin={setIsAdmin} />}

      </ReactMapGL>
    </div >
  );
}

export default App;
