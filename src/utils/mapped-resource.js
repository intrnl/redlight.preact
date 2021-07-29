let map = new WeakMap();

export function createMappedResource (data) {
	let resource = map.get(data);

	if (!resource) {
		map.set(data, resource = { read: () => data });
	}

	return resource;
}
