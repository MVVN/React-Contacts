import React, { useState } from 'react';

import { AddCircleOutline } from '@material-ui/icons';
import axios from 'axios';

import "../Contacts/contactsWindow.css";

export default function Add({ isAdmin, displayWindow, currentUser, currentUserID, allUser, setViewport }) {

    const [vorname, setVorname] = useState(null);
    const [nachname, setNachname] = useState(null);
    const [straße, setStraße] = useState(null);
    const [hausnummer, setHausnummer] = useState(null);
    const [plz, setPlz] = useState(null);
    const [stadt, setStadt] = useState(null);
    const [bundesland, setBundesland] = useState(null);
    const [land, setLand] = useState(null);
    const [privat, setPrivat] = useState(true);
    const [owner, setOwner] = useState(currentUserID);

    const handleSubmit = async (e) => {
        // post Data from Add Form
        e.preventDefault();

        if (!vorname || !nachname || !straße || !hausnummer || !plz || !stadt) {
            alert("Please fill in all required data.");
        } else {
            let geoData = await getGeoData(straße, hausnummer, stadt, plz);
            if (geoData) {
                postNewContact(geoData);
            } else {
                // commented out because it caused  double error message
                // alert("Couldn't find address.");
            }
        }
        closeAddWindow();
    }

    const closeAddWindow = () => {
        displayWindow("contact");
    }

    const getGeoData = async (straße, hausnummer, stadt, plz) => {
        setStraße(straße.trim());
        setHausnummer(hausnummer.toString().trim());
        setStadt(stadt.trim());
        setPlz(plz.toString().trim());

        // setStraße(straße.replace(/\s/g, '+') + "+");
        // setHausnummer(hausnummer.replace(/\s/g, '+') + "+");
        // setStadt(stadt.replace(/\s/g, '+') + "+");
        // setPlz(plz.replace(/\s/g, '+'));

        // example: https://nominatim.openstreetmap.org/search?q=Torstra%C3%9Fe+100+Berlin+10119&format=json
        // let url = "https://nominatim.openstreetmap.org/search?q=" + straße + hausnummer + stadt + plz + "&format=json";
        let url = `https://nominatim.openstreetmap.org/search.php?q=${straße}+${hausnummer}+${plz}+${stadt}&format=jsonv2`

        let data;

        try {
            data = await axios.get(url);
        } catch (err) {
            console.log(`err`, err);
        }

        if (data.data.length == 0) {
            alert("Address not found.");
            return;
        } else {
            let geoData = data.data;
            let json;

            if (geoData[0].lat && geoData[0].lon) {
                json = {
                    "lat": geoData[0].lat,
                    "lon": geoData[0].lon
                }
            }
            // console.log(`JSON`, json);
            return json;
        }
    }

    const postNewContact = async (geoData) => {
        let newContact = createContactJSON(geoData);
        // console.log(`newContact`, newContact);
        await axios.post("http://localhost:3000/adviz/contacts/", newContact);
        setViewport({
            width: "100vw",
            height: "100vh",
            latitude: Number(geoData.lat),
            longitude: Number(geoData.lon),
            zoom: 11
        });
    }

    const createContactJSON = (geoData) => {
        // console.log(`geoDataInJSON`, geoData);
        let newContact = {
            "vorname": vorname,
            "nachname": nachname,
            "adresse": straße,
            "hausnummer": hausnummer,
            "plz": plz,
            "stadt": stadt,
            "fedState": bundesland,
            "land": land,
            "privat": privat,
            "owner": owner,
            "lat": geoData.lat,
            "lon": geoData.lon
        }
        return newContact;
    }

    return (
        <div className="contactsWindow">
            <div className="contactsWindow-header">
                <AddCircleOutline className="addUpdateWindow-header" style={{ fontSize: 40 }} />
            </div>
            <div className="addWindow-form">
                <form>
                    <label>Vorname: </label>
                    <input required placeholder="required" onChange={(e) => setVorname(e.target.value)} />
                    <br></br>
                    <label>Nachname: </label>
                    <input required placeholder="required" onChange={(e) => setNachname(e.target.value)} />
                    <br></br>
                    <label>Straße: </label>
                    <input required placeholder="required" onChange={(e) => setStraße(e.target.value)} />
                    <br></br>
                    <label>Hausnummer: </label>
                    <input required placeholder="required" onChange={(e) => setHausnummer(e.target.value)} />
                    <br></br>
                    <label>PLZ: </label>
                    <input required placeholder="required" onChange={(e) => setPlz(e.target.value)} />
                    <br></br>
                    <label>Stadt: </label>
                    <input required placeholder="required" onChange={(e) => setStadt(e.target.value)} />
                    <br></br>
                    <label>Bundesland: </label>
                    <input onChange={(e) => setBundesland(e.target.value)} />
                    <br></br>
                    <label>Land: </label>
                    <input onChange={(e) => setLand(e.target.value)} />
                    <br></br>
                    <label>Privat: </label>
                    <input type="checkbox" checked={privat} onChange={(e) => setPrivat(!privat)} />
                    <br></br>
                    {isAdmin && (
                        <>
                            <label>Owner: </label>
                            <select onChange={(e) => setOwner(e.target.value)} >
                                <option key={currentUserID} value={currentUserID}>{currentUser}</option>
                                <>
                                    {
                                        allUser.map((user) => {
                                            if (user.username !== currentUser) {
                                                return <option key={user._id} value={user._id}>{user.username}</option>
                                            }
                                        })
                                    }
                                </>
                            </select>
                        </>
                    )}
                    <br></br>
                    <button className="add-btn" onClick={handleSubmit} type="submit" >Add</button>
                    <br></br>
                    <button className="add-btn add-back-btn" onClick={closeAddWindow} type="button">Back</button>
                </form>
            </div>
        </div>
    )
}
