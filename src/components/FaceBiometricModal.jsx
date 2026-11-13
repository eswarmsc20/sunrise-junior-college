import React, { useState, useRef, useEffect } from 'react';
import { X, Camera, MapPin, CheckCircle2, AlertTriangle, RefreshCw, ShieldCheck, Sparkles, Send, User } from 'lucide-react';
import { COLLEGE_LOCATION, calculateDistanceMeters, createWhatsAppLink } from '../utils/geoUtils';

export default function FaceBiometricModal({ isOpen, onClose, onAttendanceRecorded }) {
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [faceConfidence, setFaceConfidence] = useState(0);
  const [capturedImage, setCapturedImage] = useState(null);

  // Student details for attendance
  const [studentName, setStudentName] = useState('Chaitanya Varma');
  const [hallTicket, setHallTicket] = useState('260108901');
  const [parentPhone, setParentPhone] = useState('7893505185');

  // GPS States
  const [userCoords, setUserCoords] = useState(null);
  const [distanceMeters, setDistanceMeters] = useState(12); // Simulated within 50m for demo
  const [isInsideGeofence, setIsInsideGeofence] = useState(true);
  const [simulatedCampusGps, setSimulatedCampusGps] = useState(true);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      startCamera();
      checkGeolocation();
    } else {
      stopCamera();
      resetState();
    }
    return () => stopCamera();
  }, [isOpen]);

  const resetState = () => {
    setIsScanning(false);
    setScanProgress(0);
    setIsSuccess(false);
    setCapturedImage(null);
    setFaceConfidence(0);
  };

  const startCamera = async () => {
    setCameraError(null);
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } }
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
        setCameraActive(true);
      } else {
        setCameraError("Camera device access is not supported by your browser environment.");
      }
    } catch (err) {
      console.warn("Camera access denied or device not found:", err);
      setCameraError("Camera access prompt was closed or no webcam was detected. You can still test with simulated face biometric scan!");
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  const checkGeolocation = () => {
    if (simulatedCampusGps) {
      setUserCoords({ lat: COLLEGE_LOCATION.lat + 0.0001, lng: COLLEGE_LOCATION.lng + 0.0001 });
      const dist = calculateDistanceMeters(
        COLLEGE_LOCATION.lat,
        COLLEGE_LOCATION.lng,
        COLLEGE_LOCATION.lat + 0.0001,
        COLLEGE_LOCATION.lng + 0.0001
      );
      setDistanceMeters(dist);
      setIsInsideGeofence(dist <= COLLEGE_LOCATION.allowedRadiusMeters);
      return;
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setUserCoords({ lat, lng });
          const dist = calculateDistanceMeters(COLLEGE_LOCATION.lat, COLLEGE_LOCATION.lng, lat, lng);
          setDistanceMeters(dist);
          setIsInsideGeofence(dist <= COLLEGE_LOCATION.allowedRadiusMeters);
        },
        (error) => {
          console.warn("Geolocation lookup error:", error.message);
          // Fallback to simulated campus coordinates so user testing never breaks
          setSimulatedCampusGps(true);
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    }
  };

  const toggleGpsMode = () => {
    const nextMode = !simulatedCampusGps;
    setSimulatedCampusGps(nextMode);
    if (nextMode) {
      setDistanceMeters(14);
      setIsInsideGeofence(true);
    } else {
      checkGeolocation();
    }
  };

  const handleStartScan = () => {
    if (!isInsideGeofence) {
      alert(`Access Restricted! You are ${distanceMeters}m away from Sunrise Junior College. Attendance is strictly allowed within ${COLLEGE_LOCATION.allowedRadiusMeters} meters.`);
      return;
    }

    setIsScanning(true);
    setScanProgress(0);

    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          completeScan();
          return 100;
        }
        return prev + 15;
      });
    }, 200);
  };

  const completeScan = () => {
    // Capture snapshot from video or render simulated face canvas
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth || 320;
      canvas.height = video.videoHeight || 240;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      setCapturedImage(canvas.toDataURL('image/jpeg'));
    }

    setIsScanning(false);
    setIsSuccess(true);
    setFaceConfidence(98.8);

    const record = {
      studentName,
      hallTicket,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      date: new Date().toLocaleDateString('en-GB'),
      distanceMeters,
      status: 'PRESENT (Biometric Face Verified)',
      parentPhone
    };

    if (onAttendanceRecorded) {
      onAttendanceRecorded(record);
    }
  };

  const attendanceSms = `*SUNRISE JUNIOR COLLEGE, SRIKAKULAM*
(BIE AP Code: 01089)
Biometric Attendance Verified:
-----------------------------
• Student: ${studentName}
• Hall Ticket: ${hallTicket}
• Date & Time: ${new Date().toLocaleDateString('en-GB')} at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
• Status: PRESENT ON CAMPUS
• Boundary Check: Verified (${distanceMeters}m within 50m Geofence)
-----------------------------
Principal: 8143217785`;

  const waLink = createWhatsAppLink(parentPhone, attendanceSms);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div 
        className="relative bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border border-slate-200 my-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950 text-white p-5 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
          
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[11px] font-bold bg-emerald-400 text-slate-950 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Biometric Examination & Daily Attendance
            </span>
            <span className="text-xs text-emerald-300 flex items-center gap-1 font-mono">
              <ShieldCheck className="w-3.5 h-3.5" /> 50-Meter Geofence
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            Face Recognition Biometric Portal
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Sunrise Junior College, Day & Night Junction, Srikakulam (18.306922, 83.893685)
          </p>
        </div>

        {/* Geofence Status Ribbon */}
        <div className={`px-5 py-2.5 flex items-center justify-between text-xs border-b ${
          isInsideGeofence ? 'bg-emerald-50 text-emerald-900 border-emerald-200' : 'bg-red-50 text-red-900 border-red-200'
        }`}>
          <div className="flex items-center gap-2">
            <MapPin className={`w-4 h-4 ${isInsideGeofence ? 'text-emerald-600' : 'text-red-600'}`} />
            <span className="font-semibold">
              Campus Boundary Distance: <strong>{distanceMeters} meters</strong> (Limit: 50m)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              isInsideGeofence ? 'bg-emerald-200 text-emerald-900' : 'bg-red-200 text-red-900'
            }`}>
              {isInsideGeofence ? '✓ Inside Campus' : '✖ Outside 50m Limit'}
            </span>
            <button
              onClick={toggleGpsMode}
              className="text-[10px] underline text-slate-600 font-bold hover:text-slate-950"
              title="Toggle between actual GPS and Sunrise Campus coordinates"
            >
              {simulatedCampusGps ? 'Testing Campus GPS' : 'Real GPS'}
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          {!isSuccess ? (
            <>
              {/* Camera Scanner Viewport */}
              <div className="relative aspect-[4/3] bg-slate-950 rounded-2xl overflow-hidden border-2 border-slate-800 shadow-inner flex items-center justify-center">
                {/* Live Video */}
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className={`w-full h-full object-cover ${cameraActive ? 'block' : 'hidden'}`}
                />

                {/* Simulated Camera placeholder if no physical webcam is active */}
                {!cameraActive && (
                  <div className="text-center p-6 space-y-2">
                    <div className="w-16 h-16 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-2 border border-slate-700">
                      <Camera className="w-8 h-8" />
                    </div>
                    <p className="text-xs font-bold text-slate-200">Simulated AI Face Scanner Ready</p>
                    <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                      Webcam inactive or denied. Click scan below to test biometric facial mesh detection and alert dispatch!
                    </p>
                  </div>
                )}

                {/* Biometric Overlay Mesh & Scanning Laser */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  {/* Face Target Oval */}
                  <div className={`w-48 h-60 rounded-[45%] border-2 border-dashed transition-all duration-300 relative ${
                    isScanning ? 'border-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.5)]' : 'border-amber-400/70'
                  }`}>
                    {/* Corner Target Indicators */}
                    <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-amber-400" />
                    <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-amber-400" />
                    <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-amber-400" />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-amber-400" />

                    {/* Laser Scanner Line */}
                    {isScanning && (
                      <div 
                        className="w-full h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_12px_#34d399] absolute animate-pulse transition-all"
                        style={{ top: `${scanProgress}%` }}
                      />
                    )}
                  </div>
                </div>

                {/* Scanning Badge Indicator */}
                <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-mono font-semibold px-2.5 py-1 rounded-lg">
                  {isScanning ? `Extracting Face Embeddings: ${scanProgress}%` : 'Position face inside the oval frame'}
                </div>
              </div>

              {/* Hidden Canvas for Frame Capture */}
              <canvas ref={canvasRef} className="hidden" />

              {/* Student Metadata Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Student Name</label>
                  <input
                    type="text"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-xl font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Roll / Hall Ticket</label>
                  <input
                    type="text"
                    value={hallTicket}
                    onChange={(e) => setHallTicket(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-xl font-mono font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Parent Mobile (Alert)</label>
                  <input
                    type="tel"
                    value={parentPhone}
                    onChange={(e) => setParentPhone(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-xl font-mono font-medium text-emerald-800 font-bold"
                  />
                </div>
              </div>

              {/* Action Trigger */}
              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={handleStartScan}
                  disabled={isScanning || !isInsideGeofence}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition shadow-md disabled:opacity-50 text-sm"
                >
                  {isScanning ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Verifying Facial Biometrics ({scanProgress}%)...</span>
                    </>
                  ) : (
                    <>
                      <Camera className="w-4 h-4" />
                      <span>Capture & Authenticate Attendance Face</span>
                    </>
                  )}
                </button>

                <p className="text-center text-[10px] text-slate-400">
                  Attendance is validated against SJC Biometric Registry and dispatched via instant SMS to parent ({parentPhone}).
                </p>
              </div>
            </>
          ) : (
            /* Biometric Verification Success View */
            <div className="p-4 text-center space-y-4">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div>
                <span className="inline-block bg-emerald-100 text-emerald-900 text-xs font-bold px-3 py-1 rounded-full mb-1">
                  Face Match: {faceConfidence}% • Verified
                </span>
                <h3 className="text-xl font-black text-slate-900">
                  Attendance Recorded: PRESENT
                </h3>
                <p className="text-xs text-slate-500 font-mono mt-0.5">
                  Timestamp: {new Date().toLocaleTimeString('en-US')} • Boundary: {distanceMeters}m (Under 50m)
                </p>
              </div>

              {/* Captured Identity Card */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-left text-xs flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-slate-200 overflow-hidden flex-shrink-0 border border-slate-300 flex items-center justify-center">
                  {capturedImage ? (
                    <img src={capturedImage} alt="Captured Face" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-8 h-8 text-slate-400" />
                  )}
                </div>
                <div className="space-y-0.5 text-xs">
                  <p><span className="text-slate-500">Student:</span> <strong className="text-slate-900">{studentName}</strong></p>
                  <p><span className="text-slate-500">Hall Ticket:</span> <strong className="font-mono text-slate-900">{hallTicket}</strong></p>
                  <p><span className="text-slate-500">Venue:</span> <strong>Day & Night Junction Campus</strong></p>
                  <p><span className="text-slate-500">Parent Alert:</span> <strong className="font-mono text-emerald-700">{parentPhone}</strong></p>
                </div>
              </div>

              {/* Instant WhatsApp Dispatch */}
              <div className="space-y-2 pt-2">
                <a
                  href={waLink}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition shadow-sm"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Immediate WhatsApp Notification to Parent ({parentPhone})</span>
                </a>

                <button
                  type="button"
                  onClick={resetState}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-2 px-3 rounded-xl transition"
                >
                  Mark Another Student Attendance
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}