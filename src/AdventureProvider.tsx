import AdventurePopup from 'components/AdventurePopup'
import { AdventureContractStateProvider } from 'contexts/AdventureContractState'
import { AdventureLocationsProvider } from 'contexts/AdventureLocations'
import { AdventureUIStateProvider } from 'contexts/AdventureUIState'
import { MyItemsProvider } from 'contexts/MyItems'
import { OttoProvider } from 'contexts/Otto'
import { TraitProvider } from 'contexts/TraitContext'
import { PropsWithChildren } from 'react'
import LevelUpPopup from 'components/LevelUpPopup'
import AttributePointsPopup from 'components/AttributePointsPopup'
import TreasuryChestPopup from 'components/TreasuryChestPopup'

export default function AdventureProvider({ children }: PropsWithChildren<object>) {
  return (
    <MyItemsProvider>
      <OttoProvider>
        <TraitProvider>
          <AdventureContractStateProvider>
            <AdventureUIStateProvider>
              <AdventureLocationsProvider>
                {children}
                <AdventurePopup />
                <LevelUpPopup />
                <AttributePointsPopup />
                <TreasuryChestPopup />
              </AdventureLocationsProvider>
            </AdventureUIStateProvider>
          </AdventureContractStateProvider>
        </TraitProvider>
      </OttoProvider>
    </MyItemsProvider>
  )
}
