<h1 align="center">
  Google Tag
</h1>

<p align="center">
  Agnostic Google Tag library.
</p>

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
import { GoogleTag } from '@hexatool/google-tag';

const gtag = new GoogleTag('G-XXXXXXXXXX');

// Loads Google Tag script
gtag.initialize();

// Sends a page view event
gtag.event('page_view', {
  page_title: 'Home',
  page_location: 'https://example.com',
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

## Hexatool Code Quality Standards

Publishing this package we are committing ourselves to the following code quality standards:

- Respect **Semantic Versioning**: No breaking changes in patch or minor versions
- No surprises in transitive dependencies: Use the **bare minimum dependencies** needed to meet the purpose
- **One specific purpose** to meet without having to carry a bunch of unnecessary other utilities
- **Tests** as documentation and usage examples
- **Well documented ReadMe** showing how to install and use
- **License favoring Open Source** and collaboration
