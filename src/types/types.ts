import * as express from "express";
import { Date } from "mongoose";

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export interface IProducts extends Document {
  product: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  image: string;
  rating: number;
  createdAt: Date;
  updatedAt: Date;
}
