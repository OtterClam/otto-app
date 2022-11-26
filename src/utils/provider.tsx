import { ComponentType, PropsWithChildren } from 'react'

// TODO: strong typing for props
export const combine = <T extends [ComponentType<any>, any][]>(...args: T) => {
  // eslint-disable-next-line react/jsx-no-useless-fragment
  const DefaultComponent = ({ children }: PropsWithChildren<object>) => <>{children}</>
  return args.reduce((Component, [Provider, props]) => {
    return ({ children }: PropsWithChildren<object>) => (
      <Component>
        <Provider {...props}>{children}</Provider>
      </Component>
    )
  }, DefaultComponent)
}
