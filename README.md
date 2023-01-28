# webworker-timer

Timers running inside webworkers.

- no dependencies

## Usage

This package exposes the following methods:

- setTimeout
- setInterval
- clearTimeout
- clearInterval

Just import the methods and use them like usual.

```typescript
import { clearInterval, setInterval } from '@rweich/webworker-timer';

const interval = setInterval(
  () => console.log('interval called'),
  500
);

clearInterval(interval);
```
