import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { CheckCircle2, Calendar, MapPin, Download, ArrowRight, Home } from 'lucide-react';
import { BrandLogo } from '../../../common/brand';
import { bookingService } from '../../services/booking.service';
import { useToast } from '../../context/ToastContext';

export const BookingSuccessPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();
  const { bookingId } = useParams<{ bookingId?: string }>();

  const stateData = location.state || {};
  const displayBookingId = bookingId || stateData.bookingId || '';
  const [liveBooking, setLiveBooking] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(Boolean(displayBookingId));

  useEffect(() => {
    if (displayBookingId) {
      bookingService.getBookingById(displayBookingId).then((res) => {
        if (res) setLiveBooking(res);
      }).catch((err) => {
        console.warn('Could not fetch live booking:', err);
      }).finally(() => {
        setIsLoading(false);
      });
    } else {
      setIsLoading(false);
    }
  }, [displayBookingId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8F9FC] text-[#0F172A] flex flex-col items-center justify-center p-4 font-sans">
        <div className="w-12 h-12 border-4 border-[#6356E5]/20 border-t-[#6356E5] rounded-full animate-spin" />
      </div>
    );
  }

  if (!displayBookingId || (!liveBooking && !stateData.pkg)) {
    return (
      <div className="min-h-screen bg-[#F8F9FC] text-[#0F172A] flex flex-col items-center justify-center p-4 font-sans">
        <div className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-md border border-slate-100 shadow-xl text-center space-y-5">
          <h2 className="text-xl font-bold text-slate-800">No Booking Found</h2>
          <p className="text-sm text-slate-500">No active booking confirmation details were found.</p>
          <button onClick={() => navigate('/home')} className="px-5 py-2.5 rounded-xl bg-[#6356E5] text-white text-xs font-bold cursor-pointer">
            Return Home
          </button>
        </div>
      </div>
    );
  }

  const paymentId = stateData.paymentId || liveBooking?.transactionId || '';
  const invoiceNumber = stateData.invoiceNumber || liveBooking?.documents?.find((d: any) => d.id?.startsWith('INV'))?.id || `INV-${displayBookingId}`;
  const travelersCount = liveBooking?.travelersCount || (stateData.travelerData?.additionalTravelers?.length ? stateData.travelerData.additionalTravelers.length + 1 : 1);
  const departureDate = liveBooking?.tripStartDate 
    ? new Date(liveBooking.tripStartDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) 
    : 'Upcoming Scheduled Departure';

  const pkg = liveBooking ? {
    title: liveBooking.packageName || '',
    agencyName: liveBooking.agencyName || '',
    coverImage: liveBooking.packageThumbnail || '',
    duration: liveBooking.durationText || '',
  } : stateData.pkg;
  const totalAmount = liveBooking?.totalAmount || liveBooking?.paidAmount || stateData.totalAmount || 0;

  const handleDownloadInvoice = () => {
    // Open clean printable invoice preview in new window
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      showToast('Pop-up blocked! Please allow pop-ups to view and download your invoice.', 'info');
      return;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>ApnaTrip Tax Invoice - ${invoiceNumber}</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 40px; color: #1e293b; }
          .header { display: flex; justify-content: space-between; border-bottom: 2px solid #e2e8f0; padding-bottom: 20px; }
          .logo { font-size: 26px; font-weight: 900; color: #2563EB; }
          .badge { display: inline-block; padding: 4px 12px; background: #ecfdf5; color: #059669; border-radius: 999px; font-weight: 700; font-size: 12px; }
          .details { margin: 24px 0; display: grid; grid-template-columns: 1fr 1fr; gap: 20px; font-size: 13px; }
          .table { width: 100%; border-collapse: collapse; margin-top: 24px; font-size: 13px; }
          .table th { background: #f8fafc; text-align: left; padding: 12px; border-bottom: 1px solid #cbd5e1; }
          .table td { padding: 12px; border-bottom: 1px solid #e2e8f0; }
          .total-box { margin-top: 24px; text-align: right; font-size: 16px; font-weight: 800; color: #0f172a; }
          .footer { margin-top: 40px; border-top: 1px solid #f1f5f9; padding-top: 16px; font-size: 11px; color: #94a3b8; text-align: center; }
          @media print { .no-print { display: none; } }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <img src="/logo/logo-light.png" alt="ApnaTrip" style="height: 34px; width: auto; object-fit: contain; margin-bottom: 4px; display: block;" />
            <p style="font-size: 12px; color: #64748b; margin: 4px 0;">Official Tax Invoice & Payment Receipt</p>
          </div>
          <div style="text-align: right;">
            <div class="badge">PAID IN FULL</div>
            <div style="font-size: 12px; color: #64748b; margin-top: 6px;">Invoice: <strong>${invoiceNumber}</strong></div>
            <div style="font-size: 12px; color: #64748b;">Date: ${new Date().toLocaleDateString('en-IN')}</div>
          </div>
        </div>

        <div class="details">
          <div>
            <strong>Billed To:</strong><br>
            ${liveBooking?.customerName || stateData.travelerData?.leadTraveler?.fullName || 'Valued Traveler'}<br>
            ${liveBooking?.customerEmail || stateData.travelerData?.leadTraveler?.email || ''}<br>
            ${liveBooking?.customerPhone || stateData.travelerData?.leadTraveler?.phone || ''}
          </div>
          <div style="text-align: right;">
            <strong>Booking Reference:</strong> ${displayBookingId}<br>
            <strong>Payment ID (Razorpay):</strong> ${paymentId}<br>
            <strong>Departure Date:</strong> ${departureDate}
          </div>
        </div>

        <table class="table">
          <thead>
            <tr>
              <th>Description</th>
              <th>Travelers</th>
              <th>Payment Gateway</th>
              <th style="text-align: right;">Amount (INR)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>${pkg?.title || 'Tour Package'}</strong><br><small style="color: #64748b;">Organized by ${pkg?.agencyName || 'Partner Agency'}</small></td>
              <td>${travelersCount} Person(s)</td>
              <td>Razorpay (Verified)</td>
              <td style="text-align: right;">₹${totalAmount.toLocaleString('en-IN')}</td>
            </tr>
          </tbody>
        </table>

        <div class="total-box">
          Total Paid: ₹${totalAmount.toLocaleString('en-IN')}
        </div>

        <div class="no-print" style="margin-top: 30px; text-align: center;">
          <button onclick="window.print()" style="background: #2563EB; color: white; border: none; padding: 10px 24px; border-radius: 8px; font-weight: 700; cursor: pointer;">
            Print / Save as PDF
          </button>
        </div>

        <div class="footer">
          This is a computer-generated tax invoice verified cryptographically by Razorpay & ApnaTrip.
        </div>
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  return (
    <div className="min-h-screen bg-[#F8F9FC] text-[#0F172A] flex flex-col items-center justify-center p-4 font-sans">
      <div className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-md border border-slate-100 shadow-xl text-center space-y-5 animate-in fade-in zoom-in-95">
        <BrandLogo className="h-8 w-auto mx-auto mb-1" alt="ApnaTrip" />
        <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 className="w-12 h-12 stroke-[2.5]" />
        </div>

        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight">
            Booking Successful! 🎉
          </h1>
          <p className="text-xs font-bold text-slate-400">
            Booking ID: <span className="text-[#2563EB] font-extrabold">{displayBookingId}</span>
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-left space-y-3">
          <div className="flex items-center gap-3">
            <img
              src={pkg?.coverImage || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=400&q=80'}
              alt={pkg?.title}
              className="w-14 h-14 rounded-xl object-cover shrink-0"
            />
            <div>
              <h3 className="text-xs sm:text-sm font-extrabold text-[#0F172A] line-clamp-1">{pkg?.title}</h3>
              <p className="text-[11px] font-semibold text-slate-500">by {pkg?.agencyName || 'ApnaTrip Partner'}</p>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200/60 space-y-1.5 text-xs font-semibold text-slate-600">
            <div className="flex justify-between">
              <span>Departure Date:</span>
              <span className="font-extrabold text-[#0F172A]">{departureDate}</span>
            </div>
            <div className="flex justify-between">
              <span>Traveler Count:</span>
              <span className="font-extrabold text-[#0F172A]">{travelersCount} Person(s)</span>
            </div>
            <div className="flex justify-between">
              <span>Payment ID:</span>
              <span className="font-extrabold text-slate-700 font-mono text-[11px]">{paymentId}</span>
            </div>
            <div className="flex justify-between">
              <span>Payment Status:</span>
              <span className="font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full text-[10px] border border-emerald-200">
                ✓ Verified & Paid
              </span>
            </div>
            <div className="flex justify-between items-center pt-1 border-t border-slate-200/40 text-sm font-black text-[#0F172A]">
              <span>Total Paid:</span>
              <span className="text-[#2563EB]">₹{totalAmount.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        {/* Invoice Download Action */}
        <button
          type="button"
          onClick={handleDownloadInvoice}
          className="w-full py-2.5 px-4 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#2563EB] font-bold text-xs border border-blue-200/60 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download Tax Invoice & Receipt</span>
        </button>

        <div className="space-y-2.5 pt-1">
          <button
            onClick={() => navigate('/my-trips')}
            className="w-full py-3.5 px-4 rounded-2xl bg-[#2563EB] hover:bg-[#1d4ed8] text-white font-extrabold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Go to My Trips</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => navigate('/packages')}
            className="w-full py-3 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>Continue Exploring</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccessPage;
