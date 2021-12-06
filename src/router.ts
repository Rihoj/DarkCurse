import * as express from 'express';

import marketingHomeController from './controllers/marketing/home';
import marketingLoginController from './controllers/marketing/login';

import overviewController from './controllers/main/overview';
import trainingController from './controllers/main/training';
import attackController from './controllers/main/attack';
import userProfileController from './controllers/main/userProfile';

const router = express.Router();

// Home
router.get('/', marketingHomeController.renderHomePage);

// Login
router.get('/login', marketingLoginController.renderLoginPage);
router.post('/login', marketingLoginController.loginAction);


const authedRouter = express.Router();

authedRouter.use((req, res, next) => {
  if (!req.user) {
    return res.sendStatus(401);
  }
  next();
});

authedRouter.get('/overview', overviewController.overviewPage);
authedRouter.get('/training', trainingController.trainingPage);
authedRouter.post('/training', trainingController.trainUnitsAction);
authedRouter.get('/attack', attackController.renderAttackList);
authedRouter.get('/userprofile/:userId', userProfileController.renderUserProfile);
router.use(authedRouter);

export default router;
