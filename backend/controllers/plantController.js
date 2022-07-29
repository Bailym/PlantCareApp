var DBPool = require('../database');

module.exports = {

    async getPlants(request, response) {

        try {
            //make query and send results
            const [results, fields] = await DBPool.query(`SELECT * FROM plant`);
            response.send(results);
        }
        //error handling
        catch (err) {
            response.sendStatus(500);
            console.log(err)
        }

    },

    async getPlantID(request, response) {

        try {
            //make query and send results
            const [results, fields] = await DBPool.query(`SELECT * FROM plant WHERE PlantID = ?`, request.params.id);
            response.send(results);
        }
        //error handling
        catch (err) {
            response.sendStatus(500);
            console.log(err)
        }

    },

    async getPlantIDByName(request, response) {

        try {
            //make query and send results
            const [results, fields] = await DBPool.query(`SELECT PlantID FROM plant WHERE CommonName = ?`, request.params.commonname);
            response.send(results);
        }
        //error handling
        catch (err) {
            response.sendStatus(500);
            console.log(err)
        }

    },

    async getPlantsAdminTable(request, response) {

        try {
            //make query and send results
            const [results, fields] = await DBPool.query(`SELECT PlantID AS "key", PlantID, CommonName, Type FROM plant`);
            response.send(results);
        }
        //error handling
        catch (err) {
            response.sendStatus(500);
            console.log(err)
        }
    },


    async archivePlant(request, response) {

        try {

            //insert the row into the archive
            await DBPool.query(`INSERT INTO plantarchive (PlantID, CommonName, Type, NativeCountry, Symbolism, EndangeredStatus, EnvironmentalThreat, LifeSpan, BloomTime, SizeRange, Spread, FlowerSize, Difficulty, SunlightNeeds, Hardiness, HardinessZones,
                SoilType, WaterNeeds, FertilisationNeeds, Pruning, Propagation, Pests, PlantingTime, HarvestTime, PottingNeeds, EnvironmentalUses, EconomicUses, HomeUses) 
                SELECT * FROM plant WHERE PlantID = ?`, request.params.id);
            //delete the original
            await DBPool.query(`DELETE FROM plant WHERE PlantID = ?`, request.params.id);

            response.sendStatus(200);
        }
        //error handling
        catch (err) {
            response.sendStatus(500);
            console.log(err)
        }
    },

    //TESTING ONLY
    async deletePlant(request, response) {

        try {
            await DBPool.query(`DELETE FROM plant WHERE PlantID = ?`, request.params.id);
            response.sendStatus(200);
        }
        //error handling
        catch (err) {
            response.sendStatus(500);
            console.log(err)
        }
    },

    async UpdatePlant(request, response) {

        try {
            //update the row
            await DBPool.query(`UPDATE plant SET CommonName = ?, Type = ?, NativeCountry = ?, Symbolism = ?, EndangeredStatus = ?, EnvironmentalThreat = ?, LifeSpan = ?, BloomTime = ?, SizeRange = ?, Spread = ?, FlowerSize = ?, Difficulty = ?, SunlightNeeds = ?, Hardiness = ?, HardinessZones = ?, SoilType = ?, WaterNeeds = ?, FertilisationNeeds = ?, Pruning = ?, Propagation = ?, Pests = ?, PlantingTime = ?, HarvestTime = ?, PottingNeeds = ?, EnvironmentalUses = ?, EconomicUses = ?, HomeUses = ? WHERE (PlantID = ?);`,
                [request.body.commonName, request.body.type, request.body.nativeCountry, request.body.symbolism, request.body.endangeredStatus, request.body.environmentalThreat, request.body.lifeSpan, request.body.bloomTime, request.body.sizeRange, request.body.spread, request.body.flowerSize, request.body.difficulty, request.body.sunlightNeeds, request.body.hardiness, request.body.hardinessZones, request.body.soilType, request.body.waterNeeds, request.body.fertilisationNeeds, request.body.pruning, request.body.propagation, request.body.pests, request.body.plantingTime, request.body.harvestTime, request.body.pottingNeeds, request.body.environmentalUses, request.body.economicUses, request.body.homeUses, request.body.plantID]);

            response.sendStatus(200);
        }
        //error handling
        catch (err) {
            response.sendStatus(500);
            console.log(err)
        }
    },

    async CreatePlant(request, response) {

        try {
            //update the row
            await DBPool.query(`INSERT INTO plant (CommonName, Type, NativeCountry, Symbolism, EndangeredStatus, EnvironmentalThreat, LifeSpan, BloomTime, SizeRange, Spread, FlowerSize, Difficulty, SunlightNeeds, Hardiness, HardinessZones, SoilType, WaterNeeds, FertilisationNeeds, Pruning, Propagation, Pests, PlantingTime, HarvestTime, PottingNeeds, EnvironmentalUses, EconomicUses, HomeUses) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);`,
                [request.body.commonName, request.body.type, request.body.nativeCountry, request.body.symbolism, request.body.endangeredStatus, request.body.environmentalThreat, request.body.lifeSpan, request.body.bloomTime, request.body.sizeRange, request.body.spread, request.body.flowerSize, request.body.difficulty, request.body.sunlightNeeds, request.body.hardiness, request.body.hardinessZones, request.body.soilType, request.body.waterNeeds, request.body.fertilisationNeeds, request.body.pruning, request.body.propagation, request.body.pests, request.body.plantingTime, request.body.harvestTime, request.body.pottingNeeds, request.body.environmentalUses, request.body.economicUses, request.body.homeUses]);

            const newPlantID = await DBPool.query("SELECT LAST_INSERT_ID()")

            response.send({ "LastID": newPlantID[0][0][`LAST_INSERT_ID()`] })
            
        }
        //error handling
        catch (err) {
            response.sendStatus(500);
            console.log(err)
        }
    },

    async getPlantNames(request, response) {

        try {
            //make query and send results
            const [results, fields] = await DBPool.query(`SELECT AltName FROM name WHERE PlantID = ?`, request.params.id);
            response.send(results);
        }
        //error handling
        catch (err) {
            response.sendStatus(500);
            console.log(err)
        }
    },

    async updatePlantNames(request, response) {

        try {
            var names = request.body;
            if (names) {
                await DBPool.query(`DELETE FROM name WHERE PlantID = ?`, request.params.id);    //delete all existing names

                for (var i = 0; i < names.length; i++) {
                    await DBPool.query(`INSERT INTO name (AltName, PlantID) VALUES (?,?)`, [names[i], request.params.id]);  //add in submitted names. (not the most efficient way, but it works)
                }
            }
            response.sendStatus(200);
        }
        //error handling
        catch (err) {
            response.sendStatus(500);
            console.log(err)
        }
    },

    //TESTING ONLY
    async deletePlantNames(request, response) {

        try {
            await DBPool.query(`DELETE FROM name WHERE PlantID = ?`, request.params.id);
            response.sendStatus(200);
        }
        //error handling
        catch (err) {
            response.sendStatus(500);
            console.log(err)
        }
    },

    async searchPlants(request, response) {

        let text = "%" + request.params.searchtext + "%";

        try {
            //make query and send results
            const [results, fields] = await DBPool.query(`SELECT plant.PlantID, CommonName, IFNULL(AltName, CommonName) as AltName FROM plant 
            LEFT JOIN name ON plant.PlantID = name.PlantID
            WHERE CommonName LIKE ? OR AltName LIKE ?`, [text, text]);
            response.send(results);
        }
        //error handling
        catch (err) {
            response.sendStatus(500);
            console.log(err)
        }
    },


}