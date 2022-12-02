import { combineReducers } from 'redux';
import userReducer from './slices/user';
import chatReducer from './slices/chat';

export default combineReducers({
    user: userReducer,
    chat: chatReducer
});