// @ts-nocheck
jest.mock('daos/user')
import {
    Request,
    Response
} from 'express';
import controller from 'controllers/attack';
import UserModel from 'models/user';
import AttackLog from 'models/attackLog'
import ModelFactory from '~/modelFactory';
import DaoFactory from '~/daoFactory';
import pino from 'pino';
import UserDao, { UserData } from 'daos/user';
import { AttackLogData } from 'daos/attackLog';
const mockRequest = {
    params: {
        id: 2
    },
    modelFactory: {} as ModelFactory,
} as unknown as Request;
const mockResponse = {
    json: jest.fn(),
    render: jest.fn(),
    redirect: jest.fn()
} as unknown as Response;

const emptyUser = new UserModel({} as ModelFactory, {} as DaoFactory, {} as pino.Logger, {} as UserData);
const attacker = new UserModel({} as ModelFactory, {} as DaoFactory, {} as pino.Logger, {
    id: 1
} as UserData);
const defender = new UserModel({} as ModelFactory, {} as DaoFactory, {} as pino.Logger, {
    id: 2
} as UserData);
beforeEach(() => {
    emptyUser.fetchById = jest.fn((a, b, c, user) => {
        if (user == 1) return attacker;
        else if (user == 2) return defender;
        else return null
    })
    mockRequest.modelFactory.user = emptyUser
    mockRequest.modelFactory.attackLog = new AttackLog({} as ModelFactory, {} as DaoFactory, {} as pino.Logger, {} as AttackLogData)
    mockRequest.modelFactory.attackLog.canAttackUser = jest.fn()
    mockRequest.modelFactory.attackLog.createHistory = jest.fn()
    attacker.formatUsersStats = jest.fn()
    attacker.units = []
    defender.units = []
    attacker.daoFactory.user = {} as UserDao
    defender.daoFactory.user = {} as UserDao

    mockRequest.user = attacker
});
describe('Controller: Armory', () => {
    describe('attackPage', () => {
        test('it renders the Attack page', async () => {
            const a = jest.spyOn(attacker, 'level', 'get').mockReturnValue(1);
            const d = jest.spyOn(defender, 'level', 'get').mockReturnValue(1);
            jest.spyOn(attacker, 'offense', 'get').mockReturnValue(1)

            await controller.renderAttackPage(mockRequest, mockResponse)
            expect(mockRequest.modelFactory.user.fetchById).toBeCalledTimes(2)
            expect(mockResponse.redirect).toBeCalledTimes(0);
            expect(mockResponse.render).toHaveBeenCalledWith('page/main/attack/turns', {
                "defender": {
                    "attackTurns": undefined,
                    "bio": undefined,
                    "class": undefined,
                    "colourScheme": undefined,
                    "daoFactory": {
                        "user": {}
                    },
                    "displayName": undefined,
                    "email": undefined,
                    "experience": undefined,
                    "fortHitpoints": undefined,
                    "fortLevel": undefined,
                    "gold": undefined,
                    "goldInBank": undefined,
                    "houseLevel": undefined,
                    "id": 2,
                    "items": undefined,
                    "last_active": undefined,
                    "logger": {},
                    "modelFactory": {},
                    "passwordHash": undefined,
                    "race": undefined,
                    "rank": undefined,
                    "units": []
                } as unknown as UserModel,
                "layout": "main",
                "menu_category": "battle",
                "menu_link": "attack",
                "pageTitle": "Attack 2",
                "sidebarData": undefined,
                "turns": undefined,
                "userDataFiltered": undefined
            })
        });
        test('it renders cannot attack - no offense', async () => {
            jest.spyOn(attacker, 'level', 'get').mockReturnValue(1);
            jest.spyOn(defender, 'level', 'get').mockReturnValue(2);
            jest.spyOn(attacker, 'offense', 'get').mockReturnValue(0)
    
            emptyUser.fetchById = jest.fn()
                .mockResolvedValueOnce(attacker)
                .mockResolvedValueOnce(defender)
            attacker.formatUsersStats = jest.fn()
    
            mockRequest.modelFactory.user = emptyUser
            mockRequest.user = attacker
            await controller.renderAttackPage(mockRequest, mockResponse)
            expect(mockRequest.modelFactory.user.fetchById).toBeCalledTimes(2)
            expect(mockResponse.redirect).toHaveBeenCalledWith("/userprofile/2?err=NoOffense")
        });
        test('it renders cannot attack - TooLow', async () => {
            jest.spyOn(attacker, 'level', 'get').mockReturnValue(10);
            jest.spyOn(defender, 'level', 'get').mockReturnValue(1);
            jest.spyOn(attacker, 'offense', 'get').mockReturnValue(2)
            attacker.formatUsersStats = jest.fn()
    
            mockRequest.modelFactory.user = emptyUser
            mockRequest.user = attacker
            await controller.renderAttackPage(mockRequest, mockResponse)
            expect(mockRequest.modelFactory.user.fetchById).toBeCalledTimes(2)
            expect(mockResponse.redirect).toHaveBeenCalledWith("/userprofile/2?err=TooLow")
        });
        test('it renders cannot attack - 1TooHigh', async () => {
            jest.spyOn(attacker, 'level', 'get').mockReturnValue(1);
            jest.spyOn(defender, 'level', 'get').mockReturnValue(7);
            jest.spyOn(attacker, 'offense', 'get').mockReturnValue(2)
            attacker.formatUsersStats = jest.fn()
    
            mockRequest.modelFactory.user = emptyUser
            mockRequest.user = attacker
            await controller.renderAttackPage(mockRequest, mockResponse)
            expect(mockRequest.modelFactory.user.fetchById).toBeCalledTimes(2)
            expect(mockResponse.redirect).toHaveBeenCalledWith("/userprofile/2?err=TooHigh")
        });
        test('it renders cannot attack - 1TooLow', async () => {
            jest.spyOn(attacker, 'level', 'get').mockReturnValue(7);
            jest.spyOn(defender, 'level', 'get').mockReturnValue(1);
            jest.spyOn(attacker, 'offense', 'get').mockReturnValue(2)
            attacker.formatUsersStats = jest.fn()
    
            mockRequest.modelFactory.user = emptyUser
            mockRequest.user = attacker
            await controller.renderAttackPage(mockRequest, mockResponse)
            expect(mockRequest.modelFactory.user.fetchById).toBeCalledTimes(2)
            expect(mockResponse.redirect).toHaveBeenCalledWith("/userprofile/2?err=TooLow")
        });
        test('it renders cannot attack - TooHigh', async () => {
            jest.spyOn(attacker, 'level', 'get').mockReturnValue(1);
            jest.spyOn(defender, 'level', 'get').mockReturnValue(10);
            jest.spyOn(attacker, 'offense', 'get').mockReturnValue(2)
            attacker.formatUsersStats = jest.fn()
    
            mockRequest.modelFactory.user = emptyUser
            mockRequest.user = attacker
            await controller.renderAttackPage(mockRequest, mockResponse)
            expect(mockRequest.modelFactory.user.fetchById).toBeCalledTimes(2)
            expect(mockResponse.redirect).toHaveBeenCalledWith("/userprofile/2?err=TooHigh")
        });
        test('it renders can attack - max', async () => {
            jest.spyOn(attacker, 'level', 'get').mockReturnValue(1);
            jest.spyOn(defender, 'level', 'get').mockReturnValue(6);
            jest.spyOn(attacker, 'offense', 'get').mockReturnValue(2)
            attacker.formatUsersStats = jest.fn()
    
            mockRequest.modelFactory.user = emptyUser
            mockRequest.user = attacker
            await controller.renderAttackPage(mockRequest, mockResponse)
            expect(mockRequest.modelFactory.user.fetchById).toBeCalledTimes(2)
            expect(mockResponse.render).toHaveBeenCalledWith('page/main/attack/turns', {
                "defender": {
                    "attackTurns": undefined,
                    "bio": undefined,
                    "class": undefined,
                    "colourScheme": undefined,
                    "daoFactory": {
                        "user": {}
                    },
                    "displayName": undefined,
                    "email": undefined,
                    "experience": undefined,
                    "fortHitpoints": undefined,
                    "fortLevel": undefined,
                    "gold": undefined,
                    "goldInBank": undefined,
                    "houseLevel": undefined,
                    "id": 2,
                    "items": undefined,
                    "last_active": undefined,
                    "logger": {},
                    "modelFactory": {},
                    "passwordHash": undefined,
                    "race": undefined,
                    "rank": undefined,
                    "units": []
                } as unknown as UserModel,
                "layout": "main",
                "menu_category": "battle",
                "menu_link": "attack",
                "pageTitle": "Attack 2",
                "sidebarData": undefined,
                "turns": undefined,
                "userDataFiltered": undefined
            })
        });
        test('it renders can attack - min', async () => {
            jest.spyOn(attacker, 'level', 'get').mockReturnValue(6);
            jest.spyOn(defender, 'level', 'get').mockReturnValue(1);
            jest.spyOn(attacker, 'offense', 'get').mockReturnValue(2)
            attacker.formatUsersStats = jest.fn()
    
            mockRequest.modelFactory.user = emptyUser
            mockRequest.user = attacker
            await controller.renderAttackPage(mockRequest, mockResponse)
            expect(mockRequest.modelFactory.user.fetchById).toBeCalledTimes(2)
            expect(mockResponse.render).toHaveBeenCalledWith('page/main/attack/turns', {
                "defender": {
                    "attackTurns": undefined,
                    "bio": undefined,
                    "class": undefined,
                    "colourScheme": undefined,
                    "daoFactory": {
                        "user": {}
                    },
                    "displayName": undefined,
                    "email": undefined,
                    "experience": undefined,
                    "fortHitpoints": undefined,
                    "fortLevel": undefined,
                    "gold": undefined,
                    "goldInBank": undefined,
                    "houseLevel": undefined,
                    "id": 2,
                    "items": undefined,
                    "last_active": undefined,
                    "logger": {},
                    "modelFactory": {},
                    "passwordHash": undefined,
                    "race": undefined,
                    "rank": undefined,
                    "units": []
                } as unknown as UserModel,
                "layout": "main",
                "menu_category": "battle",
                "menu_link": "attack",
                "pageTitle": "Attack 2",
                "sidebarData": undefined,
                "turns": undefined,
                "userDataFiltered": undefined
            })
        });
        test('it handles attack - tie', async () => {
            mockRequest.body = {
                ...mockRequest.body,
                turnsAmount: 1
            }
            attacker.daoFactory.user.setTurns = jest.fn().mockResolvedValue(null);
            attacker.daoFactory.user.setGold = jest.fn().mockResolvedValue(null);
            defender.daoFactory.user.setGold = jest.fn().mockResolvedValue(null);
            attacker.daoFactory.user.setXP = jest.fn().mockResolvedValue(null);
            defender.daoFactory.user.setXP = jest.fn().mockResolvedValue(null);
            jest.spyOn(attacker, 'level', 'get').mockReturnValue(6);
            jest.spyOn(defender, 'level', 'get').mockReturnValue(1);
            jest.spyOn(attacker, 'offense', 'get').mockReturnValue(2);
            jest.spyOn(defender, 'defense', 'get').mockReturnValue(1);
            jest.spyOn(mockRequest.modelFactory.attackLog, 'canAttackUser').mockResolvedValue(true);
            jest.spyOn(mockRequest.modelFactory.attackLog, 'createHistory').mockResolvedValue(true);
            jest.spyOn(attacker, 'fortHealth', 'get').mockReturnValue({
                current: 100,
                max: 100,
                percentage: 100
            });
            jest.spyOn(defender, 'fortHealth', 'get').mockReturnValue({
                current: 100,
                max: 100,
                percentage: 100
            });
            await controller.handleAttack(mockRequest, mockResponse)
            expect(mockResponse.redirect).toHaveBeenCalledTimes(0);
            expect(mockRequest.modelFactory.attackLog.canAttackUser).toHaveBeenCalled();
            expect(mockRequest.modelFactory.attackLog.canAttackUser).toBeCalledTimes(1);
            expect(mockRequest.modelFactory.attackLog.createHistory).toBeCalledTimes(1);
        });
    });
});
