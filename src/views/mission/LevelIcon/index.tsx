import { Mission } from 'models/Mission'
import Image from 'next/image'
import LevelS from './level-s.svg'
import LevelA from './level-a.svg'
import LevelB from './level-b.svg'
import LevelC from './level-c.svg'
import LevelD from './level-d.svg'

const LevelIcons = {
  S: LevelS,
  A: LevelA,
  B: LevelB,
  C: LevelC,
  D: LevelD,
}

interface Props {
  mission: Mission
}

export default function LevelIcon({ level }: { level: keyof typeof LevelIcons }) {
  return <Image src={LevelIcons[level]} width={36} height={50} />
}
