import {Action} from '@pinyin/redux'
import {deduplicate} from '@pinyin/rxjs'
import {applyMiddleware, createStore} from 'redux'
import {of} from 'rxjs'
import {filter, switchMap} from 'rxjs/operators'
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

    test(`should be able to emit new actions`, async () => {
        const allToIncrease = createRxMiddleware(obs => obs.pipe(
            filter(action => action.type === 'decrease'),
            switchMap(() => of({type: 'increase'}, {type: 'increase'}))
        ))
        const store = createStore(reducer, applyMiddleware(allToIncrease))
        store.dispatch({type: 'decrease'})
        expect(store.getState()).toEqual(1)
    })

    test(`should support multiple operators`, () => {
        const multipleOperator = createRxMiddleware(deduplicate<Operation>(100), obs => obs)
        const store = createStore(reducer, applyMiddleware(multipleOperator))
        store.dispatch({type: 'increase'})
        expect(store.getState()).toEqual(2)
    })
})
