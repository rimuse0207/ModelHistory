import { useEffect, useState } from "react";
import { Request_Get_Axios } from "../API";

export const useUserList = () => {
  const [userLists, setUserLists] = useState([]);

  useEffect(() => {
    getUserLists();
  }, []);
  const getUserLists = async () => {
    const request = await Request_Get_Axios(`/selectlist/getUserList`);
    if (request.status) {
      setUserLists(request.data);
    }
  };
  return {
    userLists,
  };
};
