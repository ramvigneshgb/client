import React, { useEffect, useRef, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection';
import './CameraMonitor.css';

// This helper function calculates where the pupil is within the eye
const getGazeRatio = (eyePoints, pupilPoint) => {
    if (!eyePoints || eyePoints.length < 9 || !pupilPoint) return 0.5; // Safety check
    const eyeLeft = eyePoints[0];
    const eyeRight = eyePoints[8];
    const eyeWidth = eyeRight.x - eyeLeft.x;
    if (eyeWidth === 0) return 0.5;
    const pupilRelativeX = pupilPoint.x - eyeLeft.x;
    return pupilRelativeX / eyeWidth;
};

const CameraMonitor = ({ onAlert }) => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [model, setModel] = useState(null);
    const [isCameraOn, setIsCameraOn] = useState(false);
    
    const distractionTimer = useRef(null);
    const alertSent = useRef(false);

    // 1. Load the advanced AI model with iris tracking enabled
    useEffect(() => {
        const loadModel = async () => {
            await tf.setBackend('webgl');
            const detector = await faceLandmarksDetection.createDetector(
                faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh,
                {
                    runtime: 'tfjs',
                    refineLandmarks: true, // This is the key that enables iris tracking!
                }
            );
            setModel(detector);
            console.log("Definitive AI model loaded.");
        };
        loadModel();
    }, []);
    
    // 2. Start the camera stream
    const startVideo = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (err) {
            console.error("ERROR starting camera:", err);
        }
    };
    
    // 3. When the video is ready, start the detection loop
    const handleVideoReady = () => {
        setIsCameraOn(true);
        if (canvasRef.current && videoRef.current) {
            canvasRef.current.width = videoRef.current.videoWidth;
            canvasRef.current.height = videoRef.current.videoHeight;
        }
        setInterval(() => {
            detect(model);
        }, 200); // Check every 200ms for smooth tracking
    };

    // 4. The complete detection logic
    const detect = async (detector) => {
        if (!detector || !videoRef.current || videoRef.current.readyState < 3) return;

        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const faces = await detector.estimateFaces(video, { flipHorizontal: false });
        let isLookingAway = true;

        if (faces.length > 0) {
            const keypoints = faces[0].keypoints;
            const leftEyeContour = keypoints.filter(p => p.name && p.name.startsWith('leftEyeContour'));
            const rightEyeContour = keypoints.filter(p => p.name && p.name.startsWith('rightEyeContour'));
            const leftIris = keypoints.filter(p => p.name && p.name.startsWith('leftIris'));
            const rightIris = keypoints.filter(p => p.name && p.name.startsWith('rightIris'));

            if (leftIris.length >= 5 && rightIris.length >= 5) {
                const leftGaze = getGazeRatio(leftEyeContour, leftIris[4]);
                const rightGaze = getGazeRatio(rightEyeContour, rightIris[4]);
                
                const GAZE_THRESHOLD_RIGHT = 0.75;
                const GAZE_THRESHOLD_LEFT = 0.25;

                if (leftGaze > GAZE_THRESHOLD_RIGHT || leftGaze < GAZE_THRESHOLD_LEFT || rightGaze > GAZE_THRESHOLD_RIGHT || rightGaze < GAZE_THRESHOLD_LEFT) {
                    isLookingAway = true;
                } else {
                    isLookingAway = false;
                }

                // --- Visual Debugger ---
                ctx.strokeStyle = 'lime';
                ctx.lineWidth = 1;
                ctx.beginPath();
                leftEyeContour.forEach(p => ctx.lineTo(p.x, p.y));
                ctx.closePath();
                ctx.stroke();
                ctx.beginPath();
                rightEyeContour.forEach(p => ctx.lineTo(p.x, p.y));
                ctx.closePath();
                ctx.stroke();

                ctx.fillStyle = '#00BFFF';
                ctx.beginPath();
                ctx.arc(leftIris[4].x, leftIris[4].y, 3, 0, 2 * Math.PI);
                ctx.fill();
                ctx.beginPath();
                ctx.arc(rightIris[4].x, rightIris[4].y, 3, 0, 2 * Math.PI);
                ctx.fill();
            }
        }

        // --- Final Timer Logic ---
        if (isLookingAway) {
            if (!distractionTimer.current) {
                distractionTimer.current = setTimeout(() => {
                    if (!alertSent.current) {
                        onAlert('distracted');
                        alertSent.current = true;
                    }
                }, 2000);
            }
        } else {
            if (distractionTimer.current) {
                clearTimeout(distractionTimer.current);
                distractionTimer.current = null;
            }
            alertSent.current = false;
        }
    };
    
    return (
        <div className="camera-monitor">
            <h3>Attention Monitor</h3>
            <div className="video-container">
                <video
                    ref={videoRef}
                    onCanPlay={handleVideoReady}
                    autoPlay
                    playsInline
                    muted
                    className="camera-feed"
                />
                <canvas ref={canvasRef} className="debugger-canvas" />
                {!isCameraOn && (
                    <button onClick={startVideo} className="start-button">
                        Start Camera
                    </button>
                )}
            </div>
        </div>
    );
};

export default CameraMonitor;