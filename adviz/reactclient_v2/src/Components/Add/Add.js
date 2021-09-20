import React, { useState } from 'react';

import { AddCircleOutline } from '@material-ui/icons';

import "../Contacts/contactsWindow.css";

export default function Add({ isAdmin, displayWindow, currentUser, currentUserID, allUser }) {
    
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


    const postAddData = () => {
        // post Data from Add Form
        console.log(`PostData`, vorname + nachname + straße + hausnummer + plz + stadt + bundesland + land + privat + owner)
        console.log(`owner`, owner)
        closeAddWindow();
    }


    const closeAddWindow = () => {
        // clearForm();
        displayWindow("contact");
    }

/*     const clearForm = () => {
        // clear Form Data before closing add Window
    } */

    return (
        <div className="contactsWindow">
            <div className="contactsWindow-header">
                <AddCircleOutline className="addUpdateWindow-header" style={{ fontSize: 40 }} />
            </div>
            <div className="addWindow-form">
                <form>
                    <label>Vorname: </label>
                    <input required placeholder="required" onChange={(e) => setVorname(e.target.value)} />
                    <label>Nachname: </label>
                    <input required placeholder="required" onChange={(e) => setNachname(e.target.value)} />
                    <label>Straße: </label>
                    <input required placeholder="required" onChange={(e) => setStraße(e.target.value)} />
                    <label>Hausnummer: </label>
                    <input required placeholder="required" onChange={(e) => setHausnummer(e.target.value)} />
                    <label>PLZ: </label>
                    <input required placeholder="required" onChange={(e) => setPlz(e.target.value)} />
                    <label>Stadt: </label>
                    <input required placeholder="required" onChange={(e) => setStadt(e.target.value)} />
                    <label>Bundesland: </label>
                    <input onChange={(e) => setBundesland(e.target.value)} />
                    <label>Land: </label>
                    <input  onChange={(e) => setLand(e.target.value)} />
                    <label>Privat: </label>
                    <input type="checkbox" checked={privat} onChange={(e) => setPrivat(!privat)} />
                    {isAdmin && (
                        <>
                            <label>Owner: </label>
                            <select onChange={(e) => setOwner(e.target.value)} >
                                <option value={currentUserID} selected>{currentUser}</option>
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
                    <button className="add-btn" onClick={postAddData} type="submit" >Add</button>
                    <button className="add-btn add-back-btn" onClick={closeAddWindow} >Back</button>
                </form>
            </div>
        </div>
    )
}
