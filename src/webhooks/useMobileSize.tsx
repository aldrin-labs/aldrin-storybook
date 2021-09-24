import useWindowSize from './useWindowSize'
import { maxMobileScreenResolution } from '@core/utils/config'

function useMobileSize() {
  const { width, height } = useWindowSize()

  const isMobile = maxMobileScreenResolution > width

  return isMobile
}

export default useMobileSize
