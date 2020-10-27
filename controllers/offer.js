const crudAPI = require('./crudAPI');
const ShoesOffer = require('../models/shoesOffer');

const saveOffer = async (data) => {
    new ShoesOffer({
        name: data.name,
        price: data.price,
        imageUrl: data.imageUrl,
        brand: data.brand,
        description: data.description,
        creatorName: data.creatorName
    }).save((err, createdObject) => {
        if (err) {
            console.log("Error occurred", err);
            return err
        }
        console.log('Offer is succesffully stored!');
        return createdObject;
    });

};

const getAllOffers = async () => {
    const currentOffers = await crudAPI.getAllItems(ShoesOffer);
    return currentOffers;
};

const getOfferById = async (id) => {
    const currentOffer = await crudAPI.getItemById(id, ShoesOffer);
    return currentOffer;
}

const findOneAndUpdate = async (id, data) => {
    const current = await crudAPI.findAndUpdate(id, data, ShoesOffer)
    return current
};

const deleteByID = async (id) => {
    return await ShoesOffer.deleteOne({ _id: id });
}

const buyOffer = async (id, data) => {
    const status = await ShoesOffer.findOneAndUpdate({ _id: id }, { $set: data }, { new: true })
    return status;
}

module.exports = {
    saveOffer,
    getAllOffers,
    getOfferById,
    findOneAndUpdate,
    deleteByID,
    buyOffer
}