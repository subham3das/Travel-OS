import { Request, Response, NextFunction } from 'express';
import { departureService } from '../services/departure.service.js';
import { ResponseUtil } from '../utils/response.util.js';

export class DepartureController {
  public getDepartures = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const departures = await departureService.getAgencyDepartures(req.agency!._id);
      ResponseUtil.success(res, departures, 'Agency departures retrieved successfully');
    } catch (error) {
      next(error);
    }
  };

  public scheduleDeparture = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const departure = await departureService.scheduleNewDeparture(req.agency!._id, req.body);
      ResponseUtil.success(res, departure, 'New departure scheduled successfully', 201);
    } catch (error) {
      next(error);
    }
  };

  public getDepartureTravelers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = String(req.params.id);
      const data = await departureService.getDepartureTravelers(req.agency!._id, id);
      ResponseUtil.success(res, data, 'Departure travelers retrieved successfully');
    } catch (error) {
      next(error);
    }
  };

  public startDeparture = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = String(req.params.id);
      const result = await departureService.startDeparture(req.agency!._id, id);
      ResponseUtil.success(res, result, 'Trip started and moved to Ongoing');
    } catch (error) {
      next(error);
    }
  };

  public rescheduleDeparture = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = String(req.params.id);
      const { newDepartureDate } = req.body;
      const departure = await departureService.rescheduleDeparture(req.agency!._id, id, newDepartureDate);
      ResponseUtil.success(res, departure, 'Departure rescheduled successfully');
    } catch (error) {
      next(error);
    }
  };

  public closeDeparture = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = String(req.params.id);
      const status = await departureService.closeDeparture(req.agency!._id, id);
      ResponseUtil.success(res, { status }, 'Booking closed successfully');
    } catch (error) {
      next(error);
    }
  };

  public endDeparture = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = String(req.params.id);
      const status = await departureService.endDeparture(req.agency!._id, id);
      ResponseUtil.success(res, { status }, 'Trip ended and marked as completed');
    } catch (error) {
      next(error);
    }
  };

  public exportExcel = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = String(req.params.id);
      const { filename, csv } = await departureService.exportTravelersCsv(req.agency!._id, id);
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.send(csv);
    } catch (error) {
      next(error);
    }
  };

  public exportPdf = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = String(req.params.id);
      const { filename, html } = await departureService.exportTravelersPdfHtml(req.agency!._id, id);
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
      res.send(html);
    } catch (error) {
      next(error);
    }
  };

  public cancelDeparture = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = String(req.params.id);
      const result = await departureService.cancelDeparture(req.agency!._id, id);
      ResponseUtil.success(res, result, 'Departure cancelled successfully');
    } catch (error) {
      next(error);
    }
  };

  public updateDeparture = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = String(req.params.id);
      const departure = await departureService.updateDeparture(req.agency!._id, id, req.body);
      ResponseUtil.success(res, departure, 'Departure updated successfully');
    } catch (error) {
      next(error);
    }
  };
}

export const departureController = new DepartureController();
