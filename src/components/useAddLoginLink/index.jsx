import React, { useEffect } from 'react';

const useAddLoginLink = (hosts, menuItems, loginLinkObj) => {
  let linksArray = menuItems;
  useEffect(() => {
    console.log('fired')
  }, [])
  return linksArray;
}

export default useAddLoginLink;