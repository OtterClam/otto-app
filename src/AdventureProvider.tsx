import AdventurePopup from 'components/AdventurePopup'
import AttributePointsPopup from 'components/AttributePointsPopup'
import LevelUpPopup from 'components/LevelUpPopup'
import TreasuryChestPopup from 'components/TreasuryChestPopup'
import { AdventureContractStateProvider } from 'contexts/AdventureContractState'
import { AdventureLocationsProvider } from 'contexts/AdventureLocations'
import { AdventureUIStateProvider } from 'contexts/AdventureUIState'
import { OttoProvider } from 'contexts/Otto'
import { TraitProvider } from 'contexts/TraitContext'
import { PropsWithChildren } from 'react'

export default function AdventureProvider({ children }: PropsWithChildren<object>) {
  return (
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
  )
}
