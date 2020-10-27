const crudAPI = {
    saveItem: async function (data, theClass) {
        return new theClass(data).save((err) => {
            if (err) {
                console.error(err);
                return null;
            };
        });

    },
    getItemById: async function (id, theClass) {
        const item = await theClass.findById(id).lean();
        return item
    },
    getAllItems: async function (theClass) {
        const items = await theClass.find().lean();
        return items
    },
    getItemByUsername: async function (prop, theClass) {
        const selectedItem = await theClass.findOne({ username: prop }).lean();
        return selectedItem;
    },
    findAndUpdate: async function (id, update, theClass) {
        const current = await theClass.findByIdAndUpdate(id, update)
        return current;
    }
};

module.exports = crudAPI;