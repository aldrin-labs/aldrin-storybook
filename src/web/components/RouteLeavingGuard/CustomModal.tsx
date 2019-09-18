// transfport to rebalancedialogs
export const CustomModal = ({ visible = false }) => {
  return (
    <div
      style={{
        visibility: visible ? 'visible' : 'hidden',
        position: 'absolute',
        top: '50%',
        left: '50%',
      }}
    >
      R U SHURE ABOUT THAT?!
    </div>
  )
}
