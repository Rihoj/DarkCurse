import * as express from 'express';

import UserModel from '../../../src/models/user';
import Controller from '../../../src/controllers/main/overview'

describe('Controller: Overview', () => {
  describe('overviewPage', () => {
    test('it should return a 404 if the user does not exist.', async () => {
      const mockReq = {
        modelFactory: {
          user: {
            fetchById: jest.fn().mockReturnValue(null)
          },
        },
        daoFactory: {},
      } as unknown as express.Request;
      const mockRes = {
        sendStatus: jest.fn().mockReturnValue({}),
      } as unknown as express.Response;

      await Controller.overviewPage(mockReq, mockRes);

      expect(mockRes.sendStatus).toHaveBeenCalledWith(404);
    });
    test('it should render the page.', async () => {
      const mockUserModel = {
        displayName: 'Test Name',
        race: 'UNDEAD',
        class: 'FIGHTER',
        population: 1,
        armySize: 2,
        citizens: 11,
        experience: 12,
        level: 3,
        xpToNextLevel: 4,
        fortHealth: {
          current: 5,
          max: 6,
          percentage: 7
        },
        gold: 8,
        goldPerTurn: 9,
        goldInBank: 10,
        attackTurns: 13,
        userRecruitingLink: jest.fn().mockReturnValue("link"),
        formatUsersStats: jest.fn(),
      } as unknown as UserModel;

      const mockReq = {
        user: {
          id: 1
        },
        modelFactory: {
          user: {
            id: jest.fn().mockReturnValue(1),
            fetchById: jest.fn().mockReturnValue(mockUserModel),
            userRecruitingLink: jest.fn(),
          }
        },
        daoFactory: {}
      } as unknown as express.Request;
      const mockRes = {
        render: jest.fn().mockReturnThis(),
        sendStatus: jest.fn().mockReturnValue({}),
      } as unknown as express.Response;

      await Controller.overviewPage(mockReq, mockRes);

      expect(mockRes.render).toHaveBeenCalledWith('page/main/overview', {
        layout: 'main',
        pageTitle: "Overview",
        menu_category: "home",
        menu_link: "overview",
        recruitmentLink: "link",
        sidebarData: undefined,
        userDataFiltered: undefined,
        attacks: {
          won: 0,
          total: 0,
          percentage: 0
        },
        defends: {
          won: 0,
          total: 0,
          percentage: 0
        },
        spyVictories: 0,
        sentryVictories: 0,
      });
    });
  });
});