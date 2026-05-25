import type { NavLinkArray, OrgType, FAQItemType } from '../src/types/misc';
import cmsLogo from '../src/assets/images/CMSgov@2x-white-O.png';

export const cmsOrg: OrgType = {
  url: 'https://www.cms.gov',
  tagline: 'The Centers for Medicare & Medicaid Services',
  urlTitle: 'CMS Open Data',
  logoAltText: 'CMS Logo',
};

export const cmsOrgWithLogo: OrgType = {
  ...cmsOrg,
  logoFilePath: cmsLogo,
};

export const mainNavLinks: NavLinkArray[] = [
  { id: 'home', label: 'Home', url: '/' },
  { id: 'datasets', label: 'Datasets', url: '/datasets' },
  { id: 'api', label: 'API Documentation', url: '/api-docs' },
  { id: 'about', label: 'About', url: '/about' },
];

export const navLinksWithSubmenus: NavLinkArray[] = [
  { id: 'home', label: 'Home', url: '/' },
  { id: 'datasets', label: 'Datasets', url: '/datasets' },
  {
    id: 'resources',
    label: 'Resources',
    url: '/resources',
    submenu: [
      { id: 'api', label: 'API Documentation', url: '/api-docs' },
      { id: 'dictionary', label: 'Data Dictionary', url: '/data-dictionary' },
      { id: 'guides', label: 'User Guides', url: '/guides' },
    ],
  },
  {
    id: 'about',
    label: 'About',
    url: '/about',
    submenu: [
      { id: 'mission', label: 'Our Mission', url: '/about/mission' },
      { id: 'team', label: 'Team', url: '/about/team' },
      { id: 'contact', label: 'Contact Us', url: '/about/contact' },
    ],
  },
];

export const topNavLinks: NavLinkArray[] = [
  { id: 'cms-main', label: 'CMS.gov', url: 'https://www.cms.gov', target: '_blank' },
  { id: 'medicare', label: 'Medicare.gov', url: 'https://www.medicare.gov', target: '_blank' },
  { id: 'medicaid', label: 'Medicaid.gov', url: 'https://www.medicaid.gov', target: '_blank' },
];

export const sampleFaqs: FAQItemType[] = [
  {
    id: 'faq1',
    title: 'What is Open Data?',
    body: 'Open data is data that can be freely used, re-used, and redistributed by anyone.',
    open: false,
  },
  {
    id: 'faq2',
    title: 'How do I access datasets?',
    body: 'You can access datasets via the search or browse features on our site.',
    open: false,
  },
  {
    id: 'faq3',
    title: 'Who maintains the data?',
    body: 'The Open Data team maintains and updates the datasets regularly.',
    open: false,
  },
];
