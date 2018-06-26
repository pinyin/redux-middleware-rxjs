import {Action, Dispatch, Middleware, MiddlewareAPI} from 'redux'
import {OperatorFunction, Subject} from 'rxjs'

export function createRxMiddleware<A extends Action>(func: OperatorFunction<A, A>): Middleware {
    const middleware: Middleware = (store: MiddlewareAPI) => (next: Dispatch<A>) => {
        const actions = new Subject<A>()

        func(actions).subscribe(action => store.dispatch(action))

        return (action: A) => {
            const result = next(action)
            actions.next(action)
            return result
        }
    }

    return middleware
}

