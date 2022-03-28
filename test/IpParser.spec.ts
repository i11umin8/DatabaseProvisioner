// import { IpListFinder } from "../src/util/IpListFinder";
// import { stringify } from "querystring";
// import * as sinon from 'sinon'
import * as Db from 'mongodb';
import { ImportMock } from 'ts-mock-imports'
import * as IpMapBuilder from  '../src/util/IpMapBuilder'
import * as assert from 'assert'
import * as fs from 'fs'
import { IpSetParser } from '../src/util/IpSetParser'

describe('IpParser', function () {
  it('should parse and return ips from a given file input', async function () {
    const fileTest = `
    192.168.0.1
    192.168.1.1
    `
    const stub = ImportMock.mockFunction(fs, 'readFileSync', fileTest)
    const output = IpSetParser.parseIpSet("testpath")
    assert.deepEqual( output.ips, ['192.168.0.1', '192.168.1.1'])
    assert.equal(output.key, 'testpath')
    stub.restore()
  });
  it('should should only return ips', async function () {
    const fileTest = `
    #comment
    192.168.0.1
    10.128.240.50/30
    completely irrelevant data
    `
    const stub = ImportMock.mockFunction(fs, 'readFileSync', fileTest)
    const output = IpSetParser.parseIpSet("testpath")
    assert.deepEqual( output.ips, ['192.168.0.1'])
    stub.restore()
  });
});