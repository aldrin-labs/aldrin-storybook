import greenBackground from '@icons/greenBack.png'
import pinkBackground from '@icons/pinkBackground.png'

export const ADAPTIVE_LOW_BLOCKS = ({
  isMobile,
  needBackground,
}: {
  isMobile: boolean
  needBackground?: boolean
}) => {
  return {
    width: isMobile ? '100%' : '32%',
    height: 'auto',
    minHeight: isMobile ? '30rem' : '15rem',
    margin: isMobile ? '2rem 0' : '0',
    flexDirection: 'column',
    padding: '3rem',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    flexWrap: 'nowrap',
    position: 'relative',
    backgroundImage: needBackground ? `url(${greenBackground})` : 'none',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
  }
}

export const ADAPTIVE_UPPER_BLOCKS = ({
  isMobile,
  needBackground,
}: {
  isMobile: boolean
  needBackground?: boolean
}) => {
  return {
    height: isMobile ? '30rem' : '100%',
    width: isMobile ? '100%' : '48%',
    margin: isMobile ? '2rem 0' : '0',
    flexDirection: 'column',
    padding: '3rem',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'nowrap',
    position: 'relative',
    backgroundImage: needBackground ? `url(${pinkBackground})` : 'none',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
  }
}

export const CONTAINER = (isMobile: boolean) => {
  return {
    padding: isMobile ? '5rem' : '5rem 13rem',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: isMobile ? 'auto' : '100%',
    background: 'rgb(14, 16, 22)',
  }
}

export const MAIN_BLOCK = (isMobile: boolean) => {
  return {
    width: isMobile ? '100%' : '49%',
    height: isMobile ? '60rem' : '100%',
    margin: '2rem 0',
  }
}
