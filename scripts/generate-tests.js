const childProcess = require('child_process');
const fs = require('fs');
const path = require('path');

const getManifest = (frameworkName, version, testCommand) =>
  JSON.stringify(
    {
      name: `add-matchers-${frameworkName}-${version}`,
      version: version,
      devDependencies: {
        'add-matchers': require('../package.json').version,
        [frameworkName]: version,
      },
      private: true,
      scripts: {
        test: testCommand,
      },
    },
    null,
    2,
  );

const getSuite = (frameworkName, version) =>
  `
const { addMatchers } = require('add-matchers');

addMatchers({
  toBeFoo: (value) => value === 'foo',
  toInclude: (a, value) => value.includes(a),
  toBeBetween: (a, b, value) => value >= a && value <= b,
  toHaveFoo: (key, value) => value[key] === 'foo',
  toHaveIncluding: (key, a, value) => value[key].includes(a),
  toHaveBetween: (key, a, b, value) => value[key] >= a && value[key] <= b,
});
describe('add-matchers-${frameworkName}-${version}', () => {
  it('should register custom matchers', () => {
    expect('foo').toBeFoo();
    expect({ key: 'foo' }).toHaveFoo('key');
    expect('foo').toInclude('f');
    expect({ member: 'foo' }).toHaveIncluding('member', 'f');
    expect(2).toBeBetween(1, 3);
    expect({ prop: 2 }).toHaveBetween('prop', 1, 3);
  });

  it('should handle optional messages passed to custom matchers', () => {
    expect('foo').toBeFoo('some message');
    expect({ key: 'foo' }).toHaveFoo('key', 'some message');
    expect(2).toBeBetween(1, 3, 'some message');
    expect({ prop: 2 }).toHaveBetween('prop', 1, 3, 'some message');
  });
});
`.trimLeft();

const getVersions = (packageName) =>
  JSON.parse(
    childProcess.spawnSync('npm', ['view', packageName, 'versions', '--json'], {
      encoding: 'utf8',
    }).stdout,
  );

getVersions('jest')
  .filter((version, i, all) => version.search(/[^0-9.]/) === -1 && all.indexOf('23.0.0') <= i)
  .forEach((version) => {
    const frameworkName = 'jest';
    const testFileName = 'e2e.spec.js';
    const testCommand = `jest ./${testFileName}`;
    const dirPath = path.join(process.cwd(), 'test', `${frameworkName}-${version}`);
    const suitePath = path.join(dirPath, testFileName);
    const suiteSource = getSuite(frameworkName, version);
    const manifestPath = path.join(dirPath, 'package.json');
    const manifestSource = getManifest(frameworkName, version, testCommand);
    console.log('%s@%s', frameworkName, version);
    childProcess.spawnSync('mkdir', ['-p', dirPath]);
    fs.writeFileSync(manifestPath, manifestSource);
    fs.writeFileSync(suitePath, suiteSource);
  });

getVersions('jasmine')
  .filter((version, i, all) => version.search(/[^0-9.]/) === -1 && all.indexOf('2.5.0') <= i)
  .forEach((version) => {
    const frameworkName = 'jasmine';
    const testFileName = 'e2e.spec.js';
    const testCommand = 'jasmine';
    const dirPath = path.join(process.cwd(), 'test', `${frameworkName}-${version}`);
    const suitePath = path.join(dirPath, testFileName);
    const suiteSource = getSuite(frameworkName, version);
    const manifestPath = path.join(dirPath, 'package.json');
    const manifestSource = getManifest(frameworkName, version, testCommand);
    const configPath = path.join(dirPath, 'spec/support/jasmine.json');
    const configSource = JSON.stringify({ spec_files: ['**/*.spec.js'] }, null, 2);
    console.log('%s@%s', frameworkName, version);
    childProcess.spawnSync('mkdir', ['-p', dirPath]);
    childProcess.spawnSync('mkdir', ['-p', path.join(dirPath, 'spec/support')]);
    fs.writeFileSync(manifestPath, manifestSource);
    fs.writeFileSync(suitePath, suiteSource);
    fs.writeFileSync(configPath, configSource);
  });
