import React, { useState } from 'react';

import { Autorenew } from '@material-ui/icons';
import axios from 'axios';

import "../Contacts/contactsWindow.css";

export default function Update({ isAdmin, displayWindow, currentUser, currentUserID, allUser, contactToUpdate, setViewport }) {

    const [vorname, setVorname] = useState(contactToUpdate.vorname);
    const [nachname, setNachname] = useState(contactToUpdate.nachname);
    const [straße, setStraße] = useState(contactToUpdate.adresse);
    const [hausnummer, setHausnummer] = useState(contactToUpdate.hausnummer);
    const [plz, setPlz] = useState(contactToUpdate.plz);
    const [stadt, setStadt] = useState(contactToUpdate.stadt);
    const [bundesland, setBundesland] = useState(contactToUpdate.fedState);
    const [land, setLand] = useState(contactToUpdate.land);
    const [privat, setPrivat] = useState(contactToUpdate.privat);
    const [owner, setOwner] = useState(contactToUpdate.owner);

    const handleSubmit = async (e) => {
        // put Data from Update Form
        e.preventDefault();

        if (!vorname || !nachname || !straße || !hausnummer || !plz || !stadt) {
            alert("Please fill in all required data.");
        } else {
            let geoData = await getGeoData(straße, hausnummer, stadt, plz);
            if (geoData) {
                updateContact(geoData);
            } else {
                alert("Couldn't find address.")
            }
        }
        closeUpdateWindow();
    }

    const handleDelete = async () => {
        // delete Contact 
        await axios.delete("http://localhost:3000/adviz/contacts/" + contactToUpdate._id);
        closeUpdateWindow();
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

    const updateContact = async (geoData) => {
        let updatedContact = createContactJSON(geoData);
        // console.log(`updatedContact`, updatedContact)
        await axios.put("http://localhost:3000/adviz/contacts/"+ contactToUpdate._id, updatedContact);
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
        let updatedContact = {
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
        return updatedContact;
    }

    const closeUpdateWindow = () => {
        displayWindow("contact");
    }


    return (
        <div className="contactsWindow">
            <div className="contactsWindow-header">
                <Autorenew className="addUpdateWindow-header" style={{ fontSize: 40 }} />
            </div>
            <div className="updateWindow-form">
                <form>
                    <label>Vorname: </label>
                    <input required placeholder="required" onChange={(e) => setVorname(e.target.value)} value={vorname}></input>
                    <br></br>
                    <label>Nachname: </label>
                    <input required placeholder="required" onChange={(e) => setNachname(e.target.value)} value={nachname}></input>
                    <br></br>
                    <label>Straße: </label>
                    <input required placeholder="required" onChange={(e) => setStraße(e.target.value)} value={straße}></input>
                    <br></br>
                    <label>Hausnummer: </label>
                    <input required placeholder="required" onChange={(e) => setHausnummer(e.target.value)} value={hausnummer}></input>
                    <br></br>
                    <label>PLZ: </label>
                    <input required placeholder="required" onChange={(e) => setPlz(e.target.value)} value={plz}></input>
                    <br></br>
                    <label>Stadt: </label>
                    <input required placeholder="required" onChange={(e) => setStadt(e.target.value)} value={stadt}></input>
                    <br></br>
                    <label>Bundesland: </label>
                    <input onChange={(e) => setBundesland(e.target.value)} value={bundesland}></input>
                    <br></br>
                    <label>Land: </label>
                    <input onChange={(e) => setLand(e.target.value)} value={land}></input>
                    <br></br>
                    <label>Privat: </label>
                    <input type="checkbox" checked={privat} onChange={(e) => setPrivat(!privat)} value={privat} />
                    <br></br>
                    {isAdmin && (
                        <>
                            <label>Owner: </label>
                            <select value={owner} onChange={(e) => setOwner(e.target.value)} >
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
                    <button className="upd-btn" onClick={handleSubmit} type="submit" >Update</button>
                    <button className="upd-btn upd-del-btn" onClick={handleDelete} >Delete</button>
                    <button className="upd-btn upd-back-btn" onClick={closeUpdateWindow} >Back</button>
                </form>
            </div>
        </div>
    )
}
