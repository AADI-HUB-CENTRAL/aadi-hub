export function logout() {
  localStorage.removeItem('aadi_account')
  localStorage.removeItem('aadi_identity')
  window.location.href = '/register'
}
