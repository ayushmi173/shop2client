import { AppDispatch, AppThunk } from 'redux-store';
import { counterSlice } from 'redux-store/slice/counter';

export const fetchCount = (): AppThunk => async (dispatch: AppDispatch) => {
    const timeoutCount: () => Promise<number> = async () =>
        await new Promise((resolve) => setTimeout(() => resolve(200000), 2000));

    dispatch(counterSlice.actions.incrementByAmount(await timeoutCount()));
};
