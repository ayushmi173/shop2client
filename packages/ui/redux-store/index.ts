import { Action, configureStore, Store, ThunkAction } from '@reduxjs/toolkit';
import { Context, createWrapper } from 'next-redux-wrapper';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

import rootReducer from './rootReducer';
import { State } from './types';

const store = configureStore({ reducer: rootReducer });

export type AppState = ReturnType<typeof rootReducer>;

/**
 * It saves you the need to type (state: RootState) every time
 */
export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector;

export type AppDispatch = typeof store.dispatch;
/**
 * The default Dispatch type does not know about thunks.
 *  In order to correctly dispatch thunks, you need to use the specific customized AppDispatch type from the store that includes the thunk middleware types, and use that with useDispatch. Adding a pre-typed useDispatch hook keeps you from forgetting to import AppDispatch where it's needed.
 */
export const useAppDispatch = () => useDispatch<AppDispatch>();

export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    AppState,
    unknown,
    Action
>;

export const makeStore = (_context: Context) =>
    configureStore({ reducer: rootReducer });

export const wrapper = createWrapper<Store<State>>(makeStore, { debug: true });
