# cmsds-open-data-components

This repo acts as an upstream common react library for CMS Open Data sites. This library is powered by [Parcel](https://parceljs.org/).

## Local Development

For local development, we recommend using [npm workspaces](https://docs.npmjs.com/cli/v7/using-npm/workspaces).
Once you have a workspace directory, install this library inside your workspace along any Open Data downstream sites you wish to work on.

In the root folder for this project, run `npm run watch` to build local code. Ensure the upstream is using the same version number located in package.json of this repo. Start the upstream site locally as well, and it should load local code from this repo as the dependency. Parcel also provides hot rebuilding while `watch` is running.

## Publishing new versions

### Clear out caches and previous build

Before running a build, it is recommended to clear out the old build and cache files to avoid publishing a stale build.

Run ```rm -rf dist/``` to delete the previous build\
Run ```rm -rf .parcel-cache/``` to clear out the parcel build caches

### Create a new release

Run ```npm run build``` to create a production version of the library before publishing to npm.\
Run ```npm publish``` to publish to npm

### Create an alpha/testing release

When creating an alpha release or any other release intended for testing purposes, add a tag to the publish command. This will prevent the the testing release from showing up as the latest release in NPM. 

After running ```npm run build```,\
Run ```npm publish --tag <tag name>``` example (npm publish --tag "alpha")

## Testing

Jest tests can be run using:
```npm run test```