import { createContext, PropsWithChildren, useContext, useMemo, useState } from 'react'

export enum Currency {
  USD,
  CLAM,
}

export const CurrencyContext = createContext({
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setCurrency: (value: Currency) => {},
  currency: Currency.CLAM,
})

export const CurrencyProvider = ({ children }: PropsWithChildren<object>) => {
  const [currency, setCurrency] = useState(Currency.CLAM)
  const value = useMemo(
    () => ({
      currency,
      setCurrency,
    }),
    [currency]
  )
  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>
}

export const useCurrency = () => {
  return useContext(CurrencyContext)
}
