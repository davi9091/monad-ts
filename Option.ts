type None = { _option: 'none' }
type Some<A> = { _option: 'some', value: A }
type Option<A> = Some<A> | None

export const none: () => None = () => ({ _option: 'none' })
export const pure: <A>(x: A) => Option<A> = (x) => ({ _option: 'some', value: x })

function hasValue<A>(mx: Option<A>): mx is Some<A> {
  return mx._option === 'some'
}

export const map: <A, B>(mx: Option<A>, f: (x: A) => B) => Option<B> = (mx, f) => 
  hasValue(mx) ? pure(f(mx.value)) : none()

export const chain: <A, B>(mx: Option<A>, f: (x: A) => Option<B>) => Option<B> = (mx, f) => 
  hasValue(mx) ? f(mx.value) : none()

export const unwrapOrElse: <A>(mx: Option<A>, f: () => A) => A  = (mx, f) =>
  hasValue(mx) ? mx.value : f()

export const compose: <A, B, C>(f: (x: A) => Option<B>, g: (y: B) => Option<C>) => (x: A) => Option<C> = (f, g) =>
  x => chain(f(x), g)

export const join: <A>(mmx: Option<Option<A>>) => Option<A> = (mmx) => hasValue(mmx) ? mmx.value : none()

export const joinWithChain: <A>(mmx: Option<Option<A>>) => Option<A> = (mmx) => chain(mmx, (mx) => mx)

export const chainWithJoin: <A, B>(mx: Option<A>, f: (x: A) => Option<B>) => Option<B> = (mx, f) => 
  join(map(mx, f))
  
export const liftA2: <A, B, C>(f: (a: A, b: B) => C) => (ma: Option<A>, mb: Option<B>) => Option<C> = (f) => (ma, mb) =>
  chain(ma, (a => chain(mb, (b) => pure(f(a, b)))))

export const apply: <A, B>(mf: Option<(x: A) => B>, mx: Option<A>) => Option<B> = (mf, mx) =>
  chain(mf, (f => chain(mx, (x) => pure(f(x)))))


