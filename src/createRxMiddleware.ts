import {Action, Dispatch, Middleware, MiddlewareAPI} from 'redux'
import {Observable, OperatorFunction, Subject} from 'rxjs'

export function createRxMiddleware<A extends Action>(...funcs: Array<OperatorFunction<A, A>>): Middleware {
    const middleware: Middleware = (store: MiddlewareAPI) => (next: Dispatch<A>) => {
        const actions = new Subject<A>()

        if (funcs.length < 1) {
            throw new Error(`Must provide at least 1 operator`)
        }

        funcs.reduce((prev, curr) => curr(prev), actions as Observable<A>)
            .subscribe(action => store.dispatch(action))

        return (action: A) => {
            const result = next(action)
            actions.next(action)
            return result
        }
    }

    return middleware
}

