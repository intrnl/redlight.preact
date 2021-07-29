import { ResponseError } from '~/src/lib/api';


export function handleNotFoundError (error) {
	if (!(error instanceof ResponseError) || error.response.status !== 404) {
		throw error;
	}
}
