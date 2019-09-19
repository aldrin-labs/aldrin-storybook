import React from 'react'
import { Prompt } from 'react-router-dom'
import { CustomModal } from './CustomModal'
export class RouteLeavingGuard extends React.Component {
  state = {
    modalVisible: false,
    lastLocation: null,
    confirmedNavigation: false,
  }

  doSomethingBeforeUnload = () => {
    this.setState({
      modalVisible: true,
    })

    return 'R U SURE?'
  }

  // Setup the `beforeunload` event listener
  setupBeforeUnloadListener = () => {
    window.addEventListener('beforeunload', (ev) => {
      ev.preventDefault()
      ev.returnValue = 'R U SURE?'
      return this.doSomethingBeforeUnload()
    })
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
    const { when } = this.props
    const { modalVisible, lastLocation } = this.state
    return (
      <>
        <Prompt when={when} message={this.handleBlockedNavigation} />
        {/* pass from props */}
        <CustomModal
          visible={modalVisible}
          onCancel={this.closeModal}
          onConfirm={this.handleConfirmNavigationClick}
        />
      </>
    )
  }
}
export default RouteLeavingGuard
