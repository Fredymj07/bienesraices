const formLogin = (req, res) => {
    res.render('auth/login', {
        page: 'Login'
    })
}

const formRegister = (req, res) => {
    res.render('auth/register', {
        page: 'Create account'
    })
}

const formForgotPassword = (req, res) => {
    res.render('auth/forgot-password', {
        page: 'Forgot password'
    })
}

export {
    formLogin,
    formRegister,
    formForgotPassword
}