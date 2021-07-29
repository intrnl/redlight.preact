Generic error boundary component for Preact

## Usage

```jsx
import { ErrorBoundary, useErrorContext } from '@error-boundary';


function handleNotFoundError (error) {
  // Only handle NotFoundError
  if (!(error instanceof NotFoundError)) {
    throw error;
  }
}

function App () {
  return (
    <ErrorBoundary
      fallback={<NotFound />}
      onError={handleNotFoundError}
    >
      <MyComponent />
    </ErrorBoundary>
  )
}

function NotFound () {
  let [error, reset] = useErrorContext();

  return (
    <div>
      <h1>Uh oh, it's not here!</h1>
      <p>{error.message}</p>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
```
