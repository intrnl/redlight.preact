Barebones interaction hooks for Preact

```jsx
import { useHover } from '@interactions';

export function App () {
  let [hovered, onHoverChange] = useState(false);

  let ref = useRef();
  useHover(ref, { onHoverChange });


  return (
    <div ref={ref}>
      is hovered: {hovered}
    </div>
  );
}
```
