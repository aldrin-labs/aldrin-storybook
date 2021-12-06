import DottedLoader from '@icons/dottedLoader.gif'
import { Row } from '@sb/compositions/AnalyticsRoute/index.styles'
import { Text } from '@sb/compositions/Rebalance/Rebalance.styles'
import React from 'react'
import { AnimatedImage } from './Loader.styles'

export const Loader = ({
  width = '2.2rem',
  text = '',
  color = '#000',
}: {
  width?: string
  text?: string
  color?: string
}) => {
  return (
    <Row>
      <AnimatedImage color={color} viewBox="0 0 97 91" width={width} xmlns="http://www.w3.org/2000/svg">

        <path className="with-fill" d="M13.6199 50.118L14.159 56.0781L15.1081 61.9969L16.465 67.8507L16.517 68.0178L16.5799 68.1826L16.6526 68.3421L16.7372 68.4994L16.8326 68.6501L16.9389 68.7955L17.0539 68.9354L17.1786 69.0677L17.3121 69.1924L17.4541 69.3107L17.6049 69.4202L17.7622 69.5211L17.926 69.6133L21.2341 71.2229L24.6464 72.6448L28.1509 73.8737L31.7334 74.9063L35.38 75.7361L39.0775 76.3619L42.8109 76.7806L46.4997 76.978L46.5659 76.9899H48.4466H50.3274L50.3925 76.978L54.0824 76.7806L57.8158 76.3619L61.5122 75.7361L65.1599 74.9063L68.7413 73.8737L72.2469 72.6448L75.6592 71.2229L78.9673 69.6133L79.13 69.5211L79.2884 69.4202L79.4391 69.3107L79.5802 69.1924L79.7146 69.0677L79.8394 68.9354L79.9544 68.7955L80.0606 68.6501L80.1561 68.4994L80.2407 68.3421L80.3134 68.1826L80.3763 68.0178L80.4283 67.8507L81.7852 61.9969L82.7343 56.0781L83.2734 50.118L83.3992 44.1394L83.1117 38.1652L82.4121 32.2192L81.3026 26.3231L81.2603 26.1615L81.2082 26.001L81.1637 25.8904L81.1453 25.8437L81.0715 25.6908L80.9869 25.5422L79.771 23.6734L78.4228 21.8804L76.9466 20.17L75.3501 18.5495L74.6743 17.9475L73.6396 17.0256L71.8217 15.6058L69.9062 14.2934L67.8986 13.097L65.8085 12.02L63.6457 11.0677L61.4179 10.2444L59.1358 9.55243L56.8071 8.99491L54.4447 8.57516L52.0552 8.29316L49.6517 8.15324H48.4466H47.2416L44.838 8.29316L42.4486 8.57516L40.0852 8.99491L37.7575 9.55243L35.4744 10.2444L33.2476 11.0677L31.0848 12.02L28.9947 13.097L26.987 14.2934L25.0716 15.6058L23.2537 17.0256L22.219 17.9475L21.5432 18.5495L19.9466 20.17L18.4705 21.8804L17.1223 23.6734L15.9053 25.5422L15.8218 25.6908L15.748 25.8437L15.7285 25.8904L15.6851 26.001L15.632 26.1615L15.5897 26.3231L14.4811 32.2192L13.7805 38.1652L13.4941 44.1394L13.6199 50.118ZM0.0250702 38.2769L0.08255 37.765L0.171494 37.2596L0.292969 36.7584L0.445908 36.266L0.631386 35.7844L0.847221 35.3148L1.09235 34.8582L1.36568 34.4178L1.66613 33.9937L1.99477 33.5891L2.34837 33.2052L2.72474 32.8429L3.12496 32.5045L3.54581 32.1899L3.98508 31.9014L4.60767 31.5446L4.7682 31.4394L4.92005 31.3255L5.06538 31.2018L5.20313 31.0706L5.33112 30.9318L5.45044 30.7843L5.5589 30.6302L5.65869 30.4697L5.74762 30.3038L5.82572 30.1335L5.89297 29.9588L6.37021 28.7191L6.92989 27.513L7.5709 26.3448L8.28785 25.219L9.07964 24.1408L9.94193 23.1148L10.8736 22.1462L11.8672 21.2394L12.9193 20.3956L13.0548 20.2882L13.185 20.1732L13.3076 20.0517L13.4215 19.9238L13.5299 19.7893L13.6297 19.6493L13.7208 19.504L15.0517 17.4009L16.5214 15.3845L18.119 13.4625L19.8404 11.6425L21.6799 9.93314L23.6268 8.3398L25.6746 6.8701L27.8157 5.53057L30.0403 4.32446L32.3397 3.25935L34.7053 2.3374L37.1263 1.56405L39.5938 0.941467L42.0972 0.471817L44.6265 0.157272L47.1722 0H48.4466H49.7211L52.2668 0.157272L54.7961 0.471817L57.2995 0.941467L59.767 1.56405L62.1869 2.3374L64.5535 3.25935L66.853 4.32446L69.0776 5.53057L71.2187 6.8701L73.2665 8.3398L75.2134 9.93314L77.0519 11.6425L78.7732 13.4625L80.3719 15.3845L81.8405 17.4009L83.1725 19.504L83.2636 19.6493L83.3634 19.7893L83.4708 19.9238L83.5857 20.0517L83.7072 20.1732L83.8363 20.2882L83.9729 20.3956L85.0261 21.2394L86.0197 22.1462L86.9492 23.1148L87.8126 24.1408L88.6054 25.219L89.3224 26.3448L89.9634 27.513L90.522 28.7191L91.0003 29.9588L91.0665 30.1335L91.1457 30.3038L91.2346 30.4697L91.3333 30.6302L91.4429 30.7843L91.5611 30.9318L91.6902 31.0706L91.8268 31.2018L91.9722 31.3255L92.1251 31.4394L92.2845 31.5446L92.9082 31.9014L93.3475 32.1899L93.7683 32.5045L94.1686 32.8429L94.5438 33.2052L94.8985 33.5891L95.2261 33.9937L95.5276 34.4178L95.8009 34.8582L96.0461 35.3148L96.2608 35.7844L96.4463 36.266L96.6003 36.7584L96.7218 37.2596L96.8107 37.765L96.8682 38.2769L96.8921 38.79L96.8845 39.3041L95.7966 62.7681L95.7684 63.125L95.7174 63.4807L95.6448 63.8332L95.5504 64.1792L95.4343 64.5198L95.2955 64.8528L95.1371 65.1782L94.9582 65.4916L94.7597 65.7953L94.3399 66.3572L93.8865 66.8941L93.3995 67.4028L92.8811 67.8822L92.3344 68.3301L91.7607 68.7456L91.0014 69.2282L90.8485 69.3389L90.702 69.4593L90.5643 69.5872L90.4352 69.7239L90.3148 69.8671L90.202 70.0178L90.1022 70.1751L90.01 70.3378L89.9287 70.5048L89.0794 72.5993L88.1824 74.4725C87.5154 75.6721 72.4975 86.7332 72.4975 86.7332C72.4975 86.7332 64.7011 90.2898 48.4466 90.2898C32.1922 90.2898 24.3958 86.7332 24.3958 86.7332C24.3958 86.7332 9.37791 75.6721 8.71086 74.4725L7.81277 72.5993L6.96351 70.5048L6.88325 70.3378L6.79105 70.1751L6.69018 70.0178L6.57847 69.8671L6.45807 69.7239L6.32791 69.5872L6.19016 69.4593L6.04482 69.3389L5.89188 69.2282L5.13264 68.7456L4.55886 68.3301L4.0122 67.8822L3.49374 67.4028L3.00674 66.8941L2.55336 66.3572L2.13361 65.7953L1.93511 65.4916L1.75615 65.1782L1.59779 64.8528L1.45896 64.5198L1.3429 64.1792L1.24854 63.8332L1.17479 63.4807L1.12381 63.125L1.09669 62.7681L0.00880432 39.3041L0.00012207 38.79L0.0250702 38.2769Z" fill="black" />
        <path className="with-fill" d="M30.6418 49.7897H35.2287C35.8025 49.7897 36.2678 50.2561 36.2678 50.8299V53.9916C36.2678 54.5675 36.4967 55.1207 36.9045 55.5285L37.1963 55.8203C37.6041 56.2281 38.1572 56.4559 38.7332 56.4559H58.1602C58.7361 56.4559 59.2893 56.2281 59.6971 55.8203L59.9889 55.5285C60.3967 55.1207 60.6256 54.5675 60.6256 53.9916V50.8299C60.6256 50.2561 61.0909 49.7897 61.6657 49.7897H66.2516C66.8254 49.7897 67.2917 50.2561 67.2917 50.8299V55.4157C67.2917 55.9906 66.8254 56.4559 66.2516 56.4559H62.7981C62.2221 56.4559 61.669 56.6847 61.2612 57.0926C60.8533 57.5004 60.6256 58.0536 60.6256 58.6295V61.9843C60.6256 62.6101 60.1136 63.1221 59.4878 63.1221H59.4845H37.4088H37.4067C36.7798 63.1221 36.2678 62.6101 36.2678 61.9843V58.6295C36.2678 58.0536 36.04 57.5004 35.6322 57.0926C35.2244 56.6847 34.6712 56.4559 34.0953 56.4559H30.6418C30.068 56.4559 29.6016 55.9906 29.6016 55.4157V50.8299C29.6016 50.2561 30.068 49.7897 30.6418 49.7897Z" fill="black" />

      </AnimatedImage>
      {/* <AnimatedImage width={width} height="auto" src={RinLogo} /> */}
      {text ? (
        <Text
          style={{ padding: '0 0 0 0.7rem' }}
          fontSize={'1.3rem'}
          fontFamily={'Avenir Next Light'}
          color={color}
        >
          {text}
        </Text>
      ) : null}
      {text ? (
        <img style={{ marginTop: '0.5rem' }} src={DottedLoader} width="4%" />
      ) : null}
    </Row>
  )
}
