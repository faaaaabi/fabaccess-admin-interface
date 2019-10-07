import navigationReducer from './navigation/reducers'
import { combineReducers } from 'redux';

export const rootReducer = combineReducers({
    navigation: navigationReducer
});

export type AppState = ReturnType<typeof rootReducer>