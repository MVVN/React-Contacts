import React, { useState, useEffect } from 'react';

import { Group, Person, AddCircleOutline } from '@material-ui/icons';

import "./contactsWindow.css";
import axios from 'axios';
import MyContact from './MyContact';


export default function ContactsWindow({ currentUser, allContacts, setAllContacts, currentUserID }) {

    const [userContacts, setUserContacts] = useState([]);
    const [showAllUserContacts, setShowAllUserContacts] = useState([false]);

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
        console.log("in addContact");
        console.log(`allContacts`, allContacts);
        console.log(`userContacts`, userContacts);
    }

    return (
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
                            return <MyContact contact={contact} editable={currentUserID == contact.owner} />
                        })}
                        
                    </>
                ) : (
                    <>
                        <div>
                            {userContacts.map((contact) => {
                                // console.log("userContacts contact:",contact);
                            return <MyContact contact={contact} editable={true} />
                            })}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

