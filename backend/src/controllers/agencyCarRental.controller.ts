import { Request, Response } from 'express';
import { agencyCarRentalService } from '../services/agencyCarRental.service.js';
import { ResponseUtil } from '../utils/response.util.js';
import { HTTP_STATUS } from '../constants/http.constant.js';
import { asyncHandler } from '../utils/asyncHandler.util.js';

export class AgencyCarRentalController {
  public onboard = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const result = await agencyCarRentalService.onboardStandaloneCarRentalPartner(req.body);
    ResponseUtil.success(
      res,
      result,
      'Car rental partner registered successfully. Application submitted for verification.',
      HTTP_STATUS.CREATED
    );
  });

  public register = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const agencyId = (req as any).agency?._id;
    const agency = await agencyCarRentalService.registerCarRental(String(agencyId), req.body);
    ResponseUtil.success(
      res,
      {
        agencyId: agency._id,
        carRentalVerificationStatus: agency.carRentalVerificationStatus,
        carRentalProfile: agency.carRentalProfile,
      },
      'Car rental business profile registered successfully. Verification request submitted to Admin.',
      HTTP_STATUS.CREATED
    );
  });

  public getProfile = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const agencyId = (req as any).agency?._id;
    const profile = await agencyCarRentalService.getCarRentalProfile(String(agencyId));
    ResponseUtil.success(res, profile, 'Car rental profile retrieved successfully.');
  });

  public updateProfile = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const agencyId = (req as any).agency?._id;
    const updated = await agencyCarRentalService.updateCarRentalProfile(String(agencyId), req.body);
    ResponseUtil.success(res, { profile: updated }, 'Car rental profile updated successfully.');
  });

  public switchBusiness = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const agencyId = (req as any).agency?._id;
    const { business } = req.body;
    const result = await agencyCarRentalService.switchActiveBusiness(String(agencyId), business);
    ResponseUtil.success(res, result, `Switched active business to ${business}.`);
  });

  public getDashboardStats = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const agencyId = (req as any).agency?._id;
    const stats = await agencyCarRentalService.getDashboardStats(String(agencyId));
    ResponseUtil.success(res, stats, 'Car rental dashboard telemetry retrieved successfully.');
  });

  public getCalendar = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const agencyId = (req as any).agency?._id;
    const schedule = await agencyCarRentalService.getCalendarSchedule(String(agencyId));
    ResponseUtil.success(res, schedule, 'Car rental calendar schedule retrieved successfully.');
  });

  public getDrivers = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const agencyId = (req as any).agency?._id;
    const drivers = await agencyCarRentalService.getDrivers(String(agencyId));
    ResponseUtil.success(res, { drivers }, 'Car rental drivers retrieved successfully.');
  });

  public createDriver = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const agencyId = (req as any).agency?._id;
    const driver = await agencyCarRentalService.createDriver(String(agencyId), req.body);
    ResponseUtil.success(res, driver, 'Driver profile created successfully.', HTTP_STATUS.CREATED);
  });

  public updateDriver = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const agencyId = (req as any).agency?._id;
    const driverId = req.params.id as string;
    const driver = await agencyCarRentalService.updateDriver(String(agencyId), driverId, req.body);
    ResponseUtil.success(res, driver, 'Driver profile updated successfully.');
  });

  public getVehicles = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const agencyId = (req as any).agency?._id;
    const cars = await agencyCarRentalService.getVehicles(String(agencyId), req.query);
    ResponseUtil.success(res, { cars }, 'Fleet vehicles retrieved successfully.');
  });

  public getVehicleById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const agencyId = (req as any).agency?._id;
    const carId = req.params.id as string;
    const car = await agencyCarRentalService.getVehicleById(String(agencyId), carId);
    ResponseUtil.success(res, car, 'Vehicle details dossier retrieved successfully.');
  });

  public createVehicle = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const agencyId = (req as any).agency?._id;
    const car = await agencyCarRentalService.createVehicle(String(agencyId), req.body);
    ResponseUtil.success(res, car, 'Vehicle registered to fleet successfully.', HTTP_STATUS.CREATED);
  });

  public updateVehicle = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const agencyId = (req as any).agency?._id;
    const carId = req.params.id as string;
    const car = await agencyCarRentalService.updateVehicle(String(agencyId), carId, req.body);
    ResponseUtil.success(res, car, 'Vehicle updated successfully.');
  });

  public deleteVehicle = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const agencyId = (req as any).agency?._id;
    const carId = req.params.id as string;
    const result = await agencyCarRentalService.deleteVehicle(String(agencyId), carId);
    ResponseUtil.success(res, result, 'Vehicle removed from fleet successfully.');
  });

  public getVehicleRoutes = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const agencyId = (req as any).agency?._id;
    const carId = req.params.id as string;
    const routes = await agencyCarRentalService.getVehicleRoutes(String(agencyId), carId);
    ResponseUtil.success(res, { routes }, 'Vehicle routes retrieved successfully.');
  });

  public addVehicleRoute = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const agencyId = (req as any).agency?._id;
    const carId = req.params.id as string;
    const result = await agencyCarRentalService.addVehicleRoute(String(agencyId), carId, req.body);
    ResponseUtil.success(res, result, 'Route added successfully.', HTTP_STATUS.CREATED);
  });

  public updateVehicleRoute = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const agencyId = (req as any).agency?._id;
    const carId = req.params.id as string;
    const routeId = req.params.routeId as string;
    const result = await agencyCarRentalService.updateVehicleRoute(String(agencyId), carId, routeId, req.body);
    ResponseUtil.success(res, result, 'Route updated successfully.');
  });

  public deleteVehicleRoute = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const agencyId = (req as any).agency?._id;
    const carId = req.params.id as string;
    const routeId = req.params.routeId as string;
    const result = await agencyCarRentalService.deleteVehicleRoute(String(agencyId), carId, routeId);
    ResponseUtil.success(res, result, 'Route deleted successfully.');
  });

  public toggleVehicleRouteStatus = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const agencyId = (req as any).agency?._id;
    const carId = req.params.id as string;
    const routeId = req.params.routeId as string;
    const result = await agencyCarRentalService.toggleVehicleRouteStatus(String(agencyId), carId, routeId);
    ResponseUtil.success(res, result, `Route status updated to ${result.status}.`);
  });

  public duplicateVehicleRoute = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const agencyId = (req as any).agency?._id;
    const carId = req.params.id as string;
    const routeId = req.params.routeId as string;
    const result = await agencyCarRentalService.duplicateVehicleRoute(String(agencyId), carId, routeId, req.body);
    ResponseUtil.success(res, result, 'Route duplicated successfully.', HTTP_STATUS.CREATED);
  });

  public getFleetOverview = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const agencyId = (req as any).agency?._id;
    const overview = await agencyCarRentalService.getFleetOverview(String(agencyId));
    ResponseUtil.success(res, overview, 'Fleet breakdown overview retrieved successfully.');
  });

  public getBookings = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const agencyId = (req as any).agency?._id;
    const status = req.query.status as string;
    const bookings = await agencyCarRentalService.getBookings(String(agencyId), status);
    ResponseUtil.success(res, { bookings }, 'Rental bookings retrieved successfully.');
  });

  public updateBookingStatus = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const agencyId = (req as any).agency?._id;
    const bookingId = req.params.id as string;
    const { status, rejectionReason } = req.body;
    const booking = await agencyCarRentalService.updateBookingStatus(String(agencyId), bookingId, status, rejectionReason);
    ResponseUtil.success(res, booking, `Booking status updated to ${status}.`);
  });

  public assignDriver = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const agencyId = (req as any).agency?._id;
    const bookingId = req.params.id as string;
    const { driverId, vehicleNumber, vehicleModel } = req.body;
    const booking = await agencyCarRentalService.assignDriverAndConfirmBooking(
      String(agencyId),
      bookingId,
      driverId,
      vehicleNumber,
      vehicleModel
    );
    ResponseUtil.success(res, booking, 'Driver assigned and booking updated successfully.');
  });

  public getCustomers = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const agencyId = (req as any).agency?._id;
    const customers = await agencyCarRentalService.getCustomers(String(agencyId));
    ResponseUtil.success(res, { customers }, 'Rental customers CRM directory retrieved successfully.');
  });

  public getAnalytics = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const agencyId = (req as any).agency?._id;
    const analytics = await agencyCarRentalService.getAnalytics(String(agencyId));
    ResponseUtil.success(res, analytics, 'Car rental business analytics retrieved successfully.');
  });

  public getReviews = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const agencyId = (req as any).agency?._id;
    const data = await agencyCarRentalService.getReviews(String(agencyId));
    ResponseUtil.success(res, data, 'Fleet customer reviews retrieved successfully.');
  });
}

export const agencyCarRentalController = new AgencyCarRentalController();
