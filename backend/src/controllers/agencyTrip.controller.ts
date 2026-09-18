import { Request, Response } from 'express';
import { AgencyTripService } from '../services/agencyTrip.service.js';
import { ResponseUtil } from '../utils/response.util.js';

export class AgencyTripController {
  static async getTrips(req: Request, res: Response) {
    try {
      const agencyId = (req as any).agency?._id || (req as any).user?.agencyId;
      if (!agencyId) {
        return ResponseUtil.error(res, 'Agency context missing', 401);
      }

      const result = await AgencyTripService.getAgencyTrips(agencyId.toString(), req.query as any);
      return ResponseUtil.success(res, result, 'Trips fetched successfully');
    } catch (error: any) {
      console.error('[AgencyTripController.getTrips] Error:', error);
      return ResponseUtil.error(res, error.message || 'Failed to fetch trips', 500);
    }
  }

  static async getTripById(req: Request, res: Response) {
    try {
      const agencyId = (req as any).agency?._id || (req as any).user?.agencyId;
      if (!agencyId) {
        return ResponseUtil.error(res, 'Agency context missing', 401);
      }

      const trip = await AgencyTripService.getAgencyTripById(agencyId.toString(), String(req.params.id));
      return ResponseUtil.success(res, trip, 'Trip details fetched successfully');
    } catch (error: any) {
      console.error('[AgencyTripController.getTripById] Error:', error);
      return ResponseUtil.error(res, error.message || 'Failed to fetch trip details', 404);
    }
  }

  static async updateTripTeam(req: Request, res: Response) {
    try {
      const agencyId = (req as any).agency?._id || (req as any).user?.agencyId;
      if (!agencyId) {
        return ResponseUtil.error(res, 'Agency context missing', 401);
      }

      const updated = await AgencyTripService.updateTripTeam(agencyId.toString(), String(req.params.id), req.body.teamAssignments || req.body);
      return ResponseUtil.success(res, updated, 'Team assignments updated successfully');
    } catch (error: any) {
      console.error('[AgencyTripController.updateTripTeam] Error:', error);
      return ResponseUtil.error(res, error.message || 'Failed to update team', 500);
    }
  }

  static async updateTripVehicle(req: Request, res: Response) {
    try {
      const agencyId = (req as any).agency?._id || (req as any).user?.agencyId;
      if (!agencyId) {
        return ResponseUtil.error(res, 'Agency context missing', 401);
      }

      const updated = await AgencyTripService.updateTripVehicle(agencyId.toString(), String(req.params.id), req.body.vehicleAssignments || req.body);
      return ResponseUtil.success(res, updated, 'Vehicle assignments updated successfully');
    } catch (error: any) {
      console.error('[AgencyTripController.updateTripVehicle] Error:', error);
      return ResponseUtil.error(res, error.message || 'Failed to update vehicle', 500);
    }
  }

  static async updateTripHotel(req: Request, res: Response) {
    try {
      const agencyId = (req as any).agency?._id || (req as any).user?.agencyId;
      if (!agencyId) {
        return ResponseUtil.error(res, 'Agency context missing', 401);
      }

      const updated = await AgencyTripService.updateTripHotel(agencyId.toString(), String(req.params.id), req.body.hotelInformation || req.body);
      return ResponseUtil.success(res, updated, 'Hotel information updated successfully');
    } catch (error: any) {
      console.error('[AgencyTripController.updateTripHotel] Error:', error);
      return ResponseUtil.error(res, error.message || 'Failed to update hotel info', 500);
    }
  }

  static async updateTripEmergency(req: Request, res: Response) {
    try {
      const agencyId = (req as any).agency?._id || (req as any).user?.agencyId;
      if (!agencyId) {
        return ResponseUtil.error(res, 'Agency context missing', 401);
      }

      const updated = await AgencyTripService.updateTripEmergency(agencyId.toString(), String(req.params.id), req.body.emergencyInformation || req.body);
      return ResponseUtil.success(res, updated, 'Emergency information updated successfully');
    } catch (error: any) {
      console.error('[AgencyTripController.updateTripEmergency] Error:', error);
      return ResponseUtil.error(res, error.message || 'Failed to update emergency info', 500);
    }
  }

  static async updateTripStatus(req: Request, res: Response) {
    try {
      const agencyId = (req as any).agency?._id || (req as any).user?.agencyId;
      if (!agencyId) {
        return ResponseUtil.error(res, 'Agency context missing', 401);
      }

      const updated = await AgencyTripService.updateTripStatus(agencyId.toString(), String(req.params.id), req.body.status);
      return ResponseUtil.success(res, updated, 'Trip status updated successfully');
    } catch (error: any) {
      console.error('[AgencyTripController.updateTripStatus] Error:', error);
      return ResponseUtil.error(res, error.message || 'Failed to update status', 500);
    }
  }

