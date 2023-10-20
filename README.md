<h1 align="center">
  Google Tag
</h1>

<p align="center">
  Agnostic Google Tag library.
</p>

<p align="center">
    <a href="https://www.npmjs.com/package/@hexatool/google-tag">
        <img src="https://img.shields.io/npm/v/@hexatool/google-tag.svg" alt="@hexatool/google-tag version">
    </a>
    <a href="https://www.npmjs.com/package/@hexatool/google-tag">
        <img src="https://img.shields.io/npm/dw/@hexatool/google-tag" alt="@hexatool/google-tag npm downloads">
    </a>
    <a href="https://github.com/hexatool/google-tag/blob/main/LICENSE">
        <img src="https://img.shields.io/github/license/hexatool/google-tag" alt="@hexatool/google-tag license">   
    </a>
    <a href="https://github.com/hexatool/google-tag/actions/workflows/ci.yml">
        <img src="https://img.shields.io/github/actions/workflow/status/hexatool/google-tag/ci.yml" alt="@hexatool/google-tag license">   
    </a>
    <a href="https://github.com/hexatool/google-tag/issues">
        <img src="https://img.shields.io/github/issues/hexatool/google-tag" alt="@hexatool/google-tag license">   
    </a>
</p>

- [Installation](#installation)
- [How to use](#how-to-use)
- [API](#api)
  - [`GoogleTag`](#googletag)
    - [`constructor()`](#constructor)
  - [`GoogleTagOptions`](#googletagoptions)

## Installation

```bash
npm install --save @hexatool/google-tag
```

**Using bun**

```bash
bun add @hexatool/google-tag
```

**Using yarn**

```bash
yarn add @hexatool/google-tag
```

**Using pnpm**

```bash
pnpm add @hexatool/google-tag
```

## How to use

```typescript
import { GoogleTag } from "@hexatool/google-tag";

const gtag = new GoogleTag("G-XXXXXXXXXX");

// Loads Google Tag script
gtag.initialize();

// Sends a page view event
gtag.event("page_view", {
  page_title: "Home",
  page_location: "https://example.com",
});
```

**Using with React**

```typescript
import { useGoogleTag } from '@hexatool/google-tag/react';

const App = () => {
  const gtag = useGoogleTag('G-XXXXXXXXXX');

  useEffect(() => {
    gtag.initialize();
  }, []);

  const handleClick = () => {
    ...
    gtag.event('click', { category: 'button', label: 'Lorem ipsum' });
  };

  return (
    <main>
      <h1>Lorem ipsum</h1>

      <button onClick={handleClick}>
        Click me
      </button>
    </main>
  );
};
```

## API

### `GoogleTag`

Main class to interact with Google Tag.

#### `constructor()`

Creates a new instance of GoogleTag.

**With only measurement ids**

```typescript
const gtag = new GoogleTag("G-XXXXXXXXXX", "AW-XXXXXXXXXX");
```

**With extra options**

See documentation for [GoogleTagOptions](#googletagoptions).

```typescript
const gtag = new GoogleTag({
  allowAdPersonalizationSignals: false,
  layer: "customLayer",
  measurementId: "G-XXXXXXXXXX",
  testMode: false,
});
```

**With measurement id options**

```typescript
const gtag = new GoogleTag({
  measurementId: {
    cookie_prefix: "my_prefix",
    measurementId: "G-XXXXXXXXXX",
  },
});
```

**With multiple measurement ids**

```typescript
const gtag = new GoogleTag({
  measurementId: [
    "AW-XXXXXXXXXX",
    {
      cookie_prefix: "my_prefix",
      measurementId: "G-XXXXXXXXXX",
    },
  ],
});
```

### `GoogleTagMeasurementId`

- **Type**: `string`
- **Allowed values**: `G-XXXXXXXXXX | GT-XXXXXXXXXX | AW-XXXXXXXXXX | DC-XXXXXXXXXX`

### `GoogleTagOptions`

#### `allowAdPersonalizationSignals`

- **Type**: `false`
- **Default**: `undefined`

#### `layer`

- **Type**: `string`
- **Default**: `"dataLayer"`

#### `measurementId`

- **Type**: `GoogleTagMeasurementId | GoogleTagConfigWithMeasurementId | (GoogleTagMeasurementId | GoogleTagConfigWithMeasurementId)[]`
- **Default**: `undefined`

#### `testMode`

- **Type**: `boolean`
- **Default**: `false`

### `GoogleTagConfigWithMeasurementId`

#### `allow_ad_personalization_signals`

- **Type**: `boolean`
- **Default**: `true`
- **Documentation**: See [full documentation](https://developers.google.com/analytics/devguides/collection/ga4/reference/config#allow_ad_personalization_signals).

#### `allow_google_signals`

- **Type**: `boolean`
- **Default**: `true`
- **Documentation**: See [full documentation](https://developers.google.com/analytics/devguides/collection/ga4/reference/config#allow_google_signals).

#### `campaign_content`

- **Type**: `string`
- **Default**: `undefined`
- **Documentation**: See [full documentation](https://developers.google.com/analytics/devguides/collection/ga4/reference/config#campaign_content).

#### `campaign_id`

- **Type**: `string`
- **Default**: `undefined`
- **Documentation**: See [full documentation](https://developers.google.com/analytics/devguides/collection/ga4/reference/config#campaign_id).

#### `campaign_medium`

- **Type**: `string`
- **Default**: `undefined`
- **Documentation**: See [full documentation](https://developers.google.com/analytics/devguides/collection/ga4/reference/config#campaign_medium).

#### `campaign_name`

- **Type**: `string`
- **Default**: `undefined`
- **Documentation**: See [full documentation](https://developers.google.com/analytics/devguides/collection/ga4/reference/config#campaign_name).

#### `campaign_source`

- **Type**: `string`
- **Default**: `undefined`
- **Documentation**: See [full documentation](https://developers.google.com/analytics/devguides/collection/ga4/reference/config#campaign_source).

#### `campaign_term`

- **Type**: `string`
- **Default**: `undefined`
- **Documentation**: See [full documentation](https://developers.google.com/analytics/devguides/collection/ga4/reference/config#campaign_term).

#### `client_id`

- **Type**: `string`
- **Default**: `A randomly generated value for each user.`
- **Documentation**: See [full documentation](https://developers.google.com/analytics/devguides/collection/ga4/reference/config#client_id).

#### `content_group`

- **Type**: `string`
- **Default**: `undefined`
- **Documentation**: See [full documentation](https://developers.google.com/analytics/devguides/collection/ga4/reference/config#content_group).

#### `cookie_domain`

- **Type**: `string`
- **Default**: `"auto"`
- **Documentation**: See [full documentation](https://developers.google.com/analytics/devguides/collection/ga4/reference/config#cookie_domain).

#### `measurementId`

- **Type**: `GoogleTagMeasurementId`
- **Default**: `undefined`

## Hexatool Code Quality Standards

Publishing this package we are committing ourselves to the following code quality standards:

- Respect **Semantic Versioning**: No breaking changes in patch or minor versions
- No surprises in transitive dependencies: Use the **bare minimum dependencies** needed to meet the purpose
- **One specific purpose** to meet without having to carry a bunch of unnecessary other utilities
- **Tests** as documentation and usage examples
- **Well documented README** showing how to install and use
- **License favoring Open Source** and collaboration
