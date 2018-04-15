import FlOption from '../../src/fantasy-land/FlOption';
import { OptionT } from '../../src/nullshield';
import fl from 'fantasy-land';

describe('FlOption', () => {
  it('should satisfy Functor laws', () => {
    const one = FlOption.of(1);
    const none = FlOption.empty();

    expect(one).toHaveProperty('map');
    expect(one.map).toBeInstanceOf(Function);

    expect(none).toHaveProperty('map');
    expect(none.map).toBeInstanceOf(Function);

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
    const one = FlOption.of(1);
    const two = FlOption.of(2);
    const three = FlOption.of(3);
    const none = FlOption.empty();

    expect(one).toHaveProperty('ap');
    expect(one.ap).toBeInstanceOf(Function);

    expect(none).toHaveProperty('ap');
    expect(none.ap).toBeInstanceOf(Function);

    const add2 = FlOption.of(x => x + 2);
    const double = FlOption.of(x => x * 2);

    expect(one.ap(double)).toEqual(two);
    expect(none.ap(double)).toEqual(none);

    // composition
    // v.ap(u.ap(a.map(f => g => x => f(g(x))))) is equivalent to v.ap(u).ap(a)
    expect(
      one.ap(add2.ap(double.map(h => i => x => h(i(x)))))
    ).toEqual(
      one.ap(add2).ap(double)
    );
  });

  it('should satisfy Applicative laws', () => {
    expect(FlOption).toHaveProperty('of');
    expect(FlOption.of).toBeInstanceOf(Function);

    const one = FlOption.of(1);
    const double = x => x * 2;
    const add2 = FlOption.of(x => x + 2);

    // identity
    // v.ap(A.of(x => x)) is equivalent to v
    expect(one.ap(FlOption.of(x => x))).toEqual(one);

    // homomorphism
    // A.of(x).ap(A.of(f)) is equivalent to A.of(f(x))
    expect(
      FlOption.of(1).ap(FlOption.of(double))
    ).toEqual(
      FlOption.of(double(1))
    );

    // interchange
    // A.of(y).ap(u) is equivalent to u.ap(A.of(f => f(y)))
    expect(
      FlOption.of(double).ap(add2)
    ).toEqual(
      add2.ap(FlOption.of(f => f(double)))
    );
  });

  it('should satisfy Chain laws', () => {

    const one = FlOption.of(1);
    const double = x => FlOption.of(x * 2);
    function halve(x): FlOption<number> {
      return x % 2 === 0 ? FlOption.of(x / 2) : FlOption.empty();
    }

    // associativity
    // m.chain(f).chain(g) is equivalent to m.chain(x => f(x).chain(g))
    expect(
      one.chain(double).chain(halve)
    ).toEqual(
      one.chain(x => double(x).chain(halve))
    );

    expect(
      one.chain(halve).chain(double)
    ).toEqual(
      one.chain(x => halve(x).chain(double))
    );
  });

  it('should satisfy Monad laws', () => {
    const one = FlOption.of(1);
    const double = x => FlOption.of(x * 2);

    // left identity
    // M.of(a).chain(f) is equivalent to f(a)
    expect(
      FlOption.of(1).chain(double)
    ).toEqual(
      double(1)
    );

    // right identity
    // m.chain(M.of) is equivalent to m
    expect(
      one.chain(FlOption.of)
    ).toEqual(
      one
    );
  });

  it('should satisfy Semigroup laws', () => {
    const one = FlOption.of(1);
    const two = FlOption.of(2);
    const three = FlOption.of(3);
    const none = FlOption.empty();

    expect(
      one.concat(two).concat(three)
    ).toEqual(
      one.concat(two.concat(three))
    );

    expect(
      one.concat(none).concat(three)
    ).toEqual(
      one.concat(none.concat(three))
    );
  });

  it('should satisfy Monoid laws', () => {
    const one = FlOption.of(1);

    expect(
      one.concat(FlOption.empty())
    ).toEqual(
      one
    );

    expect(
      FlOption.empty().concat(one)
    ).toEqual(
      one
    );
  });

  it('should be creatable from an OptionT', () => {
    expect(
      OptionT.some(1).toFantasyLand()
    ).toEqual(
      FlOption.of(1)
    );

    expect(
      OptionT.none().toFantasyLand()
    ).toEqual(
      FlOption.empty()
    );
  });
});
