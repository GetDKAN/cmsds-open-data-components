import { NavLink } from 'react-router-dom';


const SubMenuStaticList = (submenuArray, subLinkClasses) =>  (
  // Render a static list of submenu items as listed in the menu.json or menu.jsx object.
  submenuArray.map((s) => {
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
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {s.icon ?? null}
            <span>
              {s.label}
            </span>
          </NavLink>
        )}
     </li>
    )
  }
 )
)

export default SubMenuStaticList;
