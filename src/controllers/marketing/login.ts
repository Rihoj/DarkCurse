import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';

export default {
  async renderLoginPage(req: Request, res: Response) {
    return res.render('marketing/login', {
      layout: 'marketing',
      pageTitle: 'Login',
    });
  },

  async loginAction(req: Request, res: Response) {
    const email = req.body?.email;
    const password = req.body?.password;
    
    if (!email || !password) {
      return res.render('marketing/login', {
        layout: 'marketing',
        pageTitle: 'Login',
        errorMessage: 'Email and password are mandatory'
      });
    }

    const user = await req.modelFactory.user.fetchByEmail(
      req.modelFactory,
      req.daoFactory,
      email
    );

    if (!user) {
      return res.render('marketing/login', {
        layout: 'marketing',
        pageTitle: 'Login',
        errorMessage: 'Email or password not recognised'
      });
    }

    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) {
      return res.render('marketing/login', {
        layout: 'marketing',
        pageTitle: 'Login',
        errorMessage: 'Email or password not recognised'
      });
    }

    const newSession = await req.modelFactory.userSession.createSession(
      req.modelFactory,
      req.daoFactory,
      user.id
    );

    const newToken = jwt.sign({
      id: newSession.externalId,
    }, req.config.jwtSecret);

    res.cookie('DCT', newToken, {
      httpOnly: true,
      sameSite: 'strict',
    });
    
    return res.redirect('/overview');
  }
}