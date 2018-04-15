import CoreOption from '../src/fantasyland/CoreOption';

describe('CoreOption', () => {
  it('should satisfy Functor laws', () => {
    const one = CoreOption.some(1);
    const none = CoreOption.none();

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
    const one = CoreOption.some(1);
    const two = CoreOption.some(2);
    const three = CoreOption.some(3);
    const none = CoreOption.none();

    expect(one).toHaveProperty('ap');
    expect(one.ap).toBeInstanceOf(Function);
    
    expect(none).toHaveProperty('ap');
    expect(none.ap).toBeInstanceOf(Function);

    const add2 = CoreOption.some(x => x + 2);
    const double = CoreOption.some(x => x * 2);

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
    expect(CoreOption).toHaveProperty('of');
    expect(CoreOption.of).toBeInstanceOf(Function);

    const one = CoreOption.some(1);
    const double = x => x * 2;
    const add2 = CoreOption.some(x => x + 2);

    // identity
    // v.ap(A.of(x => x)) is equivalent to v
    expect(one.ap(CoreOption.of(x => x))).toEqual(one);

    // homomorphism
    // A.of(x).ap(A.of(f)) is equivalent to A.of(f(x))
    expect(
      CoreOption.of(1).ap(CoreOption.of(double))
    ).toEqual(
      CoreOption.of(double(1))
    );

    // interchange
    // A.of(y).ap(u) is equivalent to u.ap(A.of(f => f(y)))
    expect(
      CoreOption.of(double).ap(add2)
    ).toEqual(
      add2.ap(CoreOption.of(f => f(double)))
    );
  });

  it('should satisfy Chain laws', () => {

    const one = CoreOption.some(1);
    const double = x => CoreOption.some(x * 2);
    function halve(x): CoreOption<number> {
      return x % 2 === 0 ? CoreOption.some(x / 2) : CoreOption.none();
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
    const one = CoreOption.some(1);
    const double = x => CoreOption.of(x * 2);
    
    // left identity
    // M.of(a).chain(f) is equivalent to f(a)
    expect(
      CoreOption.of(1).chain(double)
    ).toEqual(
      double(1)
    );

    // right identity
    // m.chain(M.of) is equivalent to m
    expect(
      one.chain(CoreOption.of)
    ).toEqual(
      one
    );
  });

  it('should have from method', () => {
    const something = CoreOption.from(1);
    const nothing = CoreOption.from(null);
    expect(something).toEqual(CoreOption.some(1));
    expect(nothing).toEqual(CoreOption.none());
  });
});
