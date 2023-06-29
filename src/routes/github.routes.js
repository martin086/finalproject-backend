import { json, Router } from "express";
import passport from "passport";


const routerGithub = Router()

//Register
routerGithub.get('/github', passport.authenticate('github', {scope:['user:email']}), async (req,res) => {})

//Login
routerGithub.get('/githubSession', passport.authenticate('github'), async (req,res) => {
    
    if(req.user) {
        req.session.user = req.user
        req.session.userFirst = req.user.first_name
        req.session.role = "User"
        req.session.login = true
        res.redirect('/products')
    } else {
        res.redirect('/login')
    }
    
})

export default routerGithub