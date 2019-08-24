// Type definitions for sanctuary 2.0
// Project: https://github.com/sanctuary-js/sanctuary#readme
// Definitions by: David Chambers <https://github.com/davidchambers>
//                 Juan J. Jimenez-Anca <https://github.com/cortopy>
//                 Ken Aguilar <https://github.com/piq9117>
//                 Michał Kaczanowicz <https://github.com/vicrac>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

declare var S: Sanctuary.Environment;
export = S;
export as namespace S;

type Nullable<A> = A | null;

type Pair<A, B> = [A, B];

type Thunk<A> = () => A;

type Fn<A, B>                = (a: A) => B;
type Fn2<A, B, C>            = (a: A) => (b: B) => C;
type Fn3<A, B, C, D>         = (a: A) => (b: B) => (c: C) => D;
type Fn4<A, B, C, D, E>      = (a: A) => (b: B) => (c: C) => (d: D) => E;
type Fn5<A, B, C, D, E, F>   = (a: A) => (b: B) => (c: C) => (d: D) => (e: E) => F;
type Fn2_<A, B, C>           = (a: A, b: B) => C;
type Fn3_<A, B, C, D>        = (a: A, b: B, c: C) => D;
type Fn4_<A, B, C, D, E>     = (a: A, b: B, c: C, d: D) => E;
type Fn5_<A, B, C, D, E, F>  = (a: A, b: B, c: C, d: D, e: E) => F;

type Predicate<A> = (a: A) => boolean;

interface StrMap<A> { [k: string]: A; }

interface Maybe<A> {
  constructor: {
    '@@type': 'sanctuary/Maybe';
  };
}

interface Either<A, B> {
  constructor: {
    '@@type': 'sanctuary/Either';
  };
}

type ValidNumber            = number;
type FiniteNumber           = number;
type NonZeroFiniteNumber    = number;
type Integer                = number;
type NonNegativeInteger     = number;

interface TypeRep {}

interface Setoid<A> {}
interface Ord<A> extends Setoid<A> {}
interface Semigroupoid<A, B> {}
interface Category<A> extends Semigroupoid<A, A> {}
interface Semigroup<A> {}
interface Monoid<A> extends Semigroup<A> {}
interface Functor<A> {}
interface Bifunctor<A, C> extends Functor<C> {}
interface Profunctor<B, C> extends Functor<C> {}
interface Apply<A> extends Functor<A> {}
interface Applicative<A> extends Apply<A> {}
interface Chain<A> extends Apply<A> {}
interface ChainRec<A> extends Chain<A> {}
interface Monad<A> extends Applicative<A>, Chain<A> {}
interface Alt<A> extends Functor<A> {}
interface Plus<A> extends Alt<A> {}
interface Alternative<A> extends Applicative<A>, Plus<A> {}
interface Foldable<A> {}
interface Traversable<A> extends Functor<A>, Foldable<A> {}
interface Extend<A> extends Functor<A> {}
interface Comonad<A> extends Extend<A> {}
interface Contravariant<A> {}

interface ListToMaybeList {
  (xs: string): Maybe<string>;
  <A>(xs: ReadonlyArray<A>): Maybe<A[]>;
}

interface MatchObj {
  match: string;
  groups: ReadonlyArray<Maybe<string>>;
}

