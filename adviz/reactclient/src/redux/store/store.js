import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";

import { createContactReducer } from "../reducers/contacts/createContactReducer";


const middlewares = [thunk];

const reducer = combineReducers({
    contactCreated: createContactReducer,
});

const store = createStore(
    reducer,
    composeWithDevTools(applyMiddleware(...middlewares))
);

export { store};