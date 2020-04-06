
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const Character = require('../models/contentDB/Character');
const Ancestry = require('../models/contentDB/Ancestry');
const Item = require('../models/contentDB/Item');
const Inventory = require('../models/contentDB/Inventory');
const InvItem = require('../models/contentDB/InvItem');
const CharCondition = require('../models/contentDB/CharCondition');

const CharDataStoring = require('./CharDataStoring');

function clearDataThatContains(charID, containing){
    return CharDataStoring.deleteProficiencies(charID, containing, true)
    .then((result) => {
        return CharDataStoring.deleteAbilityBonus(charID, containing, true)
        .then((result) => {
            return CharDataStoring.deleteFeats(charID, containing, true)
            .then((result) => {
                return CharDataStoring.deleteAbilityChoice(charID, containing, true)
                .then((result) => {
                    return CharDataStoring.deleteLanguages(charID, containing, true)
                    .then((result) => {
                        return CharDataStoring.deleteLore(charID, containing, true)
                        .then((result) => {
                            return;
                        });
                    });
                });
            });
        });
    });
}

function clearDataOfHigherLevel(charID, level){
    return CharDataStoring.deleteDataOfHigherLevel(charID, 'dataAbilityBonus', level)
    .then((result) => {
        return CharDataStoring.deleteDataOfHigherLevel(charID, 'dataLanguages', level)
        .then((result) => {
            return CharDataStoring.deleteDataOfHigherLevel(charID, 'dataProficiencies', level)
            .then((result) => {
                return CharDataStoring.deleteDataOfHigherLevel(charID, 'dataChosenFeats', level)
                .then((result) => {
                    return CharDataStoring.deleteDataOfHigherLevel(charID, 'dataAbilityChoices', level)
                    .then((result) => {
                        return CharDataStoring.deleteDataOfHigherLevel(charID, 'dataLoreCategories', level)
                        .then((result) => {
                            return;
                        });
                    });
                });
            });
        });
    });
}

