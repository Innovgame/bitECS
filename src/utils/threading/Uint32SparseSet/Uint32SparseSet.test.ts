import {
	createUint32SparseSet,
	sparseSetAdd,
	sparseSetHas,
	sparseSetRemove,
	sparseSetGetLength,
} from './Uint32SparseSet';
import { test, describe, expect } from 'bun:test';

describe('Uint32SparseSet', () => {
	test('count initially zero', () => {
		const set = createUint32SparseSet(10, 100);
		expect(set.dense.length).toBe(0);
	});

	test('add and has value', () => {
		const set = createUint32SparseSet(10, 100);
		sparseSetAdd(set, 5);
		expect(sparseSetHas(set, 5)).toBe(true);
	});

	test('add value increases count', () => {
		const set = createUint32SparseSet(10, 100);
		sparseSetAdd(set, 1);
		expect(set.dense.length).toBe(1);
		sparseSetAdd(set, 2);
		expect(set.dense.length).toBe(2);
	});

	test('add same value does not increase count', () => {
		const set = createUint32SparseSet(10, 100);
		sparseSetAdd(set, 1);
		sparseSetAdd(set, 1);
		expect(set.dense.length).toBe(1);
	});

	test('remove decreases count', () => {
		const set = createUint32SparseSet(10, 100);
		sparseSetAdd(set, 1);
		sparseSetAdd(set, 2);
		sparseSetRemove(set, 1);
		expect(set.dense.length).toBe(1);
	});

	test('remove non-existent value does not change count', () => {
		const set = createUint32SparseSet(10, 100);
		sparseSetAdd(set, 1);
		sparseSetRemove(set, 2);
		expect(set.dense.length).toBe(1);
	});

	test('has returns false for removed value', () => {
		const set = createUint32SparseSet(10, 100);
		sparseSetAdd(set, 1);
		sparseSetRemove(set, 1);
		expect(sparseSetHas(set, 1)).toBe(false);
	});

	test('remove swaps and updates indices correctly', () => {
		const set = createUint32SparseSet(10, 100);
		sparseSetAdd(set, 1);
		sparseSetAdd(set, 2);
		sparseSetRemove(set, 1);
		expect(sparseSetHas(set, 2)).toBe(true);
		expect(sparseSetHas(set, 1)).toBe(false);
	});

	test('add expands buffer if needed', () => {
		const set = createUint32SparseSet(1, 10);
		sparseSetAdd(set, 1);
		sparseSetAdd(set, 2); // This should trigger an expansion
		expect(sparseSetHas(set, 2)).toBe(true);
	});

	test('expands to max but not over', () => {
		const set = createUint32SparseSet(10, 100);
		for (let i = 0; i < 100; i++) {
			sparseSetAdd(set, i);
		}
		expect(set.dense.length).toBe(100);
	});

	test('add does not expand buffer unnecessarily', () => {
		const initialLength = 10;
		const set = createUint32SparseSet(initialLength, 100);
		for (let i = 0; i < initialLength; i++) {
			sparseSetAdd(set, i);
		}
		expect(set.dense.length).toBe(initialLength);
	});

	test('count, add, remove, and has work with large values', () => {
		const set = createUint32SparseSet(10, 100);
		const largeValue = 2 ** 31; // large int value
		sparseSetAdd(set, largeValue);
		expect(sparseSetHas(set, largeValue)).toBe(true);
		sparseSetRemove(set, largeValue);
		expect(sparseSetHas(set, largeValue)).toBe(false);
	});

	test('getLength returns the correct length', () => {
		const set = createUint32SparseSet(10, 100);
		sparseSetAdd(set, 1);
		sparseSetAdd(set, 2);
		expect(sparseSetGetLength(set)).toBe(2);
	});

});
