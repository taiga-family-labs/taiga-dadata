# Taiga DaData

DaData API integration for Angular and Taiga UI.

## Demo

GitHub Pages: https://taiga-family-labs.github.io/taiga-dadata/

The demo asks for a DaData API token at runtime. The token is kept only in memory and is not committed or bundled into the application.

## Install

```bash
npm i @taiga-ui-labs/dadata
```

## Usage

```ts
import {provideHttpClient} from '@angular/common/http';
import {bootstrapApplication} from '@angular/platform-browser';
import {provideTuiDaData} from '@taiga-ui-labs/dadata';

bootstrapApplication(AppComponent, {
    providers: [
        provideHttpClient(),
        provideTuiDaData({token: 'YOUR_DADATA_TOKEN'}),
    ],
});
```

```ts
import {inject} from '@angular/core';
import {TuiDaDataService} from '@taiga-ui-labs/dadata';

const dadata = inject(TuiDaDataService);

const suggestions$ = dadata.suggestAddress({
    query: 'Moscow Tverskaya',
    count: 10,
});
```

A token getter is also supported for applications where the token can change at runtime:

```ts
provideTuiDaData({token: () => tokenSignal()});
```

## Development

```bash
npm ci
npm start
```

Build everything:

```bash
npm run build
```

## GitHub Pages

`.github/workflows/pages.yml` builds the demo with `/taiga-dadata/` as the base href and deploys `dist/demo` using the official GitHub Pages Actions flow.

If Pages has not been enabled for the repository yet, select **Settings → Pages → Build and deployment → Source → GitHub Actions** once.

## Publishing

The library package is published as `@taiga-ui-labs/dadata`. The package manifest sets `publishConfig.access` to `public` so the scoped package can be published publicly to npm.

Publishing is handled by `.github/workflows/publish.yml` when a GitHub Release is published. Use a semver tag prefixed with `v`, for example `v0.1.0`. The committed `0.0.0` version is only a development placeholder: the workflow derives the real package version from the release tag, runs type checking, builds the library and publishes `dist/taiga-dadata` with npm provenance.

For the first publication, add a repository secret named `NPM_TOKEN` with write access to the `@taiga-ui-labs` npm scope. npm currently requires the package to exist before Trusted Publishing can be configured.

After the first publication, configure npm Trusted Publishing for:

- GitHub organization: `taiga-family-labs`
- Repository: `taiga-dadata`
- Workflow: `publish.yml`
- Allowed action: `npm publish`

Then `NPM_TOKEN` can be removed; the same workflow can publish through GitHub Actions OIDC.

## Scope

The first version focuses on address suggestions. The service already has a generic `suggest<T>(type, request)` method so typed integrations for FIO, organizations, banks and other DaData suggestion APIs can be added without introducing new UI components.
