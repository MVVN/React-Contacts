import { CREATE_CONTACT_FAIL, CREATE_CONTACT_REQUEST, CREATE_CONTACT_SUCCESS } from "../../actions/actionTypes";

const createContactReducer = (state = {}, action) => {
    switch (action.type) {
        case CREATE_CONTACT_REQUEST:
            return {
                loading: true,
            };
        case CREATE_CONTACT_SUCCESS:
            return {
                contact: action.payload,
            };
        case CREATE_CONTACT_FAIL:
            return {
                loading: false,
                error: action.payload,
            };
        default:
            return state;
    }
}

export {createContactReducer};