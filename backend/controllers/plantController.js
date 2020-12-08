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

}