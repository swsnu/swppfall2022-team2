import { combineReducers } from 'redux';
import userReducer from './slices/user';

export default combineReducers({
    user: userReducer
});