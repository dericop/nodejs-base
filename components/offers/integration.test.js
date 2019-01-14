const request = require('supertest');
const { Offer } = require('./Offer');
const { User } = require('../users/User');

let server;

describe('/api/offers', () => {
  beforeEach(() => {
    server = require('../../server');
  });
  afterEach(async () => {
    server.close();
    await Offer.remove({});
  });

  describe('GET /', () => {
    it('Debe retornar todas las ofertas', async () => {
      await Offer.collection.insertMany([
        {
          title: 'Titulo de oferta 1',
          address: 'Carrera 44 # 10 - 83, Manizales',
          details:
            'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Rem amet consectetur adipisicing elit. Rem Lorem ipsum, dolor sit amet consectetur adipisicing elit. Rem amet consectetur adipisicing elit. Rem Lorem ipsum, dolor sit amet consectetur adipisicing elit. Rem amet consectetur adipisicing elit. Rem',
          budget: 150000,
          author: 'dericop',
        },
        {
          title: 'Titulo de oferta 2',
          address: 'Carrera 44 # 10 - 83, Manizales',
          details:
            'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Rem amet consectetur adipisicing elit. Rem Lorem ipsum, dolor sit amet consectetur adipisicing elit. Rem amet consectetur adipisicing elit. Rem Lorem ipsum, dolor sit amet consectetur adipisicing elit. Rem amet consectetur adipisicing elit. Rem',
          budget: 150000,
          author: 'dericop',
        },
      ]);

      const res = await request(server).get('/api/offers');
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(
        res.body.some((of) => of.title === 'Titulo de oferta 1')
      ).toBeTruthy();
    });
  });

  describe('GET /:id', () => {
    it('Debe retornar una oferta si un identificador válido es enviado', async () => {
      const offer = new Offer({
        title: 'Titulo de oferta 1',
        address: 'Carrera 44 # 10 - 83, Manizales',
        details:
          'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Rem amet consectetur adipisicing elit. Rem Lorem ipsum, dolor sit amet consectetur adipisicing elit. Rem amet consectetur adipisicing elit. Rem Lorem ipsum, dolor sit amet consectetur adipisicing elit. Rem amet consectetur adipisicing elit. Rem',
        budget: 150000,
        author: 'dericop',
      });
      await offer.save();
      const res = await request(server).get(`/api/offers/${offer._id}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('title', offer.title);
      expect(res.body).toHaveProperty('address', offer.address);
      expect(res.body).toHaveProperty('details', offer.details);
      expect(res.body).toHaveProperty('budget', offer.budget);
      expect(res.body).toHaveProperty('author', offer.author);
    });

    it('Debe retornar un error 404 si un identificador invalido es enviado', async () => {
      const res = await request(server).get('/api/offers/1');

      expect(res.status).toBe(404);
    });
  });

  describe('POST /', () => {
    let token;
    let title;
    let address;
    let details;
    let budget;
    let author;
    let isPublished;
    let dueDate;
    let state;

    const exec = async () => {
      const offer = {
        title,
        address,
        details,
        budget,
        author,
        isPublished,
        dueDate,
        state,
      };

      const res = await request(server)
        .post('/api/offers')
        .set('Authorization', `Bearer ${token}`)
        .send(offer);

      return res;
    };

    beforeEach(() => {
      token = new User().generateAuthToken();
      title = 'Lorem ipsum, dolor';
      address = 'Carrera 44 # 10 - 83, Manizales';
      details = `Lorem ipsum, dolor sit amet consectetur adipisicing elit. 
      Rem amet consectetur adipisicing elit. Rem Lorem ipsum, dolor sit amet 
      consectetur adipisicing elit. Rem amet consectetur adipisicing elit. 
      Rem Lorem ipsum, dolor sit amet consectetur adipisicing elit. 
      Rem amet consectetur adipisicing elit. Rem`;
      budget = 150000;
      author = 'dericop';
      isPublished = false;
      dueDate = Date.now();
      state = 'asignado';
    });

    it('Debe retornar 401 si el usuario no está logueado', async () => {
      token = '';
      const res = await exec();
      expect(res.status).toBe(401);
    });

    it('Debe retornar 400 si la oferta tiene un título con longitud menor a 5', async () => {
      title = new Array(5).join('a');
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it('Debe retornar 400 si la oferta tiene un título con longitud mayor a 100', async () => {
      title = new Array(102).join('a');
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it('Debe retornar 400 si la oferta tiene un título con un tipo de dato diferente a String', async () => {
      title = 1;
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it('Debe retornar 400 si la oferta tiene una dirección con un tipo de dato diferente a String', async () => {
      address = 1;
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it('Debe retornar 400 si la oferta tiene un detalle con longitud mayor a 1000', async () => {
      details = new Array(1002).join('a');
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it('Debe retornar 400 si la oferta tiene un detalle de tipo diferente a String', async () => {
      details = 1;
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it('Debe retornar 400 si la oferta tiene un presupuesto no numérico', async () => {
      budget = 'abc';
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it('Debe retornar 400 si la oferta tiene un autor no String', async () => {
      author = 1;
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it('Debe retornar 400 si se envia un atributo isPublished y este no es booleano', async () => {
      isPublished = 'abc';
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it('Debe retornar 400 si se envia un atributo dueDate y este no es una fecha', async () => {
      dueDate = 'abc';
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it('Debe retornar 400 si el estado de la oferta es un string diferente a [abierto, asignado, completado]', async () => {
      state = 'miEstado';
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it('Debe retornar 400 si el estado de la oferta es de un tipo diferente a String', async () => {
      state = 1;
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it('Debe guardar la oferta si es válida', async () => {
      await exec();

      const offerBD = Offer.find({ title: 'Lorem ipsum, dolor' });
      expect(offerBD).not.toBeNull();
    });

    it('Debe retornar la oferta si es válida', async () => {
      const res = await exec();

      expect(res.body).toHaveProperty('_id');
      expect(res.body).toHaveProperty('title', 'Lorem ipsum, dolor');
    });
  });

  describe('PUT /:id', () => {
    let token;
    let title;
    let address;
    let details;
    let budget;
    let author;
    let isPublished;
    let dueDate;
    let state;

    const exec = async () => {
      const offerdb = new Offer({
        title: 'Titulo de oferta 1',
        address: 'Carrera 44 # 10 - 83, Manizales',
        details:
          'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Rem amet consectetur adipisicing elit. Rem Lorem ipsum, dolor sit amet consectetur adipisicing elit. Rem amet consectetur adipisicing elit. Rem Lorem ipsum, dolor sit amet consectetur adipisicing elit. Rem amet consectetur adipisicing elit. Rem',
        budget: 150000,
        author: 'dericop',
      });

      await offerdb.save();

      const offer = {
        title,
        address,
        details,
        budget,
        author,
        isPublished,
        dueDate,
        state,
      };

      const res = await request(server)
        .put(`/api/offers/${offerdb._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(offer);

      return res;
    };

    beforeEach(() => {
      token = new User().generateAuthToken();
      title = 'Lorem ipsum, dolor';
      address = 'Carrera 44 # 10 - 83, Manizales';
      details = `Lorem ipsum, dolor sit amet consectetur adipisicing elit. 
      Rem amet consectetur adipisicing elit. Rem Lorem ipsum, dolor sit amet 
      consectetur adipisicing elit. Rem amet consectetur adipisicing elit. 
      Rem Lorem ipsum, dolor sit amet consectetur adipisicing elit. 
      Rem amet consectetur adipisicing elit. Rem`;
      budget = 150000;
      author = 'dericop';
      isPublished = false;
      dueDate = Date.now();
      state = 'asignado';
    });

    it('Debe retornar 401 si el usuario no está logueado', async () => {
      token = '';
      const res = await exec();
      expect(res.status).toBe(401);
    });

    it('Debe retornar 400 si la oferta tiene un título con longitud menor a 5', async () => {
      title = new Array(5).join('a');
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it('Debe retornar 400 si la oferta tiene un título con longitud mayor a 100', async () => {
      title = new Array(102).join('a');
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it('Debe retornar 400 si la oferta tiene un título con un tipo de dato diferente a String', async () => {
      title = 1;
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it('Debe retornar 400 si la oferta tiene una dirección con un tipo de dato diferente a String', async () => {
      address = 1;
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it('Debe retornar 400 si la oferta tiene un detalle con longitud mayor a 1000', async () => {
      details = new Array(1002).join('a');
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it('Debe retornar 400 si la oferta tiene un detalle de tipo diferente a String', async () => {
      details = 1;
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it('Debe retornar 400 si la oferta tiene un presupuesto no numérico', async () => {
      budget = 'abc';
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it('Debe retornar 400 si la oferta tiene un autor no String', async () => {
      author = 1;
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it('Debe retornar 400 si se envia un atributo isPublished y este no es booleano', async () => {
      isPublished = 'abc';
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it('Debe retornar 400 si se envia un atributo dueDate y este no es una fecha', async () => {
      dueDate = 'abc';
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it('Debe retornar 400 si el estado de la oferta es un string diferente a [abierto, asignado, completado]', async () => {
      state = 'miEstado';
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it('Debe retornar 400 si el estado de la oferta es de un tipo diferente a String', async () => {
      state = 1;
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it('Debe actualizar la oferta si es válida', async () => {
      title = 'Mi nueva oferta';
      address = 'Carrera 44 # 10 - 83, Medellin';
      details = `Lorem ipsum, dolor sit amet consectetur adipisicing elit. 
      Rem amet consectetur adipisicing elit.`;
      budget = 100000;
      author = 'dericop';
      isPublished = true;
      dueDate = Date.now();
      state = 'asignado';

      await exec();

      const offerBD = Offer.find({ title: 'Mi nueva oferta' });
      expect(offerBD).not.toBeNull();
    });

    it('Debe retornar la oferta actualizada si es válida', async () => {
      const res = await exec();

      expect(res.body).toHaveProperty('_id');
      expect(res.body).toHaveProperty('title', 'Lorem ipsum, dolor');
    });
  });

  describe('DELETE /:id', () => {
    let token;
    let offerid;

    const exec = async () => {
      const res = await request(server)
        .delete(`/api/offers/${offerid}`)
        .set('Authorization', `Bearer ${token}`);

      return res;
    };

    beforeEach(() => {
      token = new User().generateAuthToken();
    });

    it('Debe eliminar al enviarle un identificador válido', async () => {
      const offer = new Offer({
        title: 'Titulo de oferta 1',
        address: 'Carrera 44 # 10 - 83, Manizales',
        details:
          'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Rem amet consectetur adipisicing elit. Rem Lorem ipsum, dolor sit amet consectetur adipisicing elit. Rem amet consectetur adipisicing elit. Rem Lorem ipsum, dolor sit amet consectetur adipisicing elit. Rem amet consectetur adipisicing elit. Rem',
        budget: 150000,
        author: 'dericop',
      });
      await offer.save();
      offerid = offer._id;

      const res = await exec();
      expect(res.status).toBe(200);
    });

    it('Debe retornar 404 dado un identificador inválido', async () => {
      offerid = 123;
      const res = await exec();
      expect(res.status).toBe(404);
    });
  });
});
