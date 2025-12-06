import { test, describe, expect } from 'bun:test'
import { growBuffer } from './growBuffer';

describe('growBuffer', () => {
	test('grow with replace strategy', () => {
		const initialCapacity = 10;
		const newCapacity = 20;
		// @ts-expect-error
		const buffer = new SharedArrayBuffer(initialCapacity * Uint32Array.BYTES_PER_ELEMENT, {
			maxByteLength: 100 * Uint32Array.BYTES_PER_ELEMENT,
		});
		const newBuffer = growBuffer(buffer, newCapacity);

		expect(newBuffer.byteLength).toBe(newCapacity * Uint32Array.BYTES_PER_ELEMENT);
	});
});
