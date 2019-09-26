import React from 'react'
import { Prompt } from 'react-router-dom'
// import { CustomModal } from './CustomModal'
export class RouteLeavingGuard extends React.Component {
  state = {
    modalVisible: false,
    lastLocation: null,
    confirmedNavigation: false,
    func: () => {},
  }

  // Setup the `beforeunload` event listener
  setupBeforeUnloadListener = () => {
    window.addEventListener('beforeunload', (ev) => {
      const { when } = this.props

      if (when) {
        const textToShow = 'You have processing rebalance'
        ev.preventDefault()
        ev.returnValue = textToShow
        return textToShow
      }
    })

    // window.addEventListener('unload', async (ev) => {
    //   const result = await actionBeforeUnload()
    //   console.log('when', when)
    //   console.log('action', action)
    //   console.log('action before unload', actionBeforeUnload)
    //   console.log('result exit', result)
    // })
  }

  componentDidMount() {
    // Activate the event listener
    this.setupBeforeUnloadListener()
  }

  showModal = (location) =>
    this.setState({
      modalVisible: true,
      lastLocation: location,
    })

  closeModal = (callback) =>
    this.setState(
      {
        modalVisible: false,
      },
      callback
    )

  handleBlockedNavigation = (nextLocation) => {
    const { confirmedNavigation } = this.state
    const { shouldBlockNavigation } = this.props
    if (!confirmedNavigation && shouldBlockNavigation(nextLocation)) {
      this.showModal(nextLocation)
      return false
    }

    return true
  }

  handleConfirmNavigationClick = () =>
    this.closeModal(() => {
      const { navigate } = this.props
      const { lastLocation } = this.state
      if (lastLocation) {
        this.setState(
          {
            confirmedNavigation: true,
          },
          () => {
            // Navigate to the previous blocked location with your navigate function
            navigate(lastLocation.pathname)
          }
        )
      }
    })

  render() {
    const { when, CustomModal, ...propsForModal } = this.props
    const { modalVisible, lastLocation } = this.state
    return (
      <>
        <Prompt when={when} message={this.handleBlockedNavigation} />
        {/* pass from props */}
        <CustomModal
          visible={modalVisible}
          handleClose={() => this.closeModal(() => {})}
          handleConfirm={this.handleConfirmNavigationClick}
          lastLocation={lastLocation}
          {...propsForModal}
        />
      </>
    )
  }
}
export default RouteLeavingGuard
