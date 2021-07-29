import { useEffect } from 'preact/hooks';
import { useNavigate, useParams } from '~/lib/router';


export function Redirect (props) {
	let { to, replace = true } = props;

	let navigate = useNavigate();
	let params = useParams();

	useEffect(() => {
		let path = generatePath(to, params);
		navigate(path, { replace });
	}, [navigate]);

	return null;
}

export function generatePath (path, map) {
	return path
		.replace(/:(\w+)/g, (_, p) => map[p] || '')
		.replace(/\/*\*$/, () => map['$'] == null ? '' : map['$'].replace(/^\/*/, '/'));
}
