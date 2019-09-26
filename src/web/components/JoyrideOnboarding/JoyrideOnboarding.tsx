import Joyride from 'react-joyride'

function JoyrideOnboarding(props) {
  const { steps, open } = props
  return (
    <Joyride
      continuous={true}
      showProgress={true}
      showSkipButton={false}
      steps={steps}
      run={open}
      styles={{
        options: {
          backgroundColor: 'transparent',
          primaryColor: '#29AC80',
          textColor: '#fff',
          arrowColor: '#fff',
          zIndex: 99999,
        },
        tooltip: {
          fontFamily: 'DM Sans',
          fontSize: '18px',
        },
        buttonClose: {
          display: 'none',
        },
        buttonNext: {
          backgroundColor: '#29AC80',
          border: '2px solid transparent',
          borderRadius: '10px',
          color: '#fff',
          outline: 0,
          padding: '10px 35px',
          textTransform: 'uppercase',
          fontFamily: 'DM Sans',
          fontWeight: 'bold',
          letterSpacing: '1px',
          lineHeight: '23px',
        },
        buttonBack: {
          backgroundColor: 'transparent',
          border: '2px solid #FFFFFF',
          borderRadius: '10px',
          color: '#fff',
          outline: 0,
          padding: '13px 35px',
          textTransform: 'uppercase',
          fontFamily: 'DM Sans',
          fontWeight: 'bold',
          marginLeft: 'auto',
          marginRight: 10,
          letterSpacing: '1px',
        },
      }}
    />
  )
}
export default JoyrideOnboarding
