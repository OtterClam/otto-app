import { useCall } from '@usedapp/core'
import { Dice, DiceStatus } from 'models/Dice'
import { useCallback, useState } from 'react'
import { useDispatch } from 'react-redux'
import { setError } from 'store/errorSlice'
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
  rollTheDice: () => void
  answerQuestion: (index: number, answer: number) => void
  nextEvent: () => void
  reset: () => void
}

export const useDiceRoller = (): DiceRoller => {
  const api = useApi()
  const dispatch = useDispatch()
  const [state, setState] = useState(State.Intro)
  const [dice, setDice] = useState<Dice>()

  const rollTheDice = useCallback(() => {
    setState(State.Processing)
    api
      .getDice()
      .then(dice => {
        if (dice && dice.status === DiceStatus.WaitingAnswer) {
          return dice
        }
        if (dice && dice.status === DiceStatus.Pending) {
          return api.retryADice(dice.id)
        }
        return api.rollTheDice()
      })
      .then(dice => {
        setDice(dice)
        setState(State.FirstResult)
      })
      .catch(err => dispatch(setError(err)))
  }, [api])

  const answerQuestion = useCallback(
    (index: number, answer: number) => {
      if (!dice) {
        return
      }
      api
        .answerDiceQuestion(dice.id, index, answer)
        .then(setDice)
        .catch(err => dispatch(setError(err)))
    },
    [api, dice]
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
  }
}
