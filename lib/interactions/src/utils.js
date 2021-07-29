export function addEvent (node, event, listener, options) {
	node.addEventListener(event, listener, options);
}

export function removeEvent (node, event, listener, options) {
	node.removeEventListener(event, listener, options);
}


export function testPlatform (regexp) {
	let platform = globalThis.navigator?.platform;
	return platform ? regexp.test(platform) : false;
}

export function isMac () {
	return testPlatform(/^Mac/);
}
