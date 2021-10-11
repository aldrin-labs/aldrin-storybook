import { maxMobileScreenResolution } from '@core/utils/config'
import useWindowSize from './useWindowSize'

function useMobileSize() {
  const { width } = useWindowSize()

  const isMobile = maxMobileScreenResolution > width

  return isMobile
}

export default useMobileSize