declare namespace Sanctuary {
  interface Static {
    Maybe: TypeRep;
    Nothing: Maybe<any>;
    Just<A>(x: A): Maybe<A>;
    Either: TypeRep;
    Left<A>(x: A): Either<A, any>;
    Right<A>(x: A): Either<any, A>;
    //  Classify
    type(x: any): {
      namespace: Maybe<string>
      name: string
      version: NonNegativeInteger
    };
    is(typeRep: TypeRep): (x: any) => boolean;
    //  Showable
    toString(x: any): string;
    //  Fantasy Land
    equals<A>(x: Setoid<A>): (y: Setoid<A>) => boolean;
    lt <A>(x: Ord<A>): (y: Ord<A>) => boolean;
    lte<A>(x: Ord<A>): (y: Ord<A>) => boolean;
    gt <A>(x: Ord<A>): (y: Ord<A>) => boolean;
    gte<A>(x: Ord<A>): (y: Ord<A>) => boolean;
    min<A>(x: Ord<A>): (y: Ord<A>) => A;
    max<A>(x: Ord<A>): (y: Ord<A>) => A;
    id<A>(p: TypeRep): Fn<A, A> | Category<any>;
    concat<A>(x: Semigroup<A>): (y: Semigroup<A>) => Semigroup<A>;
    concat<A>(x: ReadonlyArray<A>): (y: ReadonlyArray<A>) => A[];
    concat<A>(x: StrMap<A>): (y: StrMap<A>) => StrMap<A>;
    concat(x: string): (y: string) => string;
    empty(p: TypeRep): Monoid<any>;
    map<A, B>(p: Fn<A, B>): {
      <C>(q: Fn<C, A>): Fn<C, B>;
        (q: ReadonlyArray<A>): B[];
        (q: StrMap<A>): StrMap<B>;
        (q: Functor<A>): Functor<B>;
    };
    bimap<A, B>(p: Fn<A, B>): <C, D>(q: Fn<C, D>) => (r: Bifunctor<A, C>) => Bifunctor<B, D>;
    promap<A, B>(p: Fn<A, B>): <C, D>(q: Fn<C, D>) => {
      (r: Fn<B, C>): Fn<A, D>;
      (r: Profunctor<B, C>): Profunctor<A, D>;
    };
    alt<A>(x: Alt<A>): (y: Alt<A>) => Alt<A>;
    zero(p: TypeRep): Plus<any>;
    reduce<A, B>(p: Fn2<B, A, B>): (q: B) => (r: ReadonlyArray<A> | StrMap<A> | Maybe<A> | Either<any, A> | Foldable<A>) => B;
    traverse(typeRep: TypeRep): <A, B>(f: Fn<A, Applicative<B>>) => (traversable: Traversable<A>) => Applicative<Traversable<B>>;
    sequence(typeRep: TypeRep): <A>(traversable: Traversable<Applicative<A>>) => Applicative<Traversable<A>>;
    ap<A, B>(p: Apply<Fn<A, B>>): (q: Apply<A>) => Apply<B>;
    lift2<A, B, C>(f: Fn2<A, B, C>): {
      <X>(x: Fn<X, A>): (y: Fn<X, B>) => Fn<X, C>;
        (x: Apply<A>): (y: Apply<B>) => Apply<C>;
    };
    lift3<A, B, C, D>(f: Fn3<A, B, C, D>): {
      <X>(x: Fn<X, A>): (y: Fn<X, B>) => (z: Fn<X, C>) => Fn<X, D>;
        (x: Apply<A>): (y: Apply<B>) => (z: Apply<C>) => Apply<D>;
    };
    apFirst <A>(x: Apply<A>): (y: Apply<any>) => Apply<A>;
    apSecond(x: Apply<any>): <B>(y: Apply<B>) => Apply<B>;
    of<A>(typeRep: TypeRep): (x: A) =>     Fn<any, A>;
    of<A>(typeRep: TypeRep): (x: A) => Applicative<A>;
    chain<A, B, X>(f: Fn2<A, X, B>): (chain_: Fn<X, A>) => Fn<X, B>;
    chain<A, B>(f: Fn <A,  Chain<B>>): (chain_: Chain<A>) => Chain<B>;
    join<A, B>(chain_: Fn2<B, B, A>): Fn<B, A>;
    join<A>(chain_: ReadonlyArray<ReadonlyArray<A>>): A[];
    join<A>(chain_: Maybe<Maybe<A>>): Maybe<A>;
    join<A>(chain_: Chain<Chain<A>>): Chain<A>;
    chainRec(typeRep: TypeRep): {
      <A, B, X>(f: Fn2<A, X, Either<A, B>>): (x: A)        => Fn<X, B>;
      <A, B>   (f: Fn <A, ChainRec<Either<A, B>>>): (x: A) => ChainRec<B>;
    };
    extend<A, B>(f: Fn<Extend<A>, B>): (extend_: Extend<A>) => Extend<B>;
    extract<A>(comonad: Comonad<A>): A;
    contramap<A, B>(f: Fn<B, A>): {
      <X>(contravariant: Fn<A, X>): Fn<B, X>;
        (contravariant: Contravariant<A>): Contravariant<B>;
    };
    filter <A>(pred: Predicate<A>): {
      (m: ReadonlyArray<A>): A[];
      (m: Foldable<A>): Foldable<A>;
    };
    filterM<A>(pred: Predicate<A>): {
      (m: ReadonlyArray<A>): A[];
      (m: Foldable<A>): Foldable<A>;
    };
    takeWhile<A>(pred: Predicate<A>): (foldable: Foldable<A>) => Foldable<A>;
    dropWhile<A>(pred: Predicate<A>): (foldable: Foldable<A>) => Foldable<A>;
    //  Combinator
    I<A>(x: A): A;
    K<A>(x: A): (y: any) => A;
    T<A>(x: A): <B>(f: Fn<A, B>) => B;
    //  Function
    curry2<A, B, C>(f: Fn2_<A, B, C>): Fn2<A, B, C>;
    curry3<A, B, C, D>(f: Fn3_<A, B, C, D>): Fn3<A, B, C, D>;
    curry4<A, B, C, D, E>(f: Fn4_<A, B, C, D, E>): Fn4<A, B, C, D, E>;
    curry5<A, B, C, D, E, F>(f: Fn5_<A, B, C, D, E, F>): Fn5<A, B, C, D, E, F>;
    flip<A, B, C>(f: Fn2<A, B, C>): Fn2<B, A, C>;
    //  Composition
    compose<B, C>(f: Fn<B, C>): <A>(g: Fn<A, B>) => Fn<A, C>;
    compose<B, C>(x: Semigroupoid<B, C>): <A>(y: Semigroupoid<A, B>) => Semigroupoid<A, C>;
    pipe<A, B>(fs: [Fn<A, B>]): (x: A) => B;
    pipe<A, B, C>(fs: [Fn<A, B>, Fn<B, C>]): (x: A) => C;
    pipe<A, B, C, D>(fs: [Fn<A, B>, Fn<B, C>, Fn<C, D>]): (x: A) => D;
    pipe<A, B, C, D, E>(fs: [Fn<A, B>, Fn<B, C>, Fn<C, D>, Fn<D, E>]): (x: A) => E;
    pipe<A, B, C, D, E, F>(fs: [Fn<A, B>, Fn<B, C>, Fn<C, D>, Fn<D, E>, Fn<E, F>]): (x: A) => F;
    pipe(fs: ReadonlyArray<Fn<any, any>>): (x: any) => any;
    on<A, B, C>(p: Fn2<B, B, C>): (q: Fn<A, B>) => (r: A) => Fn<A, C>;
    // Pair
    pair<A, B, C>(f: Fn2<A, B, C>): (p: Pair<A, B>) => C;
    fst<A>(p: Pair<A, any>): A;
    snd<B>(p: Pair<any, B>): B;
    swap<A, B>(p: Pair<A, B>): Pair<B, A>;
    //  TODO: Maybe
    isNothing(p: Maybe<any>): boolean;
    isJust(p: Maybe<any>): boolean;
    fromMaybe<A>(p: A): (q: Maybe<A>) => A;
    fromMaybe_<A>(p: Thunk<A>): (q: Maybe<A>) => A;
    maybeToNullable<A>(p: Maybe<A>): Nullable<A>;
    toMaybe<A>(p: A | null | undefined): Maybe<A>;
    maybe<B>(p: B): <A>(q: Fn<A, B>) => (r: Maybe<A>) => B;
    maybe_<B>(p: Thunk<B>): <A>(q: Fn<A, B>) => (r: Maybe<A>) => B;
    justs<A>(p: ReadonlyArray<Maybe<A>>): A[];
    mapMaybe<A>(p: Fn<A, Maybe<any>>): (q: A[]) => A[];
    encase<A, B>(p: Fn<A, B>): Fn<A, Maybe<B>>;
    encase2<A, B, C>(p: Fn2<A, B, C>): Fn2<A, B, Maybe<C>>;
    encase3<A, B, C, D>(p: Fn3<A, B, C, D>): Fn3<A, B, C, Maybe<D>>;
    maybeToEither<A>(p: A): <B>(q: Maybe<B>) => Either<A, B>;
    //  TODO: Either
    isLeft(p: Either<any, any>): boolean;
    isRight(p: Either<any, any>): boolean;
    fromEither<B>(p: B): (q: Either<any, B>) => B;
    toEither<A>(p: A): <B>(q: B | null | undefined) => Either<A, B>;
    either<A, C>(p: Fn<A, C>): <B>(q: Fn<B, C>) => (r: Either<A, B>) => C;
    lefts<A>(p: ReadonlyArray<Either<A, any>>): A[];
    rights<B>(p: ReadonlyArray<Either<any, B>>): B[];
    tagBy<A>(p: Predicate<A>): (q: A) => Either<A, A>;
    encaseEither<L>(p: Fn<Error, L>): <A, R>(q: Fn<A, R>) => Fn<A, Either<L, R>>;
    encaseEither2<L>(p: Fn<Error, L>): <A, B, R>(q: Fn2<A, B, R>) => Fn2<A, B, Either<L, R>>;
    encaseEither3<L>(p: Fn<Error, L>): <A, B, C, R>(q: Fn3<A, B, C, R>) => Fn3<A, B, C, Either<L, R>>;
    eitherToMaybe<B>(p: Either<any, B>): Maybe<B>;
    //  Logic
    and(p: boolean): (q: boolean) => boolean;
    or(p: boolean): (q: boolean) => boolean;
    not(p: boolean): boolean;
    complement<A>(p: Predicate<A>): Predicate<A>;
    ifElse<A, B>(p: Predicate<A>): (q: Fn<A, B>) => (r: Fn<A, B>) => Fn<A, B>;
    when<A>(p: Predicate<A>): (q: Fn<A, A>) => Fn<A, A>;
    unless<A>(p: Predicate<A>): (q: Fn<A, A>) => Fn<A, A>;
    allPass<A>(p: ReadonlyArray<Predicate<A>>): Predicate<A>;
    anyPass<A>(p: ReadonlyArray<Predicate<A>>): Predicate<A>;
    //  List
    slice(p: Integer): (q: Integer) => ListToMaybeList;
    at(p: Integer): {
      (q: string): Maybe<string>;
      <A>(q: ReadonlyArray<A>): Maybe<A>;
    };
    head(xs: string): Maybe<string>;
    head<A>(xs: ReadonlyArray<A>): Maybe<A>;
    last(xs: string): Maybe<string>;
    last<A>(xs: ReadonlyArray<A>): Maybe<A>;
    tail(xs: string): Maybe<string>;
    tail<A>(xs: ReadonlyArray<A>): Maybe<A[]>;
    init(xs: string): Maybe<string>;
    init<A>(xs: ReadonlyArray<A>): Maybe<A[]>;
    take(n: Integer): ListToMaybeList;
    takeLast(n: Integer): ListToMaybeList;
    drop(n: Integer): ListToMaybeList;
    dropLast(n: Integer): ListToMaybeList;
    //  Array
    //  TODO: Fantasyland overloads, non-curried versions
    append<A>(x: A): {
      (xs: ReadonlyArray<A>): A[];
      (xs: Applicative<A>): Applicative<A>;
    };
    prepend<A>(x: A): {
      (xs: ReadonlyArray<A>): A[];
      (xs: Applicative<A>): Applicative<A>;
    };
    joinWith(p: string): (q: ReadonlyArray<string>) => string;
    elem<A>(p: A): (q: Foldable<A> | StrMap<A> | ReadonlyArray<A>) => boolean;
    find<A>(p: Predicate<A>): (q: ReadonlyArray<A> | StrMap<A> | Foldable<A>) => Maybe<A>;
    pluck(key: string): (xs: Functor<any>) => Functor<any>;
    unfoldr<A, B>(f: Fn<B, Maybe<Pair<A, B>>>): (x: B) => A[];
    range(from: Integer): (to: Integer) => Integer[];
    groupBy<A>(f: Fn2<A, A, boolean>): (xs: ReadonlyArray<A>) => A[][];
    reverse<A>(foldable: ReadonlyArray<A>): A[];
    reverse<A>(foldable: Foldable<A>): Foldable<A>;
    sort<A>(foldable: ReadonlyArray<A>): A[];
    sort<A>(foldable: Foldable<A>): Foldable<A>;
    sortBy<A>(f: Fn<A, Ord<any>>): {
      (foldable: ReadonlyArray<A>): A[];
      (foldable: Foldable<A>): Foldable<A>;
    };
    zip<A, B>(as: ReadonlyArray<A>): (bs: ReadonlyArray<B>) => Array<Pair<A, B>>;
    zipWith<A, B, C>(fn: Fn2<A, B, C>): (as: ReadonlyArray<A>) => (bs: ReadonlyArray<B>) => Array<C>;
    //  Object
    prop(p: string): (q: any) => any;
    props(p: ReadonlyArray<string>): (q: any) => any;
    get(p: Predicate<any>): (q: string) => (r: any) => Maybe<any>;
    gets(p: Predicate<any>): (q: ReadonlyArray<string>) => (r: any) => Maybe<any>;
    //  StrMap
    keys(p: StrMap<any>): string[];
    values<A>(p: StrMap<A>): A[];
    pairs<A>(p: StrMap<A>): Array<Pair<string, A>>;
    //  Number
    negate(n: ValidNumber): ValidNumber;
    add(p: FiniteNumber): (q: FiniteNumber) => FiniteNumber;
    sum(p: Foldable<FiniteNumber> | ReadonlyArray<FiniteNumber>): FiniteNumber;
    sub(p: FiniteNumber): (q: FiniteNumber) => FiniteNumber;
    mult(x: FiniteNumber): (q: FiniteNumber) => FiniteNumber;
    product(p: Foldable<FiniteNumber> | ReadonlyArray<FiniteNumber>): FiniteNumber;
    div(p: NonZeroFiniteNumber): (q: FiniteNumber) => FiniteNumber;
    pow(p: FiniteNumber): (q: FiniteNumber) => FiniteNumber;
    mean(p: Foldable<FiniteNumber> | ReadonlyArray<FiniteNumber>): Maybe<FiniteNumber>;
    //  Integer
    even(n: Integer): boolean;
    odd(n: Integer): boolean;
    //  Parse
    parseDate(s: string): Maybe<Date>;
    parseFloat(s: string): Maybe<number>;
    parseInt(p: Integer): (q: string) => Maybe<Integer>;
    parseJson(p: Predicate<any>): (q: string) => Maybe<any>;
    //  RegExp
    regex(p: string): (q: string) => RegExp;
    regexEscape(s: string): string;
    test(pattern: RegExp): Predicate<string>;
    match(pattern: RegExp): (q: string) => Array<Maybe<MatchObj>>;
    matchAll(pattern: RegExp): (q: string) => MatchObj[];
    //  String
    toUpper(s: string): string;
    toLower(s: string): string;
    trim(s: string): string;
    stripPrefix(prefix: string): (q: string) => Maybe<string>;
    stripSuffix(suffix: string): (q: string) => Maybe<string>;
    words(s: string): string[];
    unwords(xs: ReadonlyArray<string>): string;
    lines(s: string): string[];
    unlines(xs: ReadonlyArray<string>): string;
    splitOn(separator: string): (q: string) => string[];
    splitOnRegex(pattern: RegExp): (q: string) => string[];
  }

  interface Environment extends Static {
    env: ReadonlyArray<any>;
    create(opts: {checkTypes: boolean, env: ReadonlyArray<any>}): Static;
  }
}
