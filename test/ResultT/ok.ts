import 'mocha';
import { expect } from 'chai';
import { ResultT } from '../../src/index';
import { expectAnOk, expectASome, expectANone, expectAnErr } from '../util';

describe('#ResultT - Ok', () => {
  it('should have the function isOk', () => {
    const r = ResultT.ok(1);
    expectAnOk(r);
    expect(r.isOk()).to.be.true;
  });

  it('should have the function isErr', () => {
    const r = ResultT.ok(1);
    expectAnOk(r);
    expect(r.isErr()).to.be.false;
  });

  it('should have the function toString', () => {
    const r = ResultT.ok(1);
    expectAnOk(r);
    expect(r.toString()).to.equal(`Ok( 1 )`);
  });

  it('should have the function getOk', () => {
    const r = ResultT.ok(1);
    expectAnOk(r);
    expectASome(r.getOk());
    expect(r.getOk().unwrap()).to.equal(1);
  });

  it('should have the function getErr', () => {
    const r = ResultT.ok(1);
    expectAnOk(r);
    expectANone(r.getErr());
  });

  it('should have the function expect', () => {
    const r = ResultT.ok(1);
    expectAnOk(r);
    expect(r.expect('error!')).to.equal(1);
  });

  it('should have the function expectErr', () => {
    const r = ResultT.ok(1);
    expectAnOk(r);
    expect(() => {
      r.expectErr('error!');
    }).to.throw('error!');
  });

  it('should have the function unwrap', () => {
    const r = ResultT.ok(1);
    expectAnOk(r);
    expect(r.unwrap()).to.equal(1);
  });

  it('should have the function unwrapErr', () => {
    const r = ResultT.ok(1);
    expectAnOk(r);
    expect(() => {
      r.unwrapErr();
    }).to.throw();
  });

  it('should have the function unwrapOr', () => {
    const r = ResultT.ok(1);
    expectAnOk(r);
    expect(r.unwrapOr(2)).to.equal(1);
  });

  it('should have the function unwrapOrElse', () => {
    const r = ResultT.ok(1);
    expectAnOk(r);
    expect(r.unwrapOrElse(e => 2)).to.equal(1);
  });

  it('should have the function map', () => {
    const r = ResultT.ok(1);
    expectAnOk(r);
    const m = r.map(v => v);
    expectAnOk(m);
    expect(m.unwrap()).to.equal(1);
  });

  it('should have the function mapErr', () => {
    const r = ResultT.ok(1);
    expectAnOk(r);
    const m = r.mapErr(v => 2);
    expectAnOk(m);
    expect(m.unwrap()).to.equal(1);
  });

  it('should have the function flatMap', () => {
    const r = ResultT.ok(1);
    expectAnOk(r);
    const double = x => ResultT.ok(x * 2);

    const m = r.flatMap(double);
    expectAnOk(m);
    expect(m.unwrap()).to.equal(2);
  });

  it('should have the function orElse', () => {
    const r = ResultT.ok(1);
    expectAnOk(r);
    const changeError = e => ResultT.err('new error') as ResultT<number, string>;
    const m = r.orElse(changeError);
    expectAnOk(m);
    expect(m.unwrap()).to.equal(1);
  });

  it('should have the function match', () => {
    const r = ResultT.ok(1);
    expectAnOk(r);
    const m = r.match({
      ok: _ => 2,
      err: _ => 'new error',
    });
    expect(m).to.equal(2);
  });

  it('should have the function clone', () => {
    const obj = {};
    const r = ResultT.ok(obj);
    expectAnOk(r);
    const m = r.clone();
    expectAnOk(m);
    expect(m.unwrap()).to.equal(obj);
  });

  it('should have the function equals', () => {
    const r = ResultT.ok(1);
    const r2 = ResultT.ok(1);
    expectAnOk(r);
    expectAnOk(r2);
    expect(r.equals(r2)).to.be.true;

    const r3 = ResultT.ok(2);
    expectAnOk(r3);
    expect(r.equals(r3)).to.be.false;

    const r4 = ResultT.err(1);
    expectAnErr(r4);
    expect(r.equals(r4)).to.be.false;
  });

  it('should have the function hasValue', () => {
    const r = ResultT.ok(1);
    expectAnOk(r);

    expect(r.hasValue(1)).to.be.true;
    expect(r.hasValue('two')).to.be.false;

    const obj = {};
    const r2 = ResultT.ok(obj);
    expectAnOk(r2);

    expect(r2.hasValue(obj)).to.be.true;
    expect(r2.hasValue({})).to.be.false;
  });

  it('should have the function contains', () => {
    const r = ResultT.ok({ a: 'b' });
    expectAnOk(r);

    const aEqualsB = function(x) {
      return x.a === 'b'
    };

    const aEqualsC = function(x) {
      return x.a === 'c';
    };

    expect(r.contains(aEqualsB)).to.be.true;
    expect(r.contains(aEqualsC)).to.be.false;
  });
});