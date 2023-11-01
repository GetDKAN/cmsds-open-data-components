# cmsds-open-data-components

This repo acts as an upstream common react library for CMS Open Data sites. This library is powered by [Parcel](https://parceljs.org/).

## Local Development

For local development, we recommend using [npm workspaces](https://docs.npmjs.com/cli/v7/using-npm/workspaces).
Once you have a workspace directory, install this library inside your workspace along any Open Data downstream sites you wish to work on.

In the root folder for this project, run `npm run watch` to build local code. Ensure the upstream is using the same version number located in package.json of this repo. Start the upstream site locally as well, and it should load local code from this repo as the dependency. Parcel also provides hot rebuilding while `watch` is running.

## Publishing new versions

Run ```npm run build``` to create a production version of the library before publishing to npm.
Run ```npm publish``` to publish to npm

## Testing

Jest tests can be run using:
```npm run test```