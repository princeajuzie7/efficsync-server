import express, { Express, Request, Response, NextFunction } from "express";
import httpStatus from "http-status";

import passport from "passport";


/**
 * Returns the currently authenticated user.
 * @param req - The Express request object.
 * @param res - The Express response object.
 * @returns The currently authenticated user, or an error response.
 */
function ShowCurrentUser(req: Request, res: Response) {
  return res.status(httpStatus.OK).json({ user: req.user });
}
export {

  ShowCurrentUser,
};
