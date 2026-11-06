import { useState } from 'react'

export default function DiwaliNameForm({ initialName = '', onSubmit }) {
  const [value, setValue] = useState(initialName)
  const [error, setError] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    const name = value.trim().replace(/\s+/g, ' ')

    if (!name) {
      setError('Please enter your name to continue.')
      return
    }

    setError('')
    onSubmit(name)
  }

  return (
    <form className="dw-form" onSubmit={handleSubmit} noValidate>
      <label className="dw-form__label" htmlFor="diwali-name">
        What should we call you?
      </label>

      <div className="dw-form__row">
        <input
          id="diwali-name"
          className={`dw-form__input${error ? ' is-invalid' : ''}`}
          type="text"
          name="name"
          value={value}
          placeholder="Enter your name..."
          autoComplete="name"
          enterKeyHint="go"
          maxLength={48}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? 'diwali-name-error' : 'diwali-name-hint'}
          onChange={(event) => {
            setValue(event.target.value)
            if (error) setError('')
          }}
        />

        <button className="dw-btn dw-btn--celebrate" type="submit">
          Celebrate Diwali
          <span aria-hidden="true">&#127878;</span>
        </button>
      </div>

      <p className="dw-form__hint" id="diwali-name-hint">
        No sign-up needed. Your wish stays on this device.
      </p>

      <p className="dw-form__error" id="diwali-name-error" role="alert" aria-live="polite">
        {error}
      </p>
    </form>
  )
}
