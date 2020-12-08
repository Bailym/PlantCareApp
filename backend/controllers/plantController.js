var mysql = require('mysql2');
var DBPool = require('../database');



module.exports = {

    async getPlants(request, response) {

        try {
            //make query and send results
            const [results, fields] = await DBPool.query(`SELECT * FROM plantdb.plant`);
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
            const [results, fields] = await DBPool.query(`SELECT * FROM plantdb.plant WHERE PlantID = ?`, request.params.id);
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
            const [results, fields] = await DBPool.query(`SELECT PlantID AS "key", PlantID, CommonName, Type FROM plantdb.plant`);
            response.send(results);
        }
        //error handling
        catch (err) {
            response.sendStatus(500);
            console.log(err)
        }
    },


     async archivePlant(request, response){

        try {

            //insert the row into the archive
             await DBPool.query(`INSERT INTO plantdb.plantArchive (PlantID, CommonName, Type, NativeCountry, Symbolism, EndangeredStatus, EnvironmentalThreat, LifeSpan, BloomTime, SizeRange, Spread, FlowerSize, Difficulty, SunlightNeeds, Hardiness, HardinessZones,
                SoilType, WaterNeeds, FertilisationNeeds, Pruning, Propagation, Pests, PlantingTime, HarvestTime, PottingNeeds, EnvironmentalUses, EconomicUses, HomeUses) 
                SELECT * FROM plantdb.plant WHERE PlantID = ?`, request.params.id); 
            //delete the original
             await DBPool.query(`DELETE FROM plantdb.plant WHERE PlantID = ?`, request.params.id); 

            response.sendStatus(200);
        }
        //error handling
        catch (err) {
            response.sendStatus(500);
            console.log(err)
        }
    },

    async UpdatePlant(request, response){

        try {
            //update the row
             await DBPool.query(`UPDATE plantdb.plant SET CommonName = ?, Type = ?, NativeCountry = ?, Symbolism = ?, EndangeredStatus = ?, EnvironmentalThreat = ?, LifeSpan = ?, BloomTime = ?, SizeRange = ?, Spread = ?, FlowerSize = ?, Difficulty = ?, SunlightNeeds = ?, Hardiness = ?, HardinessZones = ?, SoilType = ?, WaterNeeds = ?, FertilisationNeeds = ?, Pruning = ?, Propagation = ?, Pests = ?, PlantingTime = ?, HarvestTime = ?, PottingNeeds = ?, EnvironmentalUses = ?, EconomicUses = ?, HomeUses = ? WHERE (PlantID = ?);`,
              [request.body.commonName, request.body.type, request.body.nativeCountry, request.body.symbolism, request.body.endangeredStatus, request.body.environmentalThreat, request.body.lifeSpan, request.body.bloomTime,request.body.sizeRange, request.body.spread,  request.body.flowerSize, request.body.difficulty, request.body.sunlightNeeds, request.body.hardiness, request.body.hardinessZones, request.body.soilType, request.body.waterNeeds, request.body.fertilisationNeeds, request.body.pruning, request.body.propagation, request.body.pests, request.body.plantingTime, request.body.harvestTime, request.body.pottingNeeds, request.body.environmentalUses, request.body.economicUses, request.body.homeUses, request.body.plantID]); 

            response.sendStatus(200);
        }
        //error handling
        catch (err) {
            response.sendStatus(500);
            console.log(err)
        }
    },

    async CreatePlant(request, response){

        try {
            //update the row
             await DBPool.query(`INSERT INTO plantdb.plant (CommonName, Type, NativeCountry, Symbolism, EndangeredStatus, EnvironmentalThreat, LifeSpan, BloomTime, SizeRange, Spread, FlowerSize, Difficulty, SunlightNeeds, Hardiness, HardinessZones, SoilType, WaterNeeds, FertilisationNeeds, Pruning, Propagation, Pests, PlantingTime, HarvestTime, PottingNeeds, EnvironmentalUses, EconomicUses, HomeUses) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);`,
              [request.body.commonName, request.body.type, request.body.nativeCountry, request.body.symbolism, request.body.endangeredStatus, request.body.environmentalThreat, request.body.lifeSpan, request.body.bloomTime,request.body.sizeRange, request.body.spread,  request.body.flowerSize, request.body.difficulty, request.body.sunlightNeeds, request.body.hardiness, request.body.hardinessZones, request.body.soilType, request.body.waterNeeds, request.body.fertilisationNeeds, request.body.pruning, request.body.propagation, request.body.pests, request.body.plantingTime, request.body.harvestTime, request.body.pottingNeeds, request.body.environmentalUses, request.body.economicUses, request.body.homeUses]); 

            response.sendStatus(200);
        }
        //error handling
        catch (err) {
            response.sendStatus(500);
            console.log(err)
        }
    },

}