import {Router} from 'express';
import multer from "multer";
import {celebrate, Joi} from "celebrate";
import knex from "../database/connection";
import multerConfig from '../config/multer';
import isAuthenticated from "../middlewares/isAuthenticated";

const locationsRouter: Router = Router();

const upload = multer(multerConfig);

locationsRouter.use(isAuthenticated);

locationsRouter.get('/', async (request, response) => {
    const { city, uf, itemIds } = request.query;

    if(city && uf && itemIds) {

        const parsedItems: Number[] = String(itemIds).split(',').map(item => Number(item.trim()));

        const locations = await knex('locations')
            .join('location_items', 'locations.id', '=', 'location_items.location_id')
            .whereIn('location_items.item_id', parsedItems)
            .where('city', String(city))
            .where('uf', String(uf))
            .distinct()
            .select('locations.*');

        return response.json(locations);
    }
    else {
        const locations = await knex('locations').select('*');
        return response.json(locations);
    }
});

locationsRouter.get('/:id', async (request, response) => {
    const { id } = request.params;

    const location = await knex('locations').where('id', id).first();

    if(!location) {
        return response.status(400).json({ message: 'Location not found.' });
    }

    const items = await knex('items')
        .join('location_items', 'items.id', '=', 'location_items.item_id')
        .where('location_items.location_id', id)
        .select('items.title');

    return response.json({ location, items });
});

locationsRouter.post('/', celebrate({
    body: Joi.object().keys({
        name: Joi.string().required(),
        email: Joi.string().required().email().label('e-mail'),
        whatsapp: Joi.string().required(),
        latitude: Joi.number().required(),
        longitude: Joi.number().required(),
        city: Joi.string().required(),
        uf: Joi.string().required().max(2).min(2).messages({
            'string.base': `"uf" should be a type of 'text'`,
            'string.empty': `"uf" cannot be an empty field`,
            'string.min': `"uf" should have a minimum length of {#limit}`,
            'string.max': `"uf" should have a maximum length of {#limit}`,
            'any.required': `"uf" is a required field`
        }),
        items: Joi.array().items(Joi.number()).required(),
        image: Joi.string().required(),
    })
}, {
    abortEarly: false
}), async (request, response) => {
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

locationsRouter.put('/:id', upload.single('image'), async (request, response) => {
    const { id } = request.params;

    const image = request.file.filename;

    const location = await knex('locations').where('id', id).first();

    if(!location) {
        return response.status(400).json({ message: 'Location not found.' });
    }

    const locationUpdate = {
        ...location,
        image
    }

    await knex('locations').update(locationUpdate).where('id', id);

    return response.json(locationUpdate);

});


export default locationsRouter;