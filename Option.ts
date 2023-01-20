type None = { _tag: 'none' }
type Some<T> = { _tag: 'some', value: T }
type Option<T> = Some<T> | None

export const none: () => None = () => ({ _tag: 'none' })
export const pure: <T>(v: T) => Option<T> = (v) => ({ _tag: 'some', value: v })

function hasValue<T>(value: Option<T>): value is Some<T> {
  return value._tag === 'some'
}

export const map: <A, B>(mapOver: Option<A>, fn: (v: A) => B) => Option<B> = (mapOver, fn) => 
  hasValue(mapOver) ? pure(fn(mapOver.value)) : none()

export const chain: <A, B>(chainOver: Option<A>, fn: (v: A) => Option<B>) => Option<B> = (chainOver, fn) => 
  hasValue(chainOver) ? fn(chainOver.value) : none()

export const unwrapOrElse: <A>(wrapped: Option<A>, fn: () => A) => A  = (wrapped, fn) =>
  hasValue(wrapped) ? wrapped.value : fn()

export const compose: <A, B, C>(f: (fx: A) => Option<B>, g: (gx: B) => Option<C>) => (x: A) => Option<C> = (f, g) =>
  x => chain(f(x), g)

export const join: <A>(v: Option<Option<A>>) => Option<A> = (wrapped) => hasValue(wrapped) ? wrapped.value : none()

export const joinWithChain: <A>(v: Option<Option<A>>) => Option<A> = (wrapped) => chain(wrapped, (v) => v)

export const chainWithJoin: <A, B>(chainOver: Option<A>, fn: (v: A) => Option<B>) => Option<B> = (chainOver, fn) => 
  join(map(chainOver, fn))
  
export const liftA2: <A, B, C>(fn: (fa: A, fb: B) => C) => (ga: Option<A>, gb: Option<B>) => Option<C> = (fn) => (ga, gb) =>
  chain(ga, (fa => chain(gb, (fb) => pure(fn(fa, fb)))))

export const apply: <A, B>(mf: Option<(x: A) => B>, mx: Option<A>) => Option<B> = (mf, mx) =>
  chain(mf, (f => chain(mx, (x) => pure(f(x)))))


