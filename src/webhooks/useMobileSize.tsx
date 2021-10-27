import { maxMobileScreenResolution } from '@core/utils/config'
import useWindowSize from './useWindowSize'

function useMobileSize() {
  const { width, height } = useWindowSize()

  const isMobile = maxMobileScreenResolution > width

  return isMobile
}

export default useMobileSize
