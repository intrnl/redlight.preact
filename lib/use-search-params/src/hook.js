import { useCallback, useMemo, useRef } from 'preact/hooks';
import { useLocation, useNavigate } from '~/lib/router';


export function useSearchParams (init) {
	let defaultRef = useRef(init);

	let location = useLocation();
	let searchParams = useMemo(() => {
		let params = new URLSearchParams(location.search);
		let map = {};

		for (let [key, value] of params) {
			if (key in map) {
				if (!Array.isArray(map[key])) map[key] = [map[key]];
				map[key].push(value);
			} else {
				map[key] = value;
			}
		}

		for (let [key, value] of Object.entries(defaultRef.current)) {
			if (!(key in map)) {
				map[key] = value;
			}
		}

		return map;
	}, [location.search]);

	let navigate = useNavigate();
	let setSearchParams = useCallback((map, options = {}) => {
		let { swap, replace } = options;
		let params = new URLSearchParams();

		if (!swap) {
			map = { ...params, ...map };
		}

		for (let [key, value] of Object.entries(map)) {
			if (Array.isArray(value)) {
				for (let v of value) {
					params.append(key, v);
				}
			} else {
				params.append(key, value);
			}
		}

		navigate('?' + params.toString(), { replace });
	}, [searchParams, navigate]);

	return [searchParams, setSearchParams];
}

