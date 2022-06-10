import { Dice } from 'models/Dice'
import { useCallback, useState } from 'react'
import { useDispatch } from 'react-redux'
import { setError } from 'store/errorSlice'
import useProducts from 'models/store/useProducts'
import { useStoreContract } from 'contracts/contracts'
import Otto from 'models/Otto'
import { useEthers } from '@usedapp/core'
import Product from 'models/store/Product'
import { connectContractToSigner } from '@usedapp/core/dist/esm/src/hooks'
import useApi from './useApi'

export enum State {
  Intro = 1,
  Processing = 2,
  FirstResult = 3,
  SecondResult = 4,
}

export interface DiceRoller {
  state: State
  dice?: Dice
  product?: Product
  rollTheDice: () => void
  answerQuestion: (index: number, answer: number) => void
  nextEvent: () => void
  reset: () => void
}

const useHellDiceProduct = () => {
  const { products } = useProducts()
  return products.find(product => product?.type === 'helldice')
}

export const useDiceRoller = (otto?: Otto): DiceRoller => {
  const api = useApi()
  const dispatch = useDispatch()
  const [state, setState] = useState(State.Intro)
  const [dice, setDice] = useState<Dice>()
  const { account } = useEthers()
  const product = useHellDiceProduct()
  const store = useStoreContract()
  const { library } = useEthers()

  const rollTheDice = useCallback(async () => {
    if (!otto || !account || !product || !library) {
      return
    }

    try {
      setState(State.Processing)
      const tx = await connectContractToSigner(store, {}, library).buyNoChainlink(account, product?.id, 1)
      await tx.wait()
      setDice(await api.rollTheDice(otto.tokenId, tx.hash))
      setState(State.FirstResult)
    } catch (err) {
      setState(State.Intro)
      dispatch(setError(err as any))
    }
  }, [otto, account, product, library])

  const answerQuestion = useCallback(
    (index: number, answer: number) => {
      if (!dice || !otto) {
        return
      }
      api
        .answerDiceQuestion(otto.tokenId, dice.tx, index, answer)
        .then(setDice)
        .catch(err => dispatch(setError(err)))
    },
    [dice, otto]
  )

  const nextEvent = useCallback(() => {
    setState(State.SecondResult)
  }, [])

  const reset = useCallback(() => {
    setDice(undefined)
    setState(State.Intro)
  }, [])

  return {
    state,
    dice,
    rollTheDice,
    answerQuestion,
    nextEvent,
    reset,
    product,
  }
}
