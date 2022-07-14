import { useCurrency, Currency } from 'contexts/Currency'
import Switcher from './Switcher'

const options = [
  { value: Currency.CLAM, label: 'CLAM' },
  { value: Currency.USD, label: 'USD' },
]

export default function CurrencySwitcher() {
  const { currency, setCurrency } = useCurrency()
  return <Switcher name="currency" value={currency} options={options} onChange={setCurrency} />
}
