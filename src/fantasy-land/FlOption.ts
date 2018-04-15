import { OptionT } from '../nullshield';

/**
 * This is a compatibility layer so that [[OptionT]]s can be used
 * in conjunction with other fantasy-land types.
 */
export default abstract class FlOption<T> {
  // Monad algebra (requires Applicative and Chain)

  // Applicative algebra (requires Apply)
  static of<A>(val: A): FlOption<A> {
    return new Some(val);
  }

  // Monoid algebra (requires Semigroup)
  static empty(): FlOption<any> {
    return new None();
  }

  // Functor algebra (root algebra)
  abstract map<U>(func: (val: T) => U): FlOption<U>;

  // Chain algebra (requires Apply)
  abstract chain<U>(func: (val: T) => FlOption<U>): FlOption<U>;

  // Apply algebra (requires Functor)
  abstract ap<U>(other: FlOption<(val: T) => U>): FlOption<U>;

  // Semigroup algebra (root algebra)
  abstract concat(other: FlOption<T>): FlOption<T>;
}

export class Some<T> extends FlOption<T> {
  private value: T;

  constructor(val: T) {
    super();
    this.value = val;
  }

  map<U>(func: (val: T) => U): FlOption<U> {
    return FlOption.of(func(this.value));
  }

  chain<U>(func: (val: T) => FlOption<U>): FlOption<U> {
    return func(this.value);
  }

  ap<U>(other: FlOption<(val: T) => U>): FlOption<U> {
    return other.map(f => f(this.value));
  }

  concat(other: FlOption<T>): FlOption<T> {
    return this;
  }
}

export class None extends FlOption<any> {
  constructor() {
    super();
  }

  map<T, U>(func: (val: T) => U): FlOption<U> {
    return FlOption.empty();
  }

  chain<T, U>(func: (val: T) => FlOption<U>): FlOption<U> {
    return FlOption.empty();
  }

  ap<T, U>(other: FlOption<(val: T) => U>): FlOption<U> {
    return FlOption.empty();
  }

  concat<T>(other: FlOption<T>): FlOption<T> {
    return other;
  }
}
