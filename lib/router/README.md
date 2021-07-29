Tiny router solution for Preact.

## Recommendations

### Dedicated AppRouter component

Due to the usage of elements to express routing, it might be necessary to
create a dedicated component for it, so they don't get affected by unnecesary
re-rendering, which can cause excessive matching of routes.

```jsx
function App () {
  return (
    <Router history={history}>
      <AppRouter />
    </Router>
  )
}

function AppRouter () {
  return (
    <Routes>
      <Route path='/' element={<IndexPage />} />
    </Routes>
  );
}
```
