import { Request, Response, NextFunction } from "express";
type AsyncFunction = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<any>;

const asyncHandler =
  (func: AsyncFunction) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      return await func(req, res, next);
    } catch (error: any) {
      res.status(error.code || 500).json({
        success: false,
        error: error,
      });
    }
  };

export default asyncHandler;
