# monad-ts

Monad demo for Typescript

### Usage
```
import * as O from 'monad-ts/Option'

const opt_foo = O.create('foo')
const opt_bar = O.map(opt_foo, (str) => str + 'bar')
const unwrapped = O.unwrapOrElse(opt_bar, () => 'fail')

console.log(unwrapped === 'foobar') // true

```
