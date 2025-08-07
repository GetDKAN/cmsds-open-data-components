import { NavLink } from 'react-router-dom';


const SubMenuStaticList = ({submenuArray, subLinkClasses, setIsExpanded}) =>  {
  // Render a static list of submenu items as listed in the assets/menu.jsx file.
  let submenuItems = submenuArray.map((s) => {
    return (
      <li key={s.id}>
        {s.external || s.drupalPage ? (
          <a href={s.url} className={`ds-u-display-flex ds-u-align-items--center ${subLinkClasses}`}>
            {s.icon ?? null}
            <span>{s.label}</span>
          </a>
        ) : (
          <NavLink
            to={s.url}
            className={`ds-u-display-flex ds-u-align-items--center ${subLinkClasses}`}
            onClick={() => setIsExpanded(prev => !prev)}
          >
            {s.icon ?? null}
            <span>
              {s.label}
            </span>
          </NavLink>
        )}
     </li>
    )
  })
  return (
    <ul className={`dkan-c-site-menu--sub-menu`}>
      {submenuItems}
    </ul>
  );
}

export default SubMenuStaticList;
