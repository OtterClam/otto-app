import AdventurePopup from 'components/AdventurePopup'
import { AdventureContractStateProvider } from 'contexts/AdventureContractState'
import { AdventureLocationsProvider } from 'contexts/AdventureLocations'
import { AdventureOttosProvider } from 'contexts/AdventureOttos'
import { AdventureUIStateProvider } from 'contexts/AdventureUIState'
import { MyItemsProvider } from 'contexts/MyItems'
import { OttoProvider } from 'contexts/Otto'
import { TraitProvider } from 'contexts/TraitContext'
import { PropsWithChildren } from 'react'

export default function AdventureProvider({ children }: PropsWithChildren<object>) {
  return (
    <MyItemsProvider>
      <OttoProvider>
        <TraitProvider>
          <AdventureContractStateProvider>
            <AdventureUIStateProvider>
              <AdventureLocationsProvider>
                <AdventureOttosProvider>
                  {children}
                  <AdventurePopup />
                </AdventureOttosProvider>
              </AdventureLocationsProvider>
            </AdventureUIStateProvider>
          </AdventureContractStateProvider>
        </TraitProvider>
      </OttoProvider>
    </MyItemsProvider>
  )
}
