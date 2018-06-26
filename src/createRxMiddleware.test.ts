import {Action} from '@pinyin/redux'
import {applyMiddleware, createStore} from 'redux'
import {of} from 'rxjs'
import {filter, switchMap, tap} from 'rxjs/operators'
import {createRxMiddleware} from './createRxMiddleware'

type Actions = {
    increase: undefined
    decrease: undefined
}

type Operation = Action<Actions>

describe(`${createRxMiddleware.name}`, () => {
    const reducer = (state: number | undefined, action: Operation): number => {
        if (state === undefined) {
            return 0
        }
        switch (action.type) {
            case 'increase':
                return state + 1
            case 'decrease':
                return state - 1
            default:
                return state
        }
    }

    const allToIncrease = createRxMiddleware(obs => obs.pipe(
        filter(action => action.type === 'decrease'),
        switchMap(() => of({type: 'increase'}, {type: 'increase'})),
        tap(value => console.log(value))
    ))

    test(`should be able to emit new actions`, async () => {
        const store = createStore(reducer, applyMiddleware(allToIncrease))
        store.dispatch({type: 'decrease'})
        expect(store.getState()).toEqual(1)
    })
})
