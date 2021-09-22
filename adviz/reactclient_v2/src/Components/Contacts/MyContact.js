import React from 'react'

import "./mycontact.css";

export default function MyContact({ contact, editable, displayWindow, setContactToUpdate, setViewport }) {

    const editContact = () => {
        if (editable) {
            // console.log(`Contact editable`, contact);
            setContactToUpdate(contact);
            setViewport({
                width: "100vw",
                height: "100vh",
                latitude: Number(contact.lat),
                longitude: Number(contact.lon),
                zoom: 11
            });
            displayWindow("update");
        }
    }

    return (
        <>
            <div className="myContact-panel" onClick={editContact}>
                <p className="myContact-text">
                    {contact.vorname} {contact.nachname}
                    <br />
                    {contact.adresse} {contact.hausnummer}
                </p>
            </div>
        </>
    );
}

