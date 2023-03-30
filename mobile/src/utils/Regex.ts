
export const PasswordRegex = {
    Regex: new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{6,}$'),
    passwordErrorMessage: `A senha deve conter pelo menos \n6 Caracteres, Um número  \nUma letra minúscula, Uma letra maiúscula  `
}