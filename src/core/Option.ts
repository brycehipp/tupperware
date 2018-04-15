/**
 * The core behaviors that describe the Option Type.
 *
 * This is only intended for internal use.  Please use a publicly
 * exported object like [[OptionT]] or [[FantasyOption]] instead
 * of this object.
 */
export default abstract class Option<T> {
  // Monad algebra (requires Applicative and Chain)

  // Applicative algebra (requires Apply)
  static of<A>(val: A): Option<A> {
    return new Some(val);
  }

  // Monoid algebra (requires Semigroup)
  static empty(): Option<any> {
    return new None();
  }

  // Functor algebra (root algebra)
  abstract map<U>(func: (val: T) => U): Option<U>;

  // Chain algebra (requires Apply)
  abstract chain<U>(func: (val: T) => Option<U>): Option<U>;

  // Apply algebra (requires Functor)
  abstract ap<U>(other: Option<(val: T) => U>): Option<U>;

  // Semigroup algebra (root algebra)
  abstract concat(other: Option<T>): Option<T>;
}

export class Some<T> extends Option<T> {
  private value: T;

  constructor(val: T) {
    super();
    this.value = val;
  }

  map<U>(func: (val: T) => U): Option<U> {
    return Option.of(func(this.value));
  }

  chain<U>(func: (val: T) => Option<U>): Option<U> {
    return func(this.value);
  }

  ap<U>(other: Option<(val: T) => U>): Option<U> {
    return this.chain(x => {
      return other.map(f => f(x));
    });
  }

  concat(other: Option<T>): Option<T> {
    return this;
  }
}

export class None extends Option<any> {
  constructor() {
    super();
  }

  map<T, U>(func: (val: T) => U): Option<U> {
    return Option.empty();
  }

  chain<T, U>(func: (val: T) => Option<U>): Option<U> {
    return Option.empty();
  }

  ap<T, U>(other: Option<(val: T) => U>): Option<U> {
    return Option.empty();
  }

  concat<T>(other: Option<T>): Option<T> {
    return other;
  }
}
