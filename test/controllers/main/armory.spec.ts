import { Request, Response } from 'express';
import controller from 'controllers/armory';
import UserModel from 'models/user';
import { Weapon } from 'types/typings';

describe('Controller: Armory', () => {

    const mockResponse = {
        render: jest.fn(),
        json: jest.fn(),
    } as unknown as Response

    const mockUser = {
        units: [
            { type: "WORKER", quanity: 1, level: 1 }
        ],
        items: [],
        unitTotals: jest.fn().mockReturnValue([
            {
                citizens: 0,
                workers: 0,
                offense: 0,
                defense: 0,
                spies: 0,
                sentries: 0,
            }
        ]),
        subtractGold: jest.fn(),
        formatUsersStats: jest.fn().mockReturnValue({}),
        equipNewItems: jest.fn(),
        unequipNewItems: jest.fn(),
        availableItemTypes: [
            {
                name: 'Dagger',
                usage: 'OFFENSE',
                level: 1,
                bonus: 25,
                cost: 12500,
                type: 'WEAPON',
                race: 'ALL',
            }
        ] as Weapon[]
    } as unknown as UserModel
    const mockRequest = {
        body: {},
        user: mockUser,
        logger: {
            debug: jest.fn().mockReturnThis(),
        }
    } as unknown as Request

    describe('amoryPage', () => {
        test('Armory displays items', async () => {

            await controller.armoryPage(mockRequest, mockResponse)

            expect(mockResponse.render)
                .toHaveBeenCalledWith('page/main/armory', {
                    "defensiveArmor": [],
                    "defensiveBoots": [],
                    "defensiveBracers": [],
                    "defensiveHelm": [],
                    "defensiveShield": [],
                    "defensiveUnits": 0,
                    "defensiveWeapons": [],
                    "itemTypes": [
                        "WEAPON",
                        "HELM",
                        "ARMOR",
                        "BOOTS",
                        "BRACERS",
                        "SHIELD",
                    ],
                    "layout": "main",
                    "menu_category": "structures",
                    "menu_link": "armory",
                    "offensiveArmor": [],
                    "offensiveBoots": [],
                    "offensiveBracers": [],
                    "offensiveHelm": [],
                    "offensiveShield": [],
                    "offensiveUnits": 0,
                    "offensiveWeapons": [
                        {
                            "bonus": 25,
                            "cost": "12,500",
                            "enabled": false,
                            "id": "WEAPON_OFFENSE_1",
                            "level": undefined,
                            "name": "Dagger",
                            "owneditems": 0,
                        },
                    ],
                    "pageTitle": "Armory",
                    "sentryArmor": [],
                    "sentryBoots": [],
                    "sentryBracers": [],
                    "sentryHelm": [],
                    "sentryShield": [],
                    "sentryUnits": 0,
                    "sentryWeapons": [],
                    "sidebarData": undefined,
                    "spyArmor": [],
                    "spyBoots": [],
                    "spyBracers": [],
                    "spyHelm": [],
                    "spyShield": [],
                    "spyUnits": 0,
                    "spyWeapons": [],
                    "userDataFiltered": undefined,
                    "units": undefined
                })
        });
        test('it ignores items that are unavailable', async () => {
            await controller.equipItemAction(mockRequest, mockResponse);
            expect(mockRequest.logger.debug).toHaveBeenCalledWith(
                'Items to be equipped',
                []
            );
            expect(mockResponse.json).toHaveBeenCalledWith({ error: 'No items to equip' })
        });
        test('it purchases one item', async () => {
            mockRequest.body = { "WEAPON_OFFENSE_1": 1 };
            await controller.equipItemAction(mockRequest, mockResponse);
            expect(mockRequest.logger.debug).toBeCalledWith('Items to be equipped', [{ "cost": 12500, "level": 1, "quantity": 1, "type": "WEAPON", "unitType": "OFFENSE" }])
            expect(mockRequest.user.subtractGold).toHaveBeenCalledWith(12500)
            expect(mockRequest.logger.debug).toBeCalledWith('Subtracted gold for equipment', 12500)
            expect(mockRequest.user.equipNewItems).toBeCalledWith([{ "level": 1, "quantity": 1, "type": "WEAPON", "unitType": "OFFENSE" }])
            expect(mockRequest.logger.debug).toBeCalledWith('New Equipment', [{ "cost": 12500, "level": 1, "quantity": 1, "type": "WEAPON", "unitType": "OFFENSE" }])
            expect(mockResponse.json).toBeCalledWith({
                success: 'Equipmented new items!',
                "stats": {
                    "citizens": undefined,
                    "defensiveArmor": [],
                    "defensiveBoots": [],
                    "defensiveBracers": [],
                    "defensiveHelm": [],
                    "defensiveShield": [],
                    "defensiveWeapons": [],
                    "gold": "NaN",
                    "goldInBank": "NaN",
                    "offensiveArmor": [],
                    "offensiveBoots": [],
                    "offensiveBracers": [],
                    "offensiveHelm": [],
                    "offensiveShield": [],
                    "offensiveWeapons": [
                        {
                            "bonus": 25,
                            "cost": "12,500",
                            "enabled": false,
                            "id": "WEAPON_OFFENSE_1",
                            "level": undefined,
                            "name": "Dagger",
                            "owneditems": 0,
                        },
                    ],
                    "sentryArmor": [],
                    "sentryBoots": [],
                    "sentryBracers": [],
                    "sentryHelm": [],
                    "sentryShield": [],
                    "sentryWeapons": [],
                    "spyArmor": [],
                    "spyBoots": [],
                    "spyBracers": [],
                    "spyHelm": [],
                    "spyShield": [],
                    "spyWeapons": [],
                },
            })
        });
        test('it ignores items not available to unequip', async () => {
            mockRequest.body = {
                "WEAPON_OFFENSE_2": 1
            };
            await controller.unequipItemAction(mockRequest, mockResponse);
            expect(mockRequest.logger.debug).toHaveBeenNthCalledWith(1, 'Items to be unequipped', []);
            expect(mockRequest.logger.debug).toHaveBeenNthCalledWith(2, 'No items to unequip');
            expect(mockResponse.json).toHaveBeenCalledWith({ error: 'No items to unequip' });
        });
        test('it unequips item', async () => {
            mockRequest.body = {
                "WEAPON_OFFENSE_1": 1
            };
            mockRequest.user.items = [
                { level: 1, type: "WEAPON", unitType: "OFFENSE", quantity: 2 }
            ]
            await controller.unequipItemAction(mockRequest, mockResponse);
            expect(mockRequest.user.unequipNewItems).toHaveBeenCalledWith([{ "level": 1, "quantity": 1, "type": "WEAPON", "unitType": "OFFENSE" }]);
            expect(mockRequest.logger.debug).toHaveBeenNthCalledWith(1, 'Items to be unequipped', [{ "cost": 12500, "level": 1, "quantity": 1, "type": "WEAPON", "unitType": "OFFENSE" }]);
            expect(mockRequest.logger.debug).toHaveBeenNthCalledWith(2, 'Unequipped new items', [{ "cost": 12500, "level": 1, "quantity": 1, "type": "WEAPON", "unitType": "OFFENSE" }]);
            expect(mockResponse.json).toHaveBeenCalledWith({
                success: 'Unequiped new items!',
                "stats": {
                    "citizens": undefined,
                    "defensiveArmor": [],
                    "defensiveBoots": [],
                    "defensiveBracers": [],
                    "defensiveHelm": [],
                    "defensiveShield": [],
                    "defensiveWeapons": [],
                    "gold": "NaN",
                    "goldInBank": "NaN",
                    "offensiveArmor": [],
                    "offensiveBoots": [],
                    "offensiveBracers": [],
                    "offensiveHelm": [],
                    "offensiveShield": [],
                    "offensiveWeapons": [
                        {
                            "bonus": 25,
                            "cost": "12,500",
                            "enabled": false,
                            "id": "WEAPON_OFFENSE_1",
                            "level": undefined,
                            "name": "Dagger",
                            "owneditems": 2,
                        },
                    ],
                    "sentryArmor": [],
                    "sentryBoots": [],
                    "sentryBracers": [],
                    "sentryHelm": [],
                    "sentryShield": [],
                    "sentryWeapons": [],
                    "spyArmor": [],
                    "spyBoots": [],
                    "spyBracers": [],
                    "spyHelm": [],
                    "spyShield": [],
                    "spyWeapons": [],
                }
            });
        });
    });
});