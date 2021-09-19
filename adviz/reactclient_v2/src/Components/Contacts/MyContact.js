import React, { useState, useEffect } from 'react'
import axios from "axios";

import "./mycontact.css";
import { SmsOutlined } from '@material-ui/icons';

export default function MyContact({ contact, editable }) {

    const editContact = () => {
        if (editable) {
            console.log(`Contact editable`, contact);
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

