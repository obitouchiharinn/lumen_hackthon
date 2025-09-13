import { useNavigate, useLocation } from 'react-router-dom'
// import { useAuthStore } from '@/stores/auth-store'
import { ConfirmDialog } from '@/components/confirm-dialog'

export function SignOutDialog({ open, onOpenChange }) {
  const navigate = useNavigate()
  const location = useLocation()
  // const { auth } = useAuthStore()

  const handleSignOut = () => {
    // auth.reset()
    // Preserve current location for redirect after sign-in
    const currentPath = location.pathname + location.search
    navigate(`/auth?redirect=${encodeURIComponent(currentPath)}`, { replace: true })
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Sign out"
      desc="Are you sure you want to sign out? You will need to sign in again to access your account."
      confirmText="Sign out"
      handleConfirm={handleSignOut}
      className="sm:max-w-sm"
    />
  )
}
