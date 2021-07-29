import { useMemo, useState, useRef, useEffect } from 'preact/hooks';

import { useCache } from './provider';
import { stableStringify } from './utils';


export function createAsset (fetcher) {
	return new Asset(fetcher);
}


let _id = 0;

class Asset {
	id;
	fetcher;

	constructor (fetcher, id = _id++) {
		this.id = id;
		this.fetcher = fetcher;
	}

	get (...args) {
		let id = this.id;
		let fetcher = this.fetcher;

		let key = stableStringify([id, args]);

		return useMemo(() => (
			new AssetResource(key, fetcher, args)
		), [key]);
	}

	read (...args) {
		return this.get(...args).read();
	}
}

class AssetResource {
	#fetcher;
	#args;
	#key;

	constructor (key, fetcher, args) {
		this.#fetcher = fetcher;
		this.#args = args;
		this.#key = key;
	}

	read () {
		let fetcher = this.#fetcher;
		let args = this.#args;
		let key = this.#key;

		let [, forceUpdate] = useState();
		let cache = useCache();

		let initializeRef = useRef();
		let recordRef = useRef();

		if (!recordRef.current) {
			let record = cache.read(key);

			if (!record) {
				record = createRecord(execute(fetcher, args));
				cache.write(key, record);
				initializeRef.current = true;
			}

			recordRef.current = record;
		}

		useEffect(() => {
			return cache.subscribe(key, (record) => {
				recordRef.current = record;
				forceUpdate({});
			});
		}, []);

		let record = recordRef.current;

		if (record.status === 'pending') {
			throw record.promise;
		}
		if (record.status === 'rejected') {
			throw record.error;
		}

		return record.value;
	}
}

function execute (fn, args) {
	return (async () => fn(...args))();
}

function createRecord (promise) {
	let record = {
		status: 'pending',
		promise: promise,
		value: null,
		error: null,
	};

	promise.then(
		(value) => {
			record.status = 'fulfilled';
			record.value = value;
		},
		(error) => {
			record.status = 'rejected';
			record.error = error;
		},
	);

	return record;
}
