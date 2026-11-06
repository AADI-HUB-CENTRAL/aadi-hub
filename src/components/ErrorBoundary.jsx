import { Component } from 'react'
import { PageState } from '../product/ui/kit.jsx'

/* ---------------------------------------------------------------------------
   Top-level error boundary. Without this, a single render error unmounts the
   whole app and shows a blank page. This at least keeps the brand visible and
   offers a recovery path.
--------------------------------------------------------------------------- */

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    // Kept intentionally minimal: no secrets, no user data.
    // eslint-disable-next-line no-console
    console.error('AADI HUB render error:', error, info?.componentStack)
  }

  render() {
    if (this.state.error) {
      return (
        <div className="p-container" style={{ paddingTop: 60, paddingBottom: 60 }}>
          <PageState
            title="Something broke on this page."
            body="The error has been logged. If it keeps happening, please tell the AADI HUB team what you were doing when it occurred."
            action={
              <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
                <button className="p-btn p-btn--primary p-btn--md" onClick={() => window.location.assign('/')}>
                  Back to home
                </button>
                <button className="p-btn p-btn--ghost p-btn--md" onClick={() => window.location.reload()}>
                  Reload
                </button>
              </div>
            }
          />
        </div>
      )
    }

    return this.props.children
  }
}