module.exports = class CharSaving {

    static saveExp(charID, newExp) {
        let updateValues = { experience: newExp };
        return Character.update(updateValues, { where: { id: charID } })
        .then((result) => {
            return;
        });
    }

    static saveCurrentHitPoints(charID, currentHealth) {
        let updateValues = { currentHealth: currentHealth };
        return Character.update(updateValues, { where: { id: charID } })
        .then((result) => {
            return;
        });
    }

    static saveTempHitPoints(charID, tempHealth) {
        let updateValues = { tempHealth: tempHealth };
        return Character.update(updateValues, { where: { id: charID } })
        .then((result) => {
            return;
        });
    }

    static saveNotes(charID, notes) {
        let updateValues = { notes: notes };
        return Character.update(updateValues, { where: { id: charID } })
        .then((result) => {
            return;
        });
    }

    static saveHeroPoints(charID, heroPoints) {
        let updateValues = { heroPoints: heroPoints };
        return Character.update(updateValues, { where: { id: charID } })
        .then((result) => {
            return;
        });
    }

    static addCondition(charID, conditionID, value, sourceText) {
        return CharCondition.create({
            charID: charID,
            conditionID: conditionID,
            value: value,
            sourceText : sourceText,
            isActive : 1
        }).then((result) => {
            return;
        }).catch((error) => {
            console.error(error);
            return;
        });
    }

    static updateConditionValue(charID, conditionID, newValue) {
        let updateValues = { value: newValue };
        return CharCondition.update(updateValues, {
            where: {
                charID: charID,
                conditionID: conditionID
            }
        }).then((result) => {
            return;
        });
    }

    static updateConditionActive(charID, conditionID, isActive) {
        let updateValues = { isActive: (isActive) ? 1 : 0 };
        return CharCondition.update(updateValues, {
            where: {
                charID: charID,
                conditionID: conditionID
            }
        }).then((result) => {
            return;
        });
    }

    static updateConditionActiveForArray(charID, conditionIDArray, isActive) {
        let promises = []
        for(const conditionID of conditionIDArray) {
            var newPromise = CharSaving.updateConditionActive(charID, conditionID, isActive);
           promises.push(newPromise);
        };
        return Promise.all(promises)
        .then(function(result) {
            return;
        });
    }

    static removeCondition(charID, conditionID) {
        return CharCondition.destroy({
            where: {
                charID: charID,
                conditionID: conditionID
            }
        }).then((result) => {
            return;
        });
    }

    static addFundRune(invItemID, fundRuneID) {
        console.log("Adding rune ("+fundRuneID+") to invItem ("+invItemID+")");
        return;
    }

    static updateInventory(invID, equippedArmorInvItemID, equippedShieldInvItemID) {
        let updateValues = {
            equippedArmorInvItemID: equippedArmorInvItemID,
            equippedShieldInvItemID: equippedShieldInvItemID
        };
        return Inventory.update(updateValues, { where: { id: invID} })
        .then((result) => {
            return;
        });
    }

    static addItemToInv(invID, itemID, quantity) {
        return Item.findOne({ where: { id: itemID} })
        .then((chosenItem) => {
            return InvItem.create({
                invID: invID,
                itemID: chosenItem.id,
                name: chosenItem.name,
                price: chosenItem.price,
                bulk: chosenItem.bulk,
                description: chosenItem.description,
                size: chosenItem.size,
                quantity: quantity,
                isShoddy: chosenItem.isShoddy,
                currentHitPoints: chosenItem.hitPoints,
                hitPoints: chosenItem.hitPoints,
                brokenThreshold: chosenItem.brokenThreshold,
                hardness: chosenItem.hardness
            });
        });
    }

    static removeInvItemFromInv(invItemID) {
        return InvItem.destroy({ where: { id: invItemID } })
        .then((result) => {
            return;
        });
    }

    static saveInvItemToNewBag(invItemID, bagItemID) {
        let updateValues = { bagInvItemID: bagItemID };
        return InvItem.update(updateValues, { where: { id: invItemID } })
        .then((result) => {
            return;
        });
    }

    static saveInvItemQty(invItemID, newQty) {
        let updateValues = { quantity: newQty };
        return InvItem.update(updateValues, { where: { id: invItemID } })
        .then((result) => {
            return;
        });
    }

    static saveInvItemHitPoints(invItemID, newHP) {
        let updateValues = { currentHitPoints: newHP };
        return InvItem.update(updateValues, { where: { id: invItemID } })
        .then((result) => {
            return;
        });
    }

    static saveInvItemCustomize(invItemID, updateValues) {
        return InvItem.update(updateValues, { where: { id: invItemID } })
        .then((result) => {
            return;
        });
    }

    static saveName(charID, name) {

        let charUpVals = {name: name };

        // Update char name
        return Character.update(charUpVals, { where: { id: charID } })
        .then((result) => {
            return;
        });

    }

    static saveLevel(charID, newLevel) {

        newLevel = parseInt(newLevel);
        let charUpVals = {level: newLevel };

        return Character.findOne({ where: { id: charID} })
        .then((character) => {

            let oldLevel = character.level;

            // Update char level
            return Character.update(charUpVals, { where: { id: charID } })
            .then((result) => {
                
                if(oldLevel > newLevel){
                    return clearDataOfHigherLevel(charID, newLevel)
                    .then((result) => {
                        return;
                    });
                } else {
                    return;
                }

            });
        });

    }

    static saveAbilityScores(charID, abilSTR, abilDEX, abilCON, abilINT, abilWIS, abilCHA) {

        let abilityBonusArray = [
            { Ability : "STR", Bonus : abilSTR-10},
            { Ability : "DEX", Bonus : abilDEX-10},
            { Ability : "CON", Bonus : abilCON-10},
            { Ability : "INT", Bonus : abilINT-10},
            { Ability : "WIS", Bonus : abilWIS-10},
            { Ability : "CHA", Bonus : abilCHA-10}
        ];

        return CharDataStoring.replaceAbilityBonus(charID, 'Type-Other_Level-1_Code-None', abilityBonusArray)
        .then((result) => {
            return;
        });

    }

    static saveHeritage(charID, heritageID) {

        let charUpVals = {heritageID: heritageID };
        
        return Character.update({heritageID: heritageID }, { where: { id: charID } })
        .then((result) => {
            return;
        });

    }

    static saveAncestry(charID, ancestryID) {

        let charUpVals = {ancestryID: ancestryID };

        return Character.findOne({ where: { id: charID} })
        .then((character) => {
            return Ancestry.findOne({ where: { id: character.ancestryID} })
            .then((oldAncestry) => {
                return CharDataStoring.removeCharTag(charID, oldAncestry.name).then((result) => {
                    return Ancestry.findOne({ where: { id: ancestryID} })
                    .then((newAncestry) => {
                        return CharDataStoring.addCharTag(charID, newAncestry.name).then((result) => {
                            return Character.update(charUpVals, { where: { id: charID } })
                            .then((result) => {
                                return clearDataThatContains(charID, 'Type-Ancestry')
                                .then((result) => {
                                    return Character.update({heritageID: null }, { where: { id: charID } })
                                    .then((result) => {
                                        return;
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });

    }

    static saveBackground(charID, backgroundID) {

        let charUpVals = {backgroundID: backgroundID };
        
        return Character.update(charUpVals, { where: { id: charID } })
        .then((result) => {
            return clearDataThatContains(charID, 'Type-Background')
            .then((result) => {
                return;
            });
        });

    }


    static saveClass(charID, classID) {

        let charUpVals = {classID: classID };

        return Character.update(charUpVals, { where: { id: charID } })
        .then((result) => {
            return clearDataThatContains(charID, 'Type-Class')
            .then((result) => {
                return;
            });
        });

    }



};