var mysql = require('mysql2');
var DBPool = require('../database');
let path = require("path");
var fs = require("fs");



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

    async getPlantIDByName(request, response) {

        try {
            //make query and send results
            const [results, fields] = await DBPool.query(`SELECT PlantID FROM plantdb.plant WHERE CommonName = ?`, request.params.commonname);
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


    async archivePlant(request, response) {

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

    async UpdatePlant(request, response) {

        try {
            //update the row
            await DBPool.query(`UPDATE plantdb.plant SET CommonName = ?, Type = ?, NativeCountry = ?, Symbolism = ?, EndangeredStatus = ?, EnvironmentalThreat = ?, LifeSpan = ?, BloomTime = ?, SizeRange = ?, Spread = ?, FlowerSize = ?, Difficulty = ?, SunlightNeeds = ?, Hardiness = ?, HardinessZones = ?, SoilType = ?, WaterNeeds = ?, FertilisationNeeds = ?, Pruning = ?, Propagation = ?, Pests = ?, PlantingTime = ?, HarvestTime = ?, PottingNeeds = ?, EnvironmentalUses = ?, EconomicUses = ?, HomeUses = ? WHERE (PlantID = ?);`,
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
            await DBPool.query(`INSERT INTO plantdb.plant (CommonName, Type, NativeCountry, Symbolism, EndangeredStatus, EnvironmentalThreat, LifeSpan, BloomTime, SizeRange, Spread, FlowerSize, Difficulty, SunlightNeeds, Hardiness, HardinessZones, SoilType, WaterNeeds, FertilisationNeeds, Pruning, Propagation, Pests, PlantingTime, HarvestTime, PottingNeeds, EnvironmentalUses, EconomicUses, HomeUses) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);`,
                [request.body.commonName, request.body.type, request.body.nativeCountry, request.body.symbolism, request.body.endangeredStatus, request.body.environmentalThreat, request.body.lifeSpan, request.body.bloomTime, request.body.sizeRange, request.body.spread, request.body.flowerSize, request.body.difficulty, request.body.sunlightNeeds, request.body.hardiness, request.body.hardinessZones, request.body.soilType, request.body.waterNeeds, request.body.fertilisationNeeds, request.body.pruning, request.body.propagation, request.body.pests, request.body.plantingTime, request.body.harvestTime, request.body.pottingNeeds, request.body.environmentalUses, request.body.economicUses, request.body.homeUses]);

            response.sendStatus(200);
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
            const [results, fields] = await DBPool.query(`SELECT AltName FROM plantdb.name WHERE PlantID = ?`, request.params.id);
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
            var names = request.body.names;

            if (names.length >= 0) {
                await DBPool.query(`DELETE FROM plantdb.name WHERE PlantID = ?`, request.params.id);

                for (var i = 0; i < names.length; i++) {
                    await DBPool.query(`INSERT INTO plantdb.name (AltName, PlantID) VALUES (?,?)`, [names[i], request.params.id]);
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

    async getPlantImages(request, response) {

        try {
            //make query and send results
            const [results, fields] = await DBPool.query(`SELECT ImagePath FROM plantdb.image WHERE PlantID = ?`, request.params.id);
            response.send(results);
        }
        //error handling
        catch (err) {
            response.sendStatus(500);
            console.log(err)
        }
    },

    uploadImages(req, res) {

        var images = []
        // Check if upload failed or was aborted
        if (req.jfum.error) {
            // req.jfum.error

        } else {
            // Here are the uploaded files
            for (var i = 0; i < req.jfum.files.length; i++) {
                var file = req.jfum.files[i];

                // Check if file has errors
                if (file.errors.length > 0) {
                    for (var j = 0; i < file.errors.length; i++) {
                    }

                } else {
                    images.push({ path: file.path, name: file.name })
                }
            }

            var oldPath = "";
            var newPath = "";

            for (var i = 0; i < images.length; i++) {
                console.log(images[i])
                oldPath = images[i].path
                newPath = path.join(__dirname, "../../public/images/" + images[i].name)

                 fs.rename(oldPath, newPath, function (err) {
                    if (err) throw err
                    console.log('Successfully renamed - AKA moved!')
                }) 
            }
            res.sendStatus(200)
        }
    },

    async updatePlantImages(request, response) {

        var existingFiles = request.body.existingImageNames
        var newImages = request.body.newImages

        try {
            if (existingFiles.length >= 0) {
                await DBPool.query(`DELETE FROM plantdb.image WHERE PlantID = ?`, request.params.id);

                for (var i = 0; i < existingFiles.length; i++) {
                    await DBPool.query(`INSERT INTO plantdb.image (ImagePath, PlantID) VALUES (?,?)`, [existingFiles[i], request.params.id]);
                }
            }

            if (newImages.length >= 0) {
                for (var i = 0; i < newImages.length; i++) {
                    await DBPool.query(`INSERT INTO plantdb.image (ImagePath, PlantID) VALUES (?,?)`, [newImages[i], request.params.id]);
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

    async searchPlants(request, response) {

        let text = "%" + request.params.searchtext + "%";

        try {
            //make query and send results
            const [results, fields] = await DBPool.query(`SELECT plant.PlantID, CommonName, IFNULL(AltName, CommonName) as AltName FROM plantdb.plant 
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