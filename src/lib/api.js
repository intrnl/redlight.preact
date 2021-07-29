import { createAsset } from "~/lib/asset";


export class ResponseError extends Error {
	constructor (response) {
		super(`Response error ${response.status}`);
		this.response = response;
	}
}

async function fetcher (url, options) {
	let resp = await fetch(url, options);
	if (!resp.ok)	throw new ResponseError(resp);

	return resp.json();
}


let BASE_URL = 'https://www.reddit.com';

export let about = createAsset((id) => {
	let url = new URL(`/r/${id}/about.json`, BASE_URL);

	return fetcher(url);
});

export let feed = createAsset((id, options) => {
	let { sort, before, after } = options;

	let url = new URL(`/r/${id}/${sort}.json`, BASE_URL);
	if (before) url.searchParams.set('before', before);
	if (after) url.searchParams.set('after', after);

	return fetcher(url);
});
