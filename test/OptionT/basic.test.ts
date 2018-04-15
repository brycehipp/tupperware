import { OptionT } from '../../src/nullshield';
import { expectASome, expectANone } from '../util';

describe('#OptionT.of', () => {
  it('should choose the appropriate class based on the value', () => {
    expect(OptionT.of(null).isNone()).toEqual(true);
    expect(OptionT.of(undefined).isNone()).toEqual(true);
    expect(OptionT.of().isNone()).toEqual(true);
    expect(OptionT.of('foo').isNone()).toEqual(false);

    expect(OptionT.of(null).isSome()).toEqual(false);
    expect(OptionT.of(undefined).isSome()).toEqual(false);
    expect(OptionT.of().isSome()).toEqual(false);
    expect(OptionT.of('foo').isSome()).toEqual(true);
  });

  it('should be able to create a some', () => {
    const maybe1 = OptionT.of(1);
    expectASome(maybe1);
    expect(maybe1.unwrapOr(2)).toEqual(1);
  });

  it('should be able to create a none', () => {
    const maybeNone = OptionT.of(null) as OptionT<any>;
    expectANone(maybeNone);
    expect(maybeNone.unwrapOr(2)).toEqual(2);
  });
});

describe('#OptionT.some', () => {
  it('should create a Some', () => {
    const option = OptionT.some(1);
    expectASome(option);
  });

  it('should throw an error when given null or undefined', () => {
    expect(() => {
      OptionT.some(null);
    }).toThrow();

    expect(() => {
      OptionT.some(undefined);
    }).toThrow();
  });
});

describe('#OptionT.none', () => {
  it('should create a None', () => {
    const option = OptionT.none();
    expectANone(option);
  });

  it('should throw an error if you provide it with a value', () => {
    expect(() => {
      OptionT.none('value');
    }).toThrow();
  });
});

describe('#OptionT', () => {
  it('should be able to be used as a type', () => {
    const f = function (value : string): OptionT<string> {
      return OptionT.of(value);
    };

    const maybeString = f('test!');

    expectASome(maybeString);
    expect(maybeString.unwrap()).toEqual('test!');
  });

  it('Some and None should be compatible with one another', () => {
    const one = OptionT.some(1);
    const nope = OptionT.none();

    expectASome(one);
    expectANone(nope);

    function processOpt<T>(opt: OptionT<T>): OptionT<T> {
      return opt;
    }

    const oneAgain = processOpt(one);
    const nopeAgain = processOpt(nope);

    expectASome(oneAgain);
    expectANone(nopeAgain);
  });

  it('should be of the same type when a Some turns into a None', () => {
    const one = OptionT.of(undefined);
    const two = OptionT.of(null);
    const nope = OptionT.none();

    expectANone(one);
    expectANone(two);
    expectANone(nope);

    function processOpt<T>(opt: OptionT<T>) : OptionT<T> {
      return opt;
    }

    const oneAgain = processOpt(one);
    const twoAgain = processOpt(two);
    const nopeAgain = processOpt(nope);

    expectANone(oneAgain);
    expectANone(twoAgain);
    expectANone(nopeAgain);
  });

  it('should satisfy Functor laws', () => {
    const one = OptionT.some(1);
    const none = OptionT.none();

    // identity
    // u.map(a => a) is equivalent to u
    expect(one.map(x => x)).toEqual(one);
    expect(none.map(x => x)).toEqual(none);

    const f = x => x * 2;
    const g = x => x + 1;

    // composition
    // u.map(x => f(g(x))) is equivalent to u.map(g).map(f)
    expect(one.map(x => f(g(x)))).toEqual(one.map(g).map(f));
    expect(none.map(x => f(g(x)))).toEqual(none.map(g).map(f));
  });

  it('should satisfy Apply laws', () => {
    const one = OptionT.some(1);
    const two = OptionT.some(2);
    const three = OptionT.some(3);
    const none = OptionT.none();

    const add2 = OptionT.some(x => x + 2);
    const double = OptionT.some(x => x * 2);

    expect(one.mapBy(double)).toEqual(two);
    expect(none.mapBy(double)).toEqual(none);

    // composition
    // v.ap(u.ap(a.map(f => g => x => f(g(x))))) is equivalent to v.ap(u).ap(a)
    expect(
      one.mapBy(add2.mapBy(double.map(h => i => x => h(i(x)))))
    ).toEqual(
      one.mapBy(add2).mapBy(double)
    );
  });

  it('should satisfy Applicative laws', () => {
    const one = OptionT.some(1);
    const double = x => x * 2;
    const add2 = OptionT.some(x => x + 2);

    // identity
    // v.ap(A.of(x => x)) is equivalent to v
    expect(one.mapBy(OptionT.some(x => x))).toEqual(one);

    // homomorphism
    // A.of(x).ap(A.of(f)) is equivalent to A.of(f(x))
    expect(
      OptionT.some(1).mapBy(OptionT.some(double))
    ).toEqual(
      OptionT.some(double(1))
    );

    // interchange
    // A.of(y).ap(u) is equivalent to u.ap(A.of(f => f(y)))
    expect(
      OptionT.some(double).mapBy(add2)
    ).toEqual(
      add2.mapBy(OptionT.some(f => f(double)))
    );
  });

  it('should satisfy Chain laws', () => {
    const one = OptionT.some(1);
    const double = x => OptionT.some(x * 2);
    function halve(x): OptionT<number> {
      return x % 2 === 0 ? OptionT.some(x / 2) : OptionT.none();
    }

    // associativity
    // m.chain(f).chain(g) is equivalent to m.chain(x => f(x).chain(g))
    expect(
      one.flatMap(double).flatMap(halve)
    ).toEqual(
      one.flatMap(x => double(x).flatMap(halve))
    );

    expect(
      one.flatMap(halve).flatMap(double)
    ).toEqual(
      one.flatMap(x => halve(x).flatMap(double))
    );
  });

  it('should satisfy Monad laws', () => {
    const one = OptionT.some(1);
    const double = x => OptionT.some(x * 2);

    // left identity
    // M.of(a).chain(f) is equivalent to f(a)
    expect(
      OptionT.some(1).flatMap(double)
    ).toEqual(
      double(1)
    );

    // right identity
    // m.chain(M.of) is equivalent to m
    expect(
      one.flatMap(OptionT.of)
    ).toEqual(
      one
    );
  });

  it('should satisfy Semigroup laws', () => {
    const one = OptionT.some(1);
    const two = OptionT.some(2);
    const three = OptionT.some(3);
    const none = OptionT.none();

    expect(
      one.or(two).or(three)
    ).toEqual(
      one.or(two.or(three))
    );

    expect(
      one.or(none).or(three)
    ).toEqual(
      one.or(none.or(three))
    );
  });

  it('should satisfy Monoid laws', () => {
    const one = OptionT.some(1);

    expect(
      one.or(OptionT.none())
    ).toEqual(
      one
    );

    expect(
      OptionT.none().or(one)
    ).toEqual(
      one
    );
  });
});
