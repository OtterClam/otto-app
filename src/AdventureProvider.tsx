import { AdventureContractStateProvider } from 'contexts/AdventureContractState'
import { AdventureLocationsProvider } from 'contexts/AdventureLocations'
import { AdventureUIStateProvider } from 'contexts/AdventureUIState'
import { OttoProvider } from 'contexts/Otto'
import { TraitProvider } from 'contexts/TraitContext'
import { PropsWithChildren } from 'react'
import dynamic from 'next/dynamic'

const AttributePointsPopup = dynamic(() => import('components/AttributePointsPopup'))
const LevelUpPopup = dynamic(() => import('components/LevelUpPopup'))
const TreasuryChestPopup = dynamic(() => import('components/TreasuryChestPopup'))
const AdventurePopup = dynamic(() => import('components/AdventurePopup'))

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
