import { Router } from 'express';
import knex from "../database/connection";

const locationsRouter: Router = Router();

locationsRouter.post('/', async (request, response) => {
    const {
        name,
        email,
        whatsapp,
        latitude,
        longitude,
        city,
        uf,
        items
    } = request.body;

    const location: Object = {
        image: "fake_image.jpg",
        name,
        email,
        whatsapp,
        latitude,
        longitude,
        city,
        uf
    }

    const transaction = await knex.transaction();

    const newIds = await transaction('locations').insert(location);

    const location_id = newIds[0];

    const locationItems = items.map((item_id: number) => {
        const selectedItem = transaction('items').where('id', item_id).first();

        if (!selectedItem) {
            return response.status(400).json({ message: 'Item not found.' });
        }

        return {
            item_id,
            location_id
        }
    });

    await transaction('location_items').insert(locationItems);

    await transaction.commit();

    return response.json({
        id: location_id,
        ...location
    });
});

export default locationsRouter;