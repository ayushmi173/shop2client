import { NextPage } from 'next';
import React from 'react';
import { useAppDispatch, useAppSelector } from 'redux-store';
import { fetchCount } from 'redux-store/thunks/counter';

import {
    decrement,
    increment,
    incrementByAmount,
} from '../redux-store/slice/counter';

const Counter: NextPage = () => {
    // The `state` arg is correctly typed as `RootState` already
    const count = useAppSelector((state) => state.count.value);
    const dispatch = useAppDispatch();

    // omit rendering logic

    return (
        <div className="h-9 w-6 bg-red-600">
            <button
                className={'bg-pink-50 h-5 w-5'}
                aria-label="Increment value"
                onClick={() => dispatch(increment())}
            >
                +
            </button>
            <span className={'bg-yellow-100 h-5 w-5'}>{count}</span>
            <button
                className={'bg-gray-300 h-5 w-5'}
                aria-label="Decrement value"
                onClick={() => dispatch(decrement())}
            >
                -
            </button>

            <button
                className={'bg-gray-300'}
                aria-label="increment with api"
                onClick={() => dispatch(incrementByAmount(10))}
            >
                increment me
            </button>

            <button
                className={'bg-gray-300'}
                aria-label="increment with api"
                onClick={() => dispatch(fetchCount())}
            >
                fetch me
            </button>
        </div>
    );
};

export default Counter;
