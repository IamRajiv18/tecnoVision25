  const registrationBtn = document.getElementById('registrationBtn');
        const approvalBtn = document.getElementById('approvalBtn');
        const registrationContent = document.getElementById('registrationContent');
        const approvalContent = document.getElementById('approvalContent');
        const scanQrRegBtn = document.getElementById('scanQrRegBtn');
        const scanQrApprovalBtn = document.getElementById('scanQrApprovalBtn');
        const qrReaderReg = document.getElementById('qr-reader-reg');
        const qrReaderApproval = document.getElementById('qr-reader-approval');
        const uidInput = document.getElementById('uid');
        const attendanceUidInput = document.getElementById('attendanceUid');
        const enrollmentNumberInput = document.getElementById('enrollmentNumber');
        const registerBtn = document.getElementById('registerBtn');
        const markAttendanceBtn = document.getElementById('markAttendanceBtn');
        const regStatusMessage = document.getElementById('regStatusMessage');
        const approvalStatusMessage = document.getElementById('approvalStatusMessage');
        
        // Variables for QR Scanner
        let html5QrCodeRegScanner = null;
        let html5QrCodeApprovalScanner = null;
        
        // Switch between registration and approval modes
        registrationBtn.addEventListener('click', () => {
            registrationBtn.classList.add('active');
            approvalBtn.classList.remove('active');
            registrationContent.classList.remove('hidden');
            approvalContent.classList.add('hidden');
            stopQrScanners();
        });
        
        approvalBtn.addEventListener('click', () => {
            approvalBtn.classList.add('active');
            registrationBtn.classList.remove('active');
            approvalContent.classList.remove('hidden');
            registrationContent.classList.add('hidden');
            stopQrScanners();
        });
        
        // Function to stop QR scanners
        function stopQrScanners() {
            if (html5QrCodeRegScanner && html5QrCodeRegScanner.isScanning) {
                html5QrCodeRegScanner.stop();
                qrReaderReg.classList.add('hidden');
            }
            
            if (html5QrCodeApprovalScanner && html5QrCodeApprovalScanner.isScanning) {
                html5QrCodeApprovalScanner.stop();
                qrReaderApproval.classList.add('hidden');
            }
        }
        
        // Start QR Scanner for Registration
        scanQrRegBtn.addEventListener('click', () => {
            qrReaderReg.classList.remove('hidden');
            scanQrRegBtn.classList.add('hidden');
            
            html5QrCodeRegScanner = new Html5Qrcode("qr-reader-reg");
            const config = { fps: 10, qrbox: { width: 250, height: 250 } };
            
            html5QrCodeRegScanner.start(
                { facingMode: "environment" }, 
                config, 
                (decodedText) => {
                    // On successful scan
                    uidInput.value = decodedText;
                    html5QrCodeRegScanner.stop();
                    qrReaderReg.classList.add('hidden');
                    scanQrRegBtn.classList.remove('hidden');
                    showStatusMessage(regStatusMessage, "QR Code scanned successfully!", "success");
                },
                (errorMessage) => {
                    // On error
                    console.log(errorMessage);
                }
            );
        });
        
        // Start QR Scanner for Approval
        scanQrApprovalBtn.addEventListener('click', () => {
            qrReaderApproval.classList.remove('hidden');
            scanQrApprovalBtn.classList.add('hidden');
            
            html5QrCodeApprovalScanner = new Html5Qrcode("qr-reader-approval");
            const config = { fps: 10, qrbox: { width: 250, height: 250 } };
            
            html5QrCodeApprovalScanner.start(
                { facingMode: "environment" }, 
                config, 
                (decodedText) => {
                    // On successful scan
                    attendanceUidInput.value = decodedText;
                    html5QrCodeApprovalScanner.stop();
                    qrReaderApproval.classList.add('hidden');
                    scanQrApprovalBtn.classList.remove('hidden');
                    showStatusMessage(approvalStatusMessage, "QR Code scanned successfully!", "success");
                },
                (errorMessage) => {
                    // On error
                    console.log(errorMessage);
                }
            );
        });
        
        // Registration form submission
        registerBtn.addEventListener('click', () => {
            const uid = uidInput.value.trim();
            const enrollmentNumber = enrollmentNumberInput.value.trim();
            
            if (!uid) {
                showStatusMessage(regStatusMessage, "Please scan a QR code first", "error");
                return;
            }
            
            if (!enrollmentNumber) {
                showStatusMessage(regStatusMessage, "Please enter an enrollment number", "error");
                return;
            }
            
            // Here you would connect to Google Sheets API
            // For demonstration, we'll simulate a successful registration
            
            // In a real implementation, you would use Google Sheets API to:
            // 1. Find the row with the given enrollment number
            // 2. Update the UID column and set status to "active"
            
            // Simulate API call with a timeout
            showStatusMessage(regStatusMessage, "Processing registration...", "success");
            
            setTimeout(() => {
                console.log(`Registered: UID=${uid}, Enrollment=${enrollmentNumber}`);
                showStatusMessage(regStatusMessage, "Student registered successfully!", "success");
                
                // Clear the form
                uidInput.value = "";
                enrollmentNumberInput.value = "";
            }, 1500);
        });
        
        // Attendance marking
        markAttendanceBtn.addEventListener('click', () => {
            const uid = attendanceUidInput.value.trim();
            
            if (!uid) {
                showStatusMessage(approvalStatusMessage, "Please scan a QR code first", "error");
                return;
            }
            
            // Here you would connect to Google Sheets API
            // For demonstration, we'll simulate a successful attendance marking
            
            // In a real implementation, you would use Google Sheets API to:
            // 1. Find the row with the given UID
            // 2. Update the attendance column to "present"
            
            // Simulate API call with a timeout
            showStatusMessage(approvalStatusMessage, "Processing attendance...", "success");
            
            setTimeout(() => {
                console.log(`Marked Present: UID=${uid}`);
                showStatusMessage(approvalStatusMessage, "Attendance marked successfully!", "success");
                
                // Clear the form
                attendanceUidInput.value = "";
            }, 1500);
        });
        
        // Helper function to show status messages
        function showStatusMessage(element, message, type) {
            element.textContent = message;
            element.className = "status-message";
            element.classList.add(type);
            
            // Auto hide after 5 seconds if it's a success message
            if (type === "success") {
                setTimeout(() => {
                    element.style.display = "none";
                }, 5000);
            }
        }
        
        // Google Sheets Integration (placeholder functions)
        
        // In a real implementation, you would use the Google Sheets API
        // Below are placeholder functions to demonstrate the flow
        
        function registerStudentInSheet(uid, enrollmentNumber) {
            // This would use Google Sheets API to:
            // 1. Find the row with the enrollment number
            // 2. Update the UID column and status column
            console.log(`Registering in sheet: UID=${uid}, Enrollment=${enrollmentNumber}`);
            return Promise.resolve(true); // Simulate successful API call
        }
        
        function markAttendanceInSheet(uid) {
            // This would use Google Sheets API to:
            // 1. Find the row with the UID
            // 2. Update the attendance column to "present"
            console.log(`Marking attendance in sheet: UID=${uid}`);
            return Promise.resolve(true); // Simulate successful API call
        }
        
