import { createContext } from 'preact';
import { useContext, useErrorBoundary } from 'preact/hooks';


let ErrorContext = createContext(null);

export function useErrorContext () {
	return useContext(ErrorContext);
}

export function ErrorBoundary (props) {
	let { children, fallback, onError } = props;

	let state = useErrorBoundary(onError);
	let [error] = state;

	if (error != null) {
		return (
			<ErrorContext.Provider value={state}>
				{fallback}
			</ErrorContext.Provider>
		);
	} else {
		return children;
	}
}
