import React, { useState, useEffect } from 'react';

import { Group, Person, AddCircleOutline } from '@material-ui/icons';

import "./contactsWindow.css";
import axios from 'axios';
import MyContact from './MyContact';
import Add from "../Add/Add";
import Update from "../Update/Update";


export default function ContactsWindow({ currentUser, allContacts, setAllContacts, currentUserID, isAdmin, allUser }) {

    const [userContacts, setUserContacts] = useState([]);
    const [showAllUserContacts, setShowAllUserContacts] = useState([false]);
    const [showContactWindow, setShowContactWindow] = useState(true);
    const [showAddWindow, setShowAddWindow] = useState(false);
    const [showUpdateWindow, setShowUpdateWindow] = useState(false);
    const [contactToUpdate, setContactToUpdate] = useState();

    const showAllContacts = () => {
        console.log("in showAllContacts");
        setUserContacts([]);
        const getAllContacts = async () => {
            setAllContacts([]);
            setAllContacts([]);
            try {
                const response = await axios.get("/contacts/all");
                setAllContacts(response.data);
            } catch (err) {
                console.log(err);
            }
        }
        getAllContacts();
        setShowAllUserContacts(true);
    }

    const showMyContacts = () => {
        console.log("in showMyContacts");
        const getUserContacts = async () => {
            setUserContacts([]);
            try {
                const response = await axios.get("/contacts?userId=" + currentUserID);
                setUserContacts(response.data);
            } catch (err) {
                console.log(err);
            }
        }
        getUserContacts();
        setShowAllUserContacts(false);
    }

    const addContact = () => {
        /* console.log("in addContact");
        console.log(`allContacts`, allContacts);
        console.log(`userContacts`, userContacts); */
        displayWindow("add");
    }

    const displayWindow = (windowName) => {
        setShowContactWindow(windowName == "contact");
        setShowAddWindow(windowName == "add");
        setShowUpdateWindow(windowName == "update");
    }

    return (
        <>
            {showAddWindow && (
                <Add isAdmin={isAdmin} displayWindow={displayWindow} currentUser={currentUser} currentUserID={currentUserID} allUser={allUser} />
            )}
            {showUpdateWindow && (
                <Update isAdmin={isAdmin} displayWindow={displayWindow} currentUser={currentUser} currentUserID={currentUserID} allUser={allUser} contactToUpdate={contactToUpdate} />
            )}

            {showContactWindow && (
                <div className="contactsWindow">
                    <div className="contactsWindow-header">
                        <Group className="contactsWindow-btn" style={{ fontSize: 40 }} onClick={showAllContacts} />
                        <Person className="contactsWindow-btn" style={{ fontSize: 40 }} onClick={showMyContacts} />
                        <AddCircleOutline className="contactsWindow-btn" style={{ fontSize: 40 }} onClick={addContact} />
                    </div>
                    <div className="contactsWindow-contacts">
                        {showAllUserContacts ? (
                            <>
                                {allContacts.map((contact) => {
                                    // console.log("allContacts contact: ",contact);
                                    if (contact.owner == currentUserID || !contact.privat || isAdmin) {
                                        return <MyContact key={contact._id} contact={contact} editable={currentUserID == contact.owner || isAdmin} displayWindow={displayWindow} setContactToUpdate={setContactToUpdate} />
                                    }
                                })}

                            </>
                        ) : (
                            <>
                                <div>
                                    {userContacts.map((contact) => {
                                        // console.log("userContacts contact:",contact);
                                        return <MyContact contact={contact} editable={true} displayWindow={displayWindow} setContactToUpdate={setContactToUpdate} />
                                    })}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}

