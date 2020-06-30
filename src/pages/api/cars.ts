import { NextApiRequest, NextApiResponse } from "next";
import { getModels } from "../../database/getModels";
import { getAsString } from "../../getAsString";
import { getPaginatedCars } from "../../database/getPaginatedCars";

export default async function cars(req: NextApiRequest, res: NextApiResponse) {
  const cars = await getPaginatedCars(req.query);
  res.json(cars);
}
