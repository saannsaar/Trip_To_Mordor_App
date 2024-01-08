const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/User')
const logger = require('../utils/logger')
loginRouter.post('/', async (request, response) => {
   
    try {
        const {username, password} = request.body
        console.log(username, password)
        const user = await User.findOne({username})
        // Tsekataan onko pyynnön mukana oleva "password" oikea, koska
        //tietokantaan ei ole talletettu salasanaa vaan hash, tehdään bcrypt.compare metodilla vertailu
        const passwordCorrect = user === null ? false : await bcrypt.compare(password, user.passwordHash)

    // Jos väärä käyttäjä tai ei ole olemassa vastataan 401 unauthorized
    if (!user) {
        logger.error("User not found")
        return response.status(401).json({error: "User not found"})
    }
    if (!passwordCorrect) {
        return response.status(401).json({error: "invalid password"})
    }

 

    const userForToken = {
        username: user.username,
        id: user.id,
    }

    //Tokenin voimassaoloaika on 60*60 sekuntia, eli 1 tunti
    const token = jwt.sign(userForToken, process.env.JWT_SECRET, {expiresIn: 60*60})

    response.status(200).send({token, name: user.name, username: user.username, refresh_token: user.refresh_token, id: user.id, stravaid: user.stravaid})
    
    } catch (error) {
        logger.error(JSON.stringify(error))
        return response.status(400).json({error: "Error logging in"})
    }
  
})

module.exports = loginRouter