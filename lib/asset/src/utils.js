export function isObject (value) {
	return value && typeof value === 'object' && !Array.isArray(value);
}

export function stableStringify (value) {
	return JSON.stringify(value, (_, v) => {
		if (isObject(v)) {
			let keys = Object.keys(v).sort();
			let obj = {};

			for (let key of keys) {
				obj[key] = v[key];
			}

			return obj;
		}

		return v;
	});
}
