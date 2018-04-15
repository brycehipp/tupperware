
// Monad Algebra
// CoreOption must satisfy:
// 1. M.of(a).chain(f) is equivalent to f(a) (left identity)
// 2. m.chain(M.of) is equivalent to m (right identity)
export default abstract class CoreOption<T> {
  // tslint:disable-next-line:no-empty
  constructor() {}

  static some<V>(val: V): CoreOption<V> {
    return new Some(val);
  }

  static none<V>(): CoreOption<V> {
    return new None();
  }

  // Applicative algebra
  // of must satisfy:
  // 1. v.ap(A.of(x => x)) is equivalent to v (identity)
  // 2. A.of(x).ap(A.of(f)) is equivalent to A.of(f(x)) (homomorphism)
  // 3. A.of(y).ap(u) is equivalent to u.ap(A.of(f => f(y))) (interchange)
  static of<V>(val: V): CoreOption<V> {
    return CoreOption.some(val);
  }

  static from<V>(val?: V): CoreOption<V> {
    if (val === null || typeof val === 'undefined') {
      return CoreOption.none();
    }
    return CoreOption.some(val);
  }

  // Functor algebra
  // map must satisfy:
  // 1. u.map(a => a) is equivalent to u (identity)
  // 2. u.map(x => f(g(x))) is equivalent to u.map(g).map(f) (composition)
  abstract map<U>(func: (val: T) => U): CoreOption<U>; // same as map

  // Apply algebra
  // ap must satisfy:
  // 1. v.ap(u.ap(a.map(f => g => x => f(g(x))))) is equivalent to v.ap(u).ap(a) (composition)
  abstract ap<U>(other: CoreOption<(val: T) => U>): CoreOption<U>; // no current equivalent, technically CoreOption is not a Monad right now!

  // Chain algebra
  // chain must satisfy
  // 1. m.chain(f).chain(g) is equivalent to m.chain(x => f(x).chain(g)) (associativity)
  abstract chain(func: (val: T) => CoreOption<T>): CoreOption<T>; // same as flatMap
}

export class Some<T> extends CoreOption<T> {
  private value: T;

  constructor(val: T) {
    super();
    this.value = val;
  }

  map<U>(func: (val: T) => U): CoreOption<U> {
    return CoreOption.of(func(this.value));
  }
  ap<U>(other: CoreOption<(val: T) => U>): CoreOption<U> {
    return other.map(func => func(this.value));
  }
  chain(func: (val: T) => CoreOption<T>): CoreOption<T> {
    return func(this.value);
  }
}

export class None extends CoreOption<any> {
  constructor() {
    super();
  }

  map<U>(func: (val: any) => U): CoreOption<U> {
    return this;
  }
  ap<U>(other: CoreOption<(val: any) => U>): CoreOption<U> {
    return this;
  }
  chain(func: (val: any) => CoreOption<any>): CoreOption<any> {
    return this;
  }
}
