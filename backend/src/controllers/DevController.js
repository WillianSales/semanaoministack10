const axios = require('axios');
const Dev = require('../models/Dev');
const parseStringAsArray = require('../utils/parseStringAsArray');
const { findConnections, sendMessage } = require('../websocket');

// index, show, store, update, destroy

module.exports = {

    async index(request, response) {
        const devs = await Dev.find();

        return response.json(devs);
    },

    async store(request, response) {
        const { github_username, techs, latitude, longitude } = request.body;

        let dev = await Dev.findOne({ github_username });

        if(!dev){

            const apiResponse = await axios.get(`https://api.github.com/users/${github_username}`);
    
            const { name = login, bio, avatar_url } = apiResponse.data;
        
            const techsArray = parseStringAsArray(techs);
        
            const location = {
                type: 'Point',
                coordinates: [longitude, latitude],
            }
            
            dev = await Dev.create({
                github_username,
                name,
                avatar_url,
                bio,
                techs: techsArray,
                location
            });

            // Filtrar conexões Geo no máximo 10km de distância e techs

            const sendSocketMessageTo = findConnections(
                { latitude, longitude },
                techsArray,
            )

            sendMessage(sendSocketMessageTo, 'new-dev', dev);

        }

        return response.json(dev);

    },

    // async update(request, response) {

    //     const { github_username, techs, latitude, longitude } = request.body;

    //     let dev = await Dev.findOne({ github_username });

    //     if(dev){

    //         const techsArray = parseStringAsArray(techs);

    //         const location = {
    //             type: 'Point',
    //             coordinates: [longitude, latitude],
    //         }

    //         dev = await Dev.update({ 
    //             github_username: github_username
    //         },
    //         {
    //             $set: {
    //                 "github_username": github_username,
    //                 techs: techsArray,
    //                 "location": location
    //             }
    //         },     
    //         );
    //     }

    //     return response.json(dev);
    // },

    // async destroy(request, response) {

    //     const { github_username } = request.query;

    //     await Dev.deleteOne({ github_username: github_username });

    //     return response.json(github_username);
    // },
};