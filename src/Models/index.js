import { combineReducers } from "redux";
import Login_Info_Reducer_State from "./LoginInfoReducer/LoginInfoReduce";
import Now_Path_Reducer_State from "./NowPathReducer/NowPathReduce";
import Now_Loader_Info_State from "./LoaderReducer/LoaderReducer";

const rootReducer = combineReducers({
  Login_Info_Reducer_State,
  Now_Path_Reducer_State,
  Now_Loader_Info_State,
});

export default rootReducer;
