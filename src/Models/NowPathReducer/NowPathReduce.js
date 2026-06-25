export const NOW_PATH_INSERT_STATE_REDUCER_GET = 'NOW_PATH_INSERT_STATE_REDUCER_GET';
export const NOW_PATH_INITIAL_STATE_REDUCER_GET = 'NOW_PATH_INITIAL_STATE_REDUCER_GET';

const initState = {
    Path_Info: {
        path: null,
    },
};

export const Now_Path_Insert_Reducer_State_Func = data => ({
    type: NOW_PATH_INSERT_STATE_REDUCER_GET,
    payload: data,
});
export const Now_Path_Initial_Reducer_State_Func = () => ({
    type: NOW_PATH_INITIAL_STATE_REDUCER_GET,
});

const Now_Path_Reducer_State = (state = initState, action) => {
    switch (action.type) {
        case NOW_PATH_INSERT_STATE_REDUCER_GET:
            return {
                ...state,
                Path_Info: {
                    path: action.payload,
                },
            };
        case NOW_PATH_INITIAL_STATE_REDUCER_GET:
            return initState;
        default:
            return state;
    }
};

export default Now_Path_Reducer_State;
