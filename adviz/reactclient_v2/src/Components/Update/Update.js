import React, { useState } from 'react';

import { Autorenew } from '@material-ui/icons';

import "../Contacts/contactsWindow.css";

export default function Update({ isAdmin, displayWindow, currentUser, currentUserID, allUser, contactToUpdate }) {

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

    const putUpdateData = () => {
        // put Data from Update Form

        closeUpdateWindow();
    }

    const deleteContact = () => {
        // delete Contact 
        closeUpdateWindow();
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
                    <input required onChange={(e) => setVorname(e.target.value)} value={vorname}>{vorname}</input>
                    <label>Nachname: </label>
                    <input required onChange={(e) => setNachname(e.target.value)} value={nachname}>{nachname}</input>
                    <label>Straße: </label>
                    <input required onChange={(e) => setStraße(e.target.value)} value={straße}>{straße}</input>
                    <label>Hausnummer: </label>
                    <input required onChange={(e) => setHausnummer(e.target.value)} value={hausnummer}>{hausnummer}</input>
                    <label>PLZ: </label>
                    <input required onChange={(e) => setPlz(e.target.value)} value={plz}>{plz}</input>
                    <label>Stadt: </label>
                    <input required onChange={(e) => setStadt(e.target.value)} value={stadt}>{stadt}</input>
                    <label>Bundesland: </label>
                    <input onChange={(e) => setBundesland(e.target.value)} value={bundesland}>{bundesland}</input>
                    <label>Land: </label>
                    <input onChange={(e) => setLand(e.target.value)} value={land}>{land}</input>
                    <label>Privat: </label>
                    <input type="checkbox" checked={privat} onChange={(e) => setPrivat(!privat)} value={privat} />
                    {isAdmin && (
                        <>
                            <label>Owner: </label>
                            <select value={owner} onChange={(e) => setOwner(e.target.value)} >
                                <option value={currentUserID}>{currentUser}</option>
                                <>
                                    {
                                        allUser.map((user) => {
                                            if (user.username != currentUser) {
                                                return <option value={user._id}>{user.username}</option>
                                            }
                                        })
                                    }
                                </>
                            </select>
                        </>
                    )}
                    <button className="upd-btn" onClick={putUpdateData} type="submit" >Update</button>
                    <button className="upd-btn upd-del-btn" onClick={deleteContact} >Delete</button>
                    <button className="upd-btn upd-back-btn" onClick={closeUpdateWindow} >Back</button>
                </form>
            </div>
        </div>
    )
}
