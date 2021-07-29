import { h, createContext } from 'preact';
import { useContext } from 'preact/hooks';


let CacheContext = createContext(null);

export function CacheProvider (props) {
	let { children, cache } = props;

	return (
		<CacheContext.Provider value={cache}>
			{children}
		</CacheContext.Provider>
	);
}

export function useCache () {
	return useContext(CacheContext);
}
