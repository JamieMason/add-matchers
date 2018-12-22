const { addMatchers } = require('../dist');

addMatchers({
  toBeFoo: (value) => value === 'foo',
  toInclude: (a, value) => value.includes(a),
  toBeBetween: (a, b, value) => value >= a && value <= b,
  toHaveFoo: (key, value) => value[key] === 'foo',
  toHaveIncluding: (key, a, value) => value[key].includes(a),
  toHaveBetween: (key, a, b, value) => value[key] >= a && value[key] <= b
});

describe('add-matchers', () => {
  it('should register custom matchers', () => {
    expect('foo').toBeFoo();
    expect({ key: 'foo' }).toHaveFoo('key');
    expect('foo').toInclude('f');
    expect({ member: 'foo' }).toHaveIncluding('member', 'f');
    expect(2).toBeBetween(1, 3);
    expect({ prop: 2 }).toHaveBetween('prop', 1, 3);
  });
});
