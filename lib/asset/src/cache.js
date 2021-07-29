export class Cache {
	#map = new Map();

	expireTime;

	constructor (options = {}) {
		this.expireTime = options.expiresAt ?? 15000;
	}

	#ensure (key) {
		let record = this.#map.get(key);

		if (!record) {
			this.#map.set(key, record = {
				value: null,
				expireTime: null,
				expiresAt: null,
				timeoutId: null,
				subscribers: new Set(),
			});
		}

		return record;
	}

	#mark (record, expireTime) {
		let now = Date.now();
		let expiresAt = now + expireTime;

		if (record.expiresAt < expiresAt) {
			record.expireTime = expireTime;
			record.expiresAt = expiresAt;

			clearTimeout(record.timeoutId);

			if (record.subscribers.size < 1) {
				record.timeoutId = setTimeout(() => this.#map.delete(key), expireTime);
			}
		}
	}

	write (key, value, expireTime = this.expireTime) {
		let record = this.#ensure(key);
		this.#mark(record, expireTime);

		if (record.value !== value) {
			record.value = value;

			for (let subscriber of record.subscribers) {
				subscriber(value);
			}
		}
	}

	read (key, expireTime) {
		if (!this.#map.has(key)) return;

		let record = this.#ensure(key);
		this.#mark(record, expireTime ?? record.expireTime);

		return record.value;
	}

	contains (key) {
		return this.#map.has(key);
	}

	subscribe (key, subscriber) {
		let record = this.#ensure(key);

		record.subscribers.add(subscriber);

		if (record.subscribers.size === 1) {
			clearTimeout(record.timeoutId);
		}

		return () => {
			record.subscribers.delete(subscriber);

			if (record.subscribers.size === 0) {
				record.expiresAt = Date.now() + record.expireTime;
				record.timeoutId = setTimeout(() => this.#map.delete(key), record.expireTime);
			}
		};
	}
}
