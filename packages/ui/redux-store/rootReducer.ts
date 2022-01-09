import { combineReducers } from '@reduxjs/toolkit';

import { reducer as countReducer } from './slice/counter';
import { reducer as authReducer } from './slice/auth';

export default combineReducers({
    count: countReducer,
    auth: authReducer,
});
