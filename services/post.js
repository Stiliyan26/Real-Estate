const Housing = require('../models/Housing');

async function createHousing(house) {
    const result = new Housing(house);
    await result.save();
}

async function getAllHouses() {
    return await Housing.find({}).lean();
}

async function getHouseById(id) {
    return await Housing.findById(id).lean();
}

async function getHouseAndUsers(id) {
    return await Housing.findById(id).populate('owner').populate('rentedHome').lean();
}

async function updateHouse(houseId, house) {
    const existing = await Housing.findById(houseId);

    existing.name = house.name;
    existing.type = house.type;
    existing.year = Number(house.year);
    existing.city = house.city;
    existing.image = house.image;
    existing.description = house.description;
    existing.avPieces = Number(house.avPieces);

    await existing.save();
}

async function deleteById(id) {
    await Housing.findByIdAndDelete(id);
}

async function rentsHouseAction(userId, houseId) {
    const house = await Housing.findById(houseId);

    if (house.rentedHome.includes(userId)) {
        throw new Error('User has already rented a piece');
    }

    house.rentedHome.push(userId);
    await house.save();
};

async function getHousesByType(type) {
    return await Housing.find({ type: { $regex: new RegExp(type, "i") } }).lean();
}


module.exports = {
    createHousing,
    getAllHouses,
    getHouseById,
    getHouseAndUsers,
    updateHouse,
    deleteById,
    rentsHouseAction,
    getHousesByType
}