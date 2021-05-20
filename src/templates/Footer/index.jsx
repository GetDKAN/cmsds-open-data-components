import React from 'react';
import PropTypes from 'prop-types';
import { useMediaQuery } from 'react-responsive'
import { Button } from '@cmsgov/design-system';
import { Link } from "@reach/router";

const Footer = ({
  links,
  showEmail,
  emailTitle,
  emailBody,
  emailLink,
  emailButton,
  socialMediaLinks,
  hhsLogo,
  cmsLogo
}) => {
  const xs = useMediaQuery({ minWidth: 0, maxWidth: 544});
  const sm = useMediaQuery({ minWidth: 544, maxWidth: 768});
  const md = useMediaQuery({ minWidth: 768});
  const {footerOpenDataToolLinks, footerAdditionalResourcesLinks, footerUtilityLinks} = links;
  return (
    <footer className="dc-c-footer">
      {showEmail
        && (
          <div className="dc-c-emailupdates">
            <div className="ds-l-container ds-u-padding-y--5">
              <div className="ds-l-row ds-u-align-items--center">
                <div className="ds-l-md-col--8">
                  <h2 className="ds-h4">{emailTitle}</h2>
                  <p>{emailBody}</p>
                </div>
                <div className="ds-l-md-col--4 ds-u-padding-left--7">
                  <Button href={emailLink}>{emailButton}</Button>
                </div>
              </div>
            </div>
          </div>
        )
      }
      <div className="dc-c-footer--middle-container">
        <div className={`${md ? 'ds-l-container' : ''}`}>
          <div className="ds-l-row ds-u-margin--0">
            <div className={`dc-c-footer__resources ds-l-md-col--7 ds-l-sm-col--12 ds-u-padding-top--7 ds-u-padding-bottom--4 ${md ? 'ds-u-padding-x--0' : ''} ${sm ? 'ds-u-padding-x--4' : ''}`}>
              <div className="ds-l-lg-col--9 ds-l-md-col--11 ds-u-padding-x--0">
                <div className={`ds-u-display--flex ${xs ? 'ds-u-flex-direction--column' : 'ds-u-flex-direction--row'}`}>
                  <div className="ds-u-margin-right--6 ds-u-margin-bottom--2">
                    <h3 className="ds-h6 dc-footer--heading ds-u-margin-bottom--2">Open data tools</h3>
                    <ul className="ds-u-font-size--small ds-u-margin-bottom--3">
                      {footerOpenDataToolLinks.map((link) => (
                        <li className="ds-u-margin-bottom--1" key={link.id}>
                          <Link 
                            to={link.url} 
                            target={link.target} 
                            className="dc-menu-item">
                              {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="ds-h6 dc-footer--heading ds-u-margin-bottom--2">Additional resources</h3>
                    <ul className="ds-u-font-size--small">
                      {footerAdditionalResourcesLinks.map((link) => (
                        <li className="ds-u-margin-bottom--1" key={link.id}>
                          <Link 
                            to={link.url} 
                            target={link.target} 
                            className="dc-menu-item">
                              {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className={`dc-c-footer__cms-information ds-l-md-col--5 ds-l-sm-col--12 ${md ? 'ds-u-padding-left--7' : ''} ${sm ? ' ds-u-padding-left--4' : ''} ds-u-padding-y--7`}>
            <div className="ds-u-font-size--small">
              <div>
                <a href="http://www.hhs.gov/" target="_blank" title="U.S. Department of Health &amp; Human Services">
                  <img className="dc-c-footer__logo" src={hhsLogo} alt="HHS Logo" />
                  <span className="ds-u-visibility--screen-reader">opens in new window</span>
                </a>
                <a className="ds-u-margin-left--4" target="_blank" href="http://www.cms.gov/" title="CMS.gov Centers for Medicare &amp; Medicaid Services">
                  <img className="dc-c-footer__logo" src={cmsLogo} alt="CMS Logo" />
                  <span className="ds-u-visibility--screen-reader">opens in new window</span>
                </a>
              </div>
                <p>A federal government website managed and paid for by the U.S. Centers for Medicare &amp; Medicaid Services.</p>
                <p>7500 Security Boulevard, Baltimore, MD 21244</p>
                {socialMediaLinks
                  && (
                    <ul className="ds-u-display--flex">
                      {socialMediaLinks.facebook
                        && (
                          <li className="ds-u-margin-right--1">
                            <a href={socialMediaLinks.facebook}>
                              <span className="dc-c-footer--svg-icon">
                                <svg className="svg-inline--fa fa-circle fa-w-16" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="circle" role="presentation" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg="">
                                  <path d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8z"></path>
                                </svg>
                                <svg title="CMS Facebook" className="svg-inline--fa fa-facebook-f fa-w-10 fa-inverse" data-fa-transform="shrink-3.5" aria-labelledby="svg-inline--fa-title-iRCARP7h6Kp3" data-prefix="fab" data-icon="facebook-f" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" data-fa-i2svg="" >
                                  <title id="svg-inline--fa-title-iRCARP7h6Kp3">CMS Facebook</title>
                                  <g transform="translate(160 256)">
                                    <g transform="translate(0, 0)  scale(0.78125, 0.78125)  rotate(0 0 0)">
                                      <path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z" transform="translate(-160 -256)"></path>
                                    </g>
                                  </g>
                                </svg>
                              </span>
                            </a>
                          </li>
                        )
                      }
                      {socialMediaLinks.twitter
                        && (
                          <li className="ds-u-margin-right--1">
                            <a href={socialMediaLinks.twitter}>
                              <span className="dc-c-footer--svg-icon">
                                <svg className="svg-inline--fa fa-circle fa-w-16" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="circle" role="presentation" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg="">
                                  <path d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8z"></path>
                                </svg>
                                <svg title="CMS Twitter" className="svg-inline--fa fa-twitter fa-w-16 fa-inverse" data-fa-transform="shrink-3.5" aria-labelledby="svg-inline--fa-title-4z03ITiPPTVF" data-prefix="fab" data-icon="twitter" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg="">
                                  <title id="svg-inline--fa-title-4z03ITiPPTVF">CMS Twitter</title>
                                  <g transform="translate(256 256)">
                                    <g transform="translate(0, 0)  scale(0.78125, 0.78125)  rotate(0 0 0)">
                                      <path d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z" transform="translate(-256 -256)"></path>
                                    </g>
                                  </g>
                                </svg>
                              </span>
                            </a>
                          </li>
                        )
                      }
                      {socialMediaLinks.linkedin
                        && (
                          <li>
                            <a href={socialMediaLinks.linkedin}>
                              <span className="dc-c-footer--svg-icon">
                                <svg className="svg-inline--fa fa-circle fa-w-16" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="circle" role="presentation" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg="">
                                  <path d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8z"></path>
                                </svg>
                                <svg title="CMS LinkedIn" className="svg-inline--fa fa-linkedin-in fa-w-14 fa-inverse" data-fa-transform="shrink-3.5" aria-labelledby="svg-inline--fa-title-Nm2qsuSKvuRZ" data-prefix="fab" data-icon="linkedin-in" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" data-fa-i2svg="">
                                  <title id="svg-inline--fa-title-Nm2qsuSKvuRZ">CMS LinkedIn</title>
                                  <g transform="translate(224 256)">
                                    <g transform="translate(0, 0)  scale(0.78125, 0.78125)  rotate(0 0 0)">
                                      <path d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z" transform="translate(-224 -256)"></path>
                                    </g>
                                  </g>
                                </svg>
                              </span>
                            </a>
                          </li>
                        )
                      }
                    </ul>
                  )
                }
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="dc-c-footer__utility ds-l-container ds-u-padding-y--2 ds-u-font-size--small">
        <div className="ds-l-row ">
          <div className="ds-l-col--12 ds-u-padding-y--3">
            <ul className={`ds-u-padding--0 ds-u-display--flex ${md ? 'ds-u-flex-direction--row' : 'ds-u-flex-direction--column'} ds-u-flex-wrap--wrap`} >
              {footerUtilityLinks.map((link) => (
                <li key={link.id}>
                  <a href={link.url} className="ds-u-margin-right--2">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}

Footer.defaultProps = {
  showEmail: true,
  emailTitle: 'Get Email Updates',
  emailBody: 'Sign up to get the latest information about your choice of CMS topics in your inbox. Also, determine how frequently you wish to receive updates.',
  emailLink: '',
  emailButton: 'Sign up for email updates',
  socialMediaLinks: null,
}

Footer.propTypes = {
  showEmail: PropTypes.bool,
  emailTitle: PropTypes.string,
  emailBody: PropTypes.string,
  emailLink: PropTypes.string,
  emailButton: PropTypes.string,
  links: PropTypes.shape({
    footerOpenDataToolLinks: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        label: PropTypes.string,
        url: PropTypes.string,
        target: PropTypes.string,
      })
    ),
    footerAdditionalResourcesLinks: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        label: PropTypes.string,
        url: PropTypes.string,
        target: PropTypes.string,
      })
    ),
    footerUtilityLinks: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        label: PropTypes.string,
        url: PropTypes.string,
        target: PropTypes.string,
      })
    )
  }).isRequired,
  socialMediaLinks: PropTypes.shape({
    facebook: PropTypes.shape({
      title: PropTypes.string,
      url: PropTypes.string,
    }),
    twitter: PropTypes.shape({
      title: PropTypes.string,
      url: PropTypes.string,
    }),
    linkedin: PropTypes.shape({
      title: PropTypes.string,
      url: PropTypes.string,
    }),
  }),
  hhsLogo: PropTypes.string.isRequired,
  cmsLogo: PropTypes.string.isRequired,
}

export default Footer;
