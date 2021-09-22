import axios from "axios";
import { CREATE_CONTACT_REQUEST } from "../actionTypes";

const createContactAction = contactData => {

    return async dispatch => {
        try {
            dispatch({
                type: CREATE_CONTACT_REQUEST,
            });
            const config = {
                "Content-Type": "application/json",
            };

            const { data } = await axios.post("/adviz/contacts", contactData, config);

            dispatch({
                type: CREATE_CONTACT_SUCCESS,
                payload: data,
            });
        } catch (error) {
            dispatch({
                type: CREATE_CONTACT_FAIL,
                payload: error.respone && error.response.data.message,
            });

        }

    };
};

export { createContactAction };