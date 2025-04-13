export function validateEmail(email) {
    return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)
}

export function validatePassword(password) {
    if (password.length >= 8 && password.length <= 20) {
        let hasLowerCase = /[a-z]/.test(password)
        let hasUpperCase = /[A-Z]/.test(password)
        let hasDigits = /[0-9]/.test(password)
        let hasNonAlphas = /\W/.test(password)
        if (hasLowerCase + hasUpperCase + hasDigits + hasNonAlphas === 4) {
            return true
        }
    }
    return false
}
