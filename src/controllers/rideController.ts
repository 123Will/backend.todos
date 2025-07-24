import { Request, Response } from 'express';
import axios from 'axios';
import { openDb } from '../database';
import { Driver, DRIVERS } from '../models/driver';
import { Ride } from '../models/ride';

export async function estimateRide(req: Request, res: Response) {
  const { customer_id, origin, destination } = req.body;

  // Validações
  if (!customer_id || !origin || !destination) {
    return res.status(400).json({
      error_code: 'INVALID_DATA',
      error_description: 'Campos obrigatórios em branco.'
    });
  }
  if (origin.trim() === '' || destination.trim() === '') {
    return res.status(400).json({
      error_code: 'INVALID_DATA',
      error_description: 'Endereços não podem estar em branco.'
    });
  }
  if (origin.trim() === destination.trim()) {
    return res.status(400).json({
      error_code: 'INVALID_DATA',
      error_description: 'Endereços de origem e destino não podem ser iguais.'
    });
  }

  try {
    // Geocodificar origem e destino (Mapbox Geocoding API)
    const mapboxToken = process.env.MAPBOX_API_KEY;
    if (!mapboxToken) {
      return res.status(500).json({ error_code: 'MAPBOX_KEY_MISSING', error_description: 'MAPBOX_API_KEY não configurada.' });
    }

    const geocode = async (address: string) => {
      const resp = await axios.get<any>('https://api.mapbox.com/geocoding/v5/mapbox.places/' + encodeURIComponent(address) + '.json', {
        params: { access_token: mapboxToken, limit: 1 }
      });
      if (!resp.data.features || resp.data.features.length === 0) throw new Error('Endereço não encontrado: ' + address);
      return resp.data.features[0].center; // [lng, lat]
    };

    const [originCoord, destCoord] = await Promise.all([
      geocode(origin),
      geocode(destination)
    ]);

    // Chamar Mapbox Directions API
    const directionsResp = await axios.get<any>('https://api.mapbox.com/directions/v5/mapbox/driving/' +
      `${originCoord[0]},${originCoord[1]};${destCoord[0]},${destCoord[1]}`, {
      params: {
        access_token: mapboxToken,
        geometries: 'geojson',
        overview: 'full',
        steps: false
      }
    });
    const route = directionsResp.data.routes[0];
    if (!route) throw new Error('Rota não encontrada.');

    const distanceKm = route.distance / 1000;
    const durationMin = Math.round(route.duration / 60);

    // Filtrar motoristas disponíveis
    const options = DRIVERS
      .filter(driver => distanceKm >= driver.min_km)
      .map(driver => ({
        id: driver.id,
        name: driver.name,
        description: driver.description,
        vehicle: driver.vehicle,
        review: driver.review,
        value: parseFloat((distanceKm * driver.rate_per_km).toFixed(2))
      }))
      .sort((a, b) => a.value - b.value);

    return res.status(200).json({
      origin: { latitude: originCoord[1], longitude: originCoord[0] },
      destination: { latitude: destCoord[1], longitude: destCoord[0] },
      distance: parseFloat(distanceKm.toFixed(2)),
      duration: `${durationMin} min`,
      options,
      routeResponse: route
    });
  } catch (err: any) {
    return res.status(400).json({
      error_code: 'INVALID_DATA',
      error_description: err.message || 'Erro ao calcular estimativa.'
    });
  }
}

export async function confirmRide(req: Request, res: Response) {
  const { customer_id, origin, destination, distance, duration, driver, value } = req.body;

  // Validações básicas
  if (!customer_id || !origin || !destination || !distance || !duration || !driver || !value) {
    return res.status(400).json({
      error_code: 'INVALID_DATA',
      error_description: 'Campos obrigatórios em branco.'
    });
  }
  if (origin.trim() === '' || destination.trim() === '') {
    return res.status(400).json({
      error_code: 'INVALID_DATA',
      error_description: 'Endereços não podem estar em branco.'
    });
  }
  if (origin.trim() === destination.trim()) {
    return res.status(400).json({
      error_code: 'INVALID_DATA',
      error_description: 'Endereços de origem e destino não podem ser iguais.'
    });
  }
  if (!driver.id || !driver.name) {
    return res.status(400).json({
      error_code: 'INVALID_DATA',
      error_description: 'Motorista inválido.'
    });
  }

  // Verificar se o motorista existe
  const foundDriver: Driver | undefined = DRIVERS.find(d => d.id === driver.id && d.name === driver.name);
  if (!foundDriver) {
    return res.status(404).json({
      error_code: 'DRIVER_NOT_FOUND',
      error_description: 'Motorista não encontrado.'
    });
  }

  // Verificar se a distância é válida para o motorista
  if (distance < foundDriver.min_km) {
    return res.status(406).json({
      error_code: 'INVALID_DISTANCE',
      error_description: 'Quilometragem inválida para o motorista.'
    });
  }

  // Gravar no banco
  try {
    const db = await openDb();
    const now = new Date().toISOString();
    await db.run(
      `INSERT INTO rides (customer_id, origin, destination, distance, duration, driver_id, driver_name, value, date)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [customer_id, origin, destination, distance, duration, foundDriver.id, foundDriver.name, value, now]
    );
    await db.close();
    return res.status(200).json({ success: true });
  } catch (err: any) {
    return res.status(500).json({
      error_code: 'DB_ERROR',
      error_description: err.message || 'Erro ao salvar viagem.'
    });
  }
}

export async function getRides(req: Request, res: Response) {
  const { customer_id } = req.params;
  const driver_id = req.query.driver_id ? Number(req.query.driver_id) : undefined;

  // Validação do customer_id
  if (!customer_id || customer_id.trim() === '') {
    return res.status(400).json({
      error_code: 'INVALID_DATA',
      error_description: 'ID do usuário não pode estar em branco.'
    });
  }

  // Se driver_id informado, validar
  if (driver_id !== undefined && !Number.isInteger(driver_id)) {
    return res.status(400).json({
      error_code: 'INVALID_DRIVER',
      error_description: 'ID do motorista inválido.'
    });
  }
  if (driver_id !== undefined) {
    const foundDriver = DRIVERS.find(d => d.id === driver_id);
    if (!foundDriver) {
      return res.status(400).json({
        error_code: 'INVALID_DRIVER',
        error_description: 'Motorista não encontrado.'
      });
    }
  }

  try {
    const db = await openDb();
    let query = 'SELECT * FROM rides WHERE customer_id = ?';
    const params: any[] = [customer_id];
    if (driver_id !== undefined) {
      query += ' AND driver_id = ?';
      params.push(driver_id);
    }
    query += ' ORDER BY date DESC';
    const rides = await db.all(query, params);
    await db.close();

    if (!rides || rides.length === 0) {
      return res.status(404).json({
        error_code: 'NO_RIDES_FOUND',
        error_description: 'Nenhum registro encontrado.'
      });
    }

    return res.status(200).json({
      customer_id,
      rides: rides.map((r: any) => ({
        id: r.id,
        date: r.date,
        origin: r.origin,
        destination: r.destination,
        distance: r.distance,
        duration: r.duration,
        driver: {
          id: r.driver_id,
          name: r.driver_name
        },
        value: r.value
      }))
    });
  } catch (err: any) {
    return res.status(500).json({
      error_code: 'DB_ERROR',
      error_description: err.message || 'Erro ao buscar histórico.'
    });
  }
} 