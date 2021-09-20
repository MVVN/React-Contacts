import React, { useState, useEffect } from 'react'
import axios from "axios";

import "./mycontact.css";

export default function MyContact({ contact, editable, displayWindow, setContactToUpdate }) {

    const editContact = () => {
        if (editable) {
            // console.log(`Contact editable`, contact);
            setContactToUpdate(contact);
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