  static async updateTravelerAttendance(req: Request, res: Response) {
    try {
      const agencyId = (req as any).agency?._id || (req as any).user?.agencyId;
      if (!agencyId) {
        return ResponseUtil.error(res, 'Agency context missing', 401);
      }

      const updated = await AgencyTripService.updateTravelerAttendance(
        agencyId.toString(),
        String(req.params.id),
        String(req.params.travelerId),
        req.body.checkInStatus || 'Checked In'
      );
      return ResponseUtil.success(res, updated, 'Traveler attendance updated successfully');
    } catch (error: any) {
      console.error('[AgencyTripController.updateTravelerAttendance] Error:', error);
      return ResponseUtil.error(res, error.message || 'Failed to update attendance', 500);
    }
  }

  static async checkInAllTravelers(req: Request, res: Response) {
    try {
      const agencyId = (req as any).agency?._id || (req as any).user?.agencyId;
      if (!agencyId) {
        return ResponseUtil.error(res, 'Agency context missing', 401);
      }

      const updated = await AgencyTripService.checkInAllTravelers(agencyId.toString(), String(req.params.id));
      return ResponseUtil.success(res, updated, 'All travelers checked in successfully');
    } catch (error: any) {
      console.error('[AgencyTripController.checkInAllTravelers] Error:', error);
      return ResponseUtil.error(res, error.message || 'Failed to check in travelers', 500);
    }
  }

  static async createAnnouncement(req: Request, res: Response) {
    try {
      const agencyId = (req as any).agency?._id || (req as any).user?.agencyId;
      if (!agencyId) {
        return ResponseUtil.error(res, 'Agency context missing', 401);
      }

      const announcement = await AgencyTripService.createTripAnnouncement(agencyId.toString(), String(req.params.id), req.body);
      return ResponseUtil.success(res, announcement, 'Announcement published successfully', 201);
    } catch (error: any) {
      console.error('[AgencyTripController.createAnnouncement] Error:', error);
      return ResponseUtil.error(res, error.message || 'Failed to publish announcement', 500);
    }
  }

  static async addIncident(req: Request, res: Response) {
    try {
      const agencyId = (req as any).agency?._id || (req as any).user?.agencyId;
      if (!agencyId) {
        return ResponseUtil.error(res, 'Agency context missing', 401);
      }

      const incident = await AgencyTripService.addTripIncident(agencyId.toString(), String(req.params.id), req.body);
      return ResponseUtil.success(res, incident, 'Incident recorded successfully', 201);
    } catch (error: any) {
      console.error('[AgencyTripController.addIncident] Error:', error);
      return ResponseUtil.error(res, error.message || 'Failed to record incident', 500);
    }
  }

  static async toggleResolveIncident(req: Request, res: Response) {
    try {
      const agencyId = (req as any).agency?._id || (req as any).user?.agencyId;
      if (!agencyId) {
        return ResponseUtil.error(res, 'Agency context missing', 401);
      }

      const incidents = await AgencyTripService.toggleResolveIncident(agencyId.toString(), String(req.params.id), String(req.params.incidentId));
      return ResponseUtil.success(res, incidents, 'Incident status updated successfully');
    } catch (error: any) {
      console.error('[AgencyTripController.toggleResolveIncident] Error:', error);
      return ResponseUtil.error(res, error.message || 'Failed to update incident', 500);
    }
  }

  static async addNote(req: Request, res: Response) {
    try {
      const agencyId = (req as any).agency?._id || (req as any).user?.agencyId;
      if (!agencyId) {
        return ResponseUtil.error(res, 'Agency context missing', 401);
      }

      const note = await AgencyTripService.addTripNote(agencyId.toString(), String(req.params.id), req.body);
      return ResponseUtil.success(res, note, 'Note added successfully', 201);
    } catch (error: any) {
      console.error('[AgencyTripController.addNote] Error:', error);
      return ResponseUtil.error(res, error.message || 'Failed to add note', 500);
    }
  }

  static async addPhoto(req: Request, res: Response) {
    try {
      const agencyId = (req as any).agency?._id || (req as any).user?.agencyId;
      if (!agencyId) {
        return ResponseUtil.error(res, 'Agency context missing', 401);
      }

      const photo = await AgencyTripService.addTripPhoto(agencyId.toString(), String(req.params.id), req.body);
      return ResponseUtil.success(res, photo, 'Photo added successfully', 201);
    } catch (error: any) {
      console.error('[AgencyTripController.addPhoto] Error:', error);
      return ResponseUtil.error(res, error.message || 'Failed to add photo', 500);
    }
  }

  static async updateTimelineDayStatus(req: Request, res: Response) {
    try {
      const agencyId = (req as any).agency?._id || (req as any).user?.agencyId;
      if (!agencyId) {
        return ResponseUtil.error(res, 'Agency context missing', 401);
      }

      const days = await AgencyTripService.updateTimelineDayStatus(
        agencyId.toString(),
        String(req.params.id),
        Number(req.params.dayNumber),
        req.body.status
      );
      return ResponseUtil.success(res, days, 'Timeline day status updated successfully');
    } catch (error: any) {
      console.error('[AgencyTripController.updateTimelineDayStatus] Error:', error);
      return ResponseUtil.error(res, error.message || 'Failed to update timeline day', 500);
    }
  }
}
