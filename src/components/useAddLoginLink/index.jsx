import { useEffect, useState } from 'react';

const useAddLoginLink = (hosts, menuItems, targetKey, loginLinkObj) => {
  const [linksArray, setLinksArray] = useState({...menuItems});
  useEffect(() => {
    let localLinks = {...menuItems}
    if(hosts.findIndex((host) => host === window.location.host) > -1) {
      if(localLinks[targetKey].findIndex((link) => link.id === loginLinkObj.id) === -1) {
        localLinks[targetKey].unshift(loginLinkObj)
        setLinksArray(localLinks);
      }
    }
  }, [linksArray])
  return linksArray;
}

export default useAddLoginLink;
