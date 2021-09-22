import { useState, useEffect } from 'react';
import ReactMapGL, { Marker, Popup } from 'react-map-gl';
import { Room } from "@material-ui/icons";
import axios from "axios";

import ContactsWindow from "./Components/Contacts/ContactsWindow";

import "./app.css"
import Login from './Components/Util/Login';

function App() {
  const [allContacts, setAllContacts] = useState([]);
  const [contactsToRender, setContactsToRender] = useState([]);
  const [allUser, setAllUser] = useState([]);
  const [currentUserID, setCurrentUserID] = useState(localStorage.getItem("userid"));
  const [currentUser, setCurrentUser] = useState(localStorage.getItem("user"));
  // const [currentUserID, setCurrentUserID] = useState();
  // const [currentUser, setCurrentUser] = useState();
  const [showLogin, setShowLogin] = useState(false);
  const [isAdmin, setIsAdmin] = useState();

  // Not using localstorage for autologin
  // because non-admin became admin after refreshing the page even when isAdmin stayed false. . . 
  // const [isAdmin, setIsAdmin] = useState(localStorage.getItem("isadmin"));

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
    localStorage.removeItem("isadmin");
    setCurrentUser(null);
    setCurrentUserID(null);
  }

  const handleLogin = () => {
    setShowLogin(!showLogin);
  }

  const handleClickMarker = (contact) => {
    setViewport({
      width: "100vw",
      height: "100vh",
      latitude: Number(contact.lat),
      longitude: Number(contact.lon),
      zoom: 11
    });
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
              {contactsToRender.map((contact) => {
                if (contact.owner === currentUserID || !contact.privat || isAdmin) {
                  return <>
                    <Marker latitude={Number(contact.lat)} longitude={Number(contact.lon)} offsetLeft={-11}>
                      <Room style={{ cursor: "pointer" }} onClick={() => handleClickMarker(contact)} />
                    </Marker>
                    <Popup latitude={Number(contact.lat)} longitude={Number(contact.lon)} closeOnClick={false} closeButton={true} anchor="bottom" >
                      <p>{contact.vorname + " " + contact.nachname}</p>
                      <p>{contact.adresse + " " + contact.hausnummer}</p>
                    </Popup>
                  </>
                }
              }
              )}
              <button className="button logout" onClick={handleLogout}>Logout</button>
              <ContactsWindow currentUser={currentUser} currentUserID={currentUserID} allContacts={allContacts} setAllContacts={setAllContacts} isAdmin={isAdmin} allUser={allUser} setViewport={setViewport} setContactsToRender={setContactsToRender} setIsAdmin={setIsAdmin} />
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
