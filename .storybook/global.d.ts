declare module '*.css' {
  const css: string;
  export default css;
}

declare module '*.css?inline' {
  const css: string;
  export default css;
}

declare module '@cmsgov/design-system/css/index.css';
declare module '@fortawesome/fontawesome-free/css/all.css';
declare module './font-awesome-overrides.css';

declare module '@cmsgov/design-system/css/core-theme.css?inline' {
  const css: string;
  export default css;
}

declare module '@cmsgov/ds-healthcare-gov/css/healthcare-theme.css?inline' {
  const css: string;
  export default css;
}

declare module '@cmsgov/ds-medicare-gov/css/medicare-theme.css?inline' {
  const css: string;
  export default css;
}

declare module '@cmsgov/ds-cms-gov/css/cmsgov-theme.css?inline' {
  const css: string;
  export default css;
}
