// import { NextFunction, Request, Response } from "express";

// export const requestLogger = (
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ) => {
//   const start = Date.now();
//   res.on("finish", () => {
//     const duration = Date.now() - start;
//     logger.http(`${req.method} ${req.originalUrl}`, {
//       status: res.statusCode,
//       duration: `${duration}ms`,
//       ip: req.ip,
//     });
//   });
//   next();
// };
