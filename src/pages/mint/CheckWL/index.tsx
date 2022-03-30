import { useEthers } from '@usedapp/core'
import Button from 'components/Button'
import { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { connectWallet } from 'store/uiSlice'
import styled from 'styled-components'
import { ContentSmall, Display2, Display3 } from 'styles/typography'
import { WHITELIST_MINT_TIME, PUBLIC_MINT_TIME } from 'constant'
import CheckImage from './otter_reviewing_paper.png'
import HasWLImage from './has-wl.png'
import NoWLImage from './no-wl.png'

const StyledCheckWL = styled.div`
  width: 90%;
  margin: 45px 0;
  padding: 3px;
  border: 2px solid #1d2654;
  backdrop-filter: blur(5px);
  /* Note: backdrop-filter has minimal browser support */
  border-radius: 15px;
  background-color: ${({ theme }) => theme.colors.crownYellow};

  @media ${({ theme }) => theme.breakpoints.mobile} {
    margin: 20px 0;
  }
`

const StyledInnerBorder = styled.div`
  width: 100%;
  height: 100%;
  padding: 40px;
  border: 2px solid ${({ theme }) => theme.colors.otterBlack};
  border-radius: 10px;
  background-color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`

const StyledText = styled.p`
  color: ${({ theme }) => theme.colors.otterBlack};
`

const StyledImage = styled.img`
  width: 200px;
  height: 200px;
  object-fit: contain;
`

enum CheckState {
  Connect = 0,
  Loading,
  HasWL,
  NoWL,
}

export default function CheckWL() {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { account } = useEthers()
  const [state, setState] = useState(CheckState.Connect)

  const stateMeta = useMemo(
    () => ({
      [CheckState.Connect]: {
        title: t('mint.checkWL.title'),
        desc: t('mint.checkWL.desc'),
        image: CheckImage,
      },
      [CheckState.Loading]: {
        title: t('mint.checkWL.title'),
        desc: t('mint.checkWL.desc'),
        image: CheckImage,
      },
      [CheckState.HasWL]: {
        title: t('mint.checkWL.has-wl-title'),
        desc: t('mint.checkWL.has-wl-desc', { time: new Date(WHITELIST_MINT_TIME).toLocaleString() }),
        image: HasWLImage,
      },
      [CheckState.NoWL]: {
        title: t('mint.checkWL.no-wl-title'),
        desc: t('mint.checkWL.no-wl-desc', { time: new Date(PUBLIC_MINT_TIME).toLocaleString() }),
        image: NoWLImage,
      },
    }),
    [t, state]
  )

  const checkWL = async () => {
    setState(CheckState.Loading)
    try {
      const res = await axios.get(`https://otter-discordbot.herokuapp.com/ottolisted/${account}`)
      setState(CheckState.HasWL)
    } catch (error) {
      setState(CheckState.NoWL)
    }
  }

  useEffect(() => {
    if (account && state === CheckState.Connect) {
      checkWL()
    }
  }, [account, state])

  return (
    <StyledCheckWL>
      <StyledInnerBorder>
        <StyledText>
          <Display2>{stateMeta[state].title}</Display2>
        </StyledText>
        <StyledText>
          <ContentSmall>{stateMeta[state].desc}</ContentSmall>
        </StyledText>
        <StyledImage src={stateMeta[state].image} alt="check" />
        {(state === CheckState.Connect || state === CheckState.Loading) && (
          <Button click={() => dispatch(connectWallet())} loading={state === CheckState.Loading}>
            <Display3>{t('connect_wallet')}</Display3>
          </Button>
        )}
      </StyledInnerBorder>
    </StyledCheckWL>
  )
}
