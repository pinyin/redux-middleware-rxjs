# redux-middleware-rxjs

[![Build Status](https://travis-ci.com/pinyin/redux-middleware-rxjs.svg?branch=master)](https://travis-ci.com/pinyin/redux-middleware-rxjs)

An unopinionated way to integrate rxjs with redux.

## Install 

`npm install redux-middleware-rxjs --save`

## Usage

```typescript jsx
import {filter, mapTo} from 'rxjs/operators'
import {createRxMiddleware} from './'

const middleware = createRxMiddleware(
    obs=> obs.pipe(
        filter(action=> action.type === 'increase'),
        mapTo({type: 'decrease'})
    )
)
```

`createRxMiddleware` receives one or many rxjs operators.

## License 
MIT
