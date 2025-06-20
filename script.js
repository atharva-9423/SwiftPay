if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js')
    .then(() => console.log('Service Worker registered'));
}
// App State
let appState = {
    currentScreen: 'home',
    navigationHistory: ['home-screen'], // Track navigation history
    balance: 2430.00,
    pin: '',
    currentPin: '',
    paymentData: {},
    userName: 'John Doe',
    currency: 'USD', // USD or INR
    exchangeRate: 83.25, // 1 USD = 83.25 INR (approximate)
    balanceVisible: true, // Track balance visibility
    transactionsInitialized: false, // Track if transactions have been initialized with proper names
    transactions: [
        {
            id: 1,
            type: 'sent',
            title: 'Send to Joe Wilson',
            subtitle: 'Payment sent',
            amount: -134.43,
            time: '14:30 PM',
            date: new Date(),
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face'
        },
        {
            id: 2,
            type: 'received',
            title: 'Request to Connor',
            subtitle: 'Payment received',
            amount: 40.00,
            time: '18:00 PM',
            date: new Date(Date.now() - 3600000),
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face'
        },
        {
            id: 3,
            type: 'sent',
            title: 'Send to Emily Roberts',
            subtitle: 'Payment sent',
            amount: -30.10,
            time: '10:00 AM',
            date: new Date(Date.now() - 10800000),
            avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face'
        },
        {
            id: 4,
            type: 'sent',
            title: 'Gas Station',
            subtitle: 'Fuel payment',
            amount: -45.20,
            time: 'Yesterday',
            date: new Date(Date.now() - 86400000),
            avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face'
        },
        {
            id: 5,
            type: 'sent',
            title: 'Amazon',
            subtitle: 'Online purchase',
            amount: -129.99,
            time: 'Yesterday',
            date: new Date(Date.now() - 90000000),
            avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face'
        },
        {
            id: 6,
            type: 'received',
            title: 'Freelance Work',
            subtitle: 'Payment received',
            amount: 500.00,
            time: '2 days ago',
            date: new Date(Date.now() - 172800000),
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face'
        }
    ],
    bills: [
        {
            id: 1,
            title: 'Electricity Bill',
            provider: 'PowerCorp',
            amount: 125.50,
            dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
            status: 'due-soon',
            category: 'electricity',
            referenceNumber: 'PWR123456789'
        },
        {
            id: 2,
            title: 'Internet Bill',
            provider: 'NetSpeed',
            amount: 89.99,
            dueDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000), // 12 days from now
            status: 'pending',
            category: 'internet',
            referenceNumber: 'NET987654321'
        },
        {
            id: 3,
            title: 'Water Bill',
            provider: 'AquaServ',
            amount: 67.25,
            dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
            status: 'overdue',
            category: 'water',
            referenceNumber: 'WTR555666777'
        },
        {
            id: 4,
            title: 'Mobile Plan',
            provider: 'MobileTech',
            amount: 45.00,
            dueDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000), // 20 days from now
            status: 'pending',
            category: 'mobile',
            referenceNumber: 'MOB111222333'
        }
    ]
};

// Fake user database for QR scan simulation
const fakeUsers = [
    { name: 'John Doe', upi: 'john.doe@paytm', phone: '+1234567890' },
    { name: 'Sarah Wilson', upi: 'sarah.w@gpay', phone: '+1234567891' },
    { name: 'Mike Johnson', upi: 'mike.j@phonepe', phone: '+1234567892' },
    { name: 'Emma Davis', upi: 'emma.d@paytm', phone: '+1234567893' },
    { name: 'David Brown', upi: 'david.b@gpay', phone: '+1234567894' }
];

// Indian names for INR currency
const indianNames = [
    'Rajesh Kumar', 'Priya Sharma', 'Amit Singh', 'Neha Gupta', 'Rohit Verma',
    'Sneha Patel', 'Vikash Yadav', 'Pooja Agarwal', 'Arjun Reddy', 'Kavya Nair',
    'Sanjay Joshi', 'Meera Shah', 'Ravi Chandra', 'Anita Mishra', 'Deepak Thakur',
    'Shweta Pandey', 'Manoj Tiwari', 'Ritu Bhattacharya', 'Suresh Iyer', 'Divya Kapoor'
];

// Western names for USD currency
const westernNames = [
    'John Doe', 'Sarah Wilson', 'Mike Johnson', 'Emma Davis', 'David Brown',
    'Lisa Garcia', 'James Miller', 'Anna Rodriguez', 'Chris Wilson', 'Maria Lopez',
    'Robert Taylor', 'Jennifer Lee', 'Michael Clark', 'Jessica Moore', 'Daniel White'
];

// Smooth scrolling utility
function initializeScrolling() {
    // Add smooth scroll behavior to main containers
    const scrollableElements = [
        '#all-transactions',
        '.transaction-list-new',
        '.main-content',
        '.history-filters'
    ];

    scrollableElements.forEach(selector => {
        const element = document.querySelector(selector);
        if (element) {
            element.style.scrollBehavior = 'smooth';
        }
    });
}

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    showSplashScreen();
});

// Splash screen functionality
function showSplashScreen() {
    const splashScreen = document.getElementById('splash-screen');
    const mainApp = document.getElementById('main-app');

    // Hide main app initially
    mainApp.style.display = 'none';

    // Show splash screen for 3 seconds
    setTimeout(() => {
        hideSplashScreen();
    }, 3000);
}

function hideSplashScreen() {
    const splashScreen = document.getElementById('splash-screen');
    const mainApp = document.getElementById('main-app');

    // Add fade out class
    splashScreen.classList.add('fade-out');

    // Show main app and initialize after fade completes
    setTimeout(() => {
        splashScreen.style.display = 'none';
        mainApp.style.display = 'block';
        mainApp.style.opacity = '1';
        initializeApp();
        showHomeScreen(); // Ensure we show the home screen
        showFullscreenPopup();
    }, 800); // Match the transition duration
}

function initializeApp() {
    // Load saved state first
    loadState();

    // Initialize transaction names based on current currency if not already set
    if (appState.transactions.length > 0 && !appState.transactionsInitialized) {
        appState.transactions = appState.transactions.map(transaction => {
            // Only update person names, keep business names like "Gas Station", "Amazon", "Freelance Work"
            const businessNames = ['Gas Station', 'Amazon', 'Freelance Work'];
            if (!businessNames.includes(transaction.title) && !transaction.title.startsWith('Send to') && !transaction.title.startsWith('Request to')) {
                return {
                    ...transaction,
                    title: getRandomNameByCurrency(appState.currency)
                };
            } else if (transaction.title.startsWith('Send to') || transaction.title.startsWith('Request to')) {
                const prefix = transaction.title.includes('Send to') ? 'Send to ' : 'Request to ';
                return {
                    ...transaction,
                    title: prefix + getRandomNameByCurrency(appState.currency)
                };
            }
            return transaction;
        });
        appState.transactionsInitialized = true;
        saveState();
    }

    updateBalanceDisplay();
    updateNameDisplay();
    updateCardholderName();
    updateCurrencyDescription();
    renderRecentTransactions();
    renderAllTransactions();
    updateBottomNav();
    initializeScrolling();
    initializeFilters();
    initializeChart();
}

// Screen Navigation
function showScreen(screenId, addToHistory = true) {
    // Clean up camera if leaving scan screen
    if (appState.currentScreen === 'scan-screen' && screenId !== 'scan-screen') {
        stopCamera();
    }

    // Hide all screens
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });

    // Show target screen
    document.getElementById(screenId).classList.add('active');

    // Update current screen
    const previousScreen = appState.currentScreen;
    appState.currentScreen = screenId.replace('-screen', '');

    // Add to navigation history if it's a new navigation
    if (addToHistory) {
        // Don't add duplicate consecutive entries
        const lastHistoryItem = appState.navigationHistory[appState.navigationHistory.length - 1];
        if (lastHistoryItem !== screenId) {
            appState.navigationHistory.push(screenId);
            // Update browser history for back button support
            updateBrowserHistory(screenId);
        }
    }

    // Update bottom navigation
    updateBottomNav();

    // Add screen-specific logic
    if (screenId === 'scan-screen') {
        startScanAnimation();
        // Reset camera UI
        document.getElementById('scan-status').textContent = 'Point your camera at a QR code';
        document.getElementById('camera-icon').className = 'fas fa-camera';
        document.getElementById('camera-text').textContent = 'Start Camera';
        document.getElementById('flash-btn').style.display = 'none';
    }
}

// Back navigation function
function goBack() {
    if (appState.navigationHistory.length > 1) {
        // Remove current screen from history
        appState.navigationHistory.pop();
        // Get previous screen
        const previousScreen = appState.navigationHistory[appState.navigationHistory.length - 1];
        // Navigate without adding to history
        showScreen(previousScreen, false);
    } else {
        // If on home screen with no history, close the app
        closeApp();
    }
}

// Close app function
function closeApp() {
    // If in fullscreen, exit fullscreen
    if (document.fullscreenElement) {
        exitFullscreen();
        showNotification('Exited fullscreen mode', 'info');
    } else {
        // Show close confirmation
        showNotification('Tap back again to close the app', 'info');

        // Set a flag to track if user wants to close
        if (!window.closeAppTimer) {
            window.closeAppTimer = setTimeout(() => {
                window.closeAppTimer = null;
            }, 2000); // Reset after 2 seconds
        } else {
            // User tapped back twice, actually close
            clearTimeout(window.closeAppTimer);
            window.closeAppTimer = null;

            // Try to close the window/tab
            if (window.close) {
                window.close();
            } else {
                showNotification('App closed - you can now close this tab', 'success');
            }
        }
    }
}

function showHomeScreen() {
    showScreen('home-screen');
}

function showPaymentScreen() {
    showScreen('payment-screen');
    clearPaymentForm();
}

function showReceiveScreen() {
    showScreen('receive-screen');
}

function showScanScreen() {
    showScreen('scan-screen');
}

function showHistoryScreen() {
    showScreen('history-screen');
}

function showCardsScreen() {
    showScreen('cards-screen');
}

function showBillsScreen() {
    showScreen('bills-screen');
    renderRecentBills();
}

function showSettingsScreen() {
    showScreen('settings-screen');
}

function showRewardsScreen() {
    showScreen('rewards-screen');
}

function showRedeemOptions() {
    showNotification('Redeem options: Gift cards, cashback, and more!', 'info');
}

function shareReferralCode() {
    const referralCode = 'SWIFT' + Math.random().toString(36).substr(2, 6).toUpperCase();

    if (navigator.share) {
        navigator.share({
            title: 'Join SwiftPay and get $25!',
            text: `Use my referral code ${referralCode} to get $25 when you sign up for SwiftPay!`,
            url: window.location.href
        }).then(() => {
            showNotification('Referral link shared successfully!', 'success');
        }).catch(() => {
            copyReferralCode(referralCode);
        });
    } else {
        copyReferralCode(referralCode);
    }
}

function copyReferralCode(code) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(code).then(() => {
            showNotification(`Referral code ${code} copied to clipboard!`, 'success');
        }).catch(() => {
            showNotification('Failed to copy referral code', 'error');
        });
    } else {
        showNotification(`Your referral code: ${code}`, 'info');
    }
}

function scratchCard(cardNumber) {
    const card = document.querySelectorAll('.scratch-card')[cardNumber - 1];
    if (card && !card.classList.contains('revealed')) {
        card.classList.add('revealed');

        // Add points to user account
        const rewards = [
            { type: 'cashback', amount: 5, message: 'You won $5 cashback!' },
            { type: 'points', amount: 100, message: 'You won 100 points!' }
        ];

        const reward = rewards[cardNumber - 1];

        if (reward.type === 'cashback') {
            appState.balance += reward.amount;
            updateBalanceDisplay();
            saveState();
        } else if (reward.type === 'points') {
            // Add points logic here if needed
        }

        setTimeout(() => {
            showNotification(reward.message, 'success');
        }, 500);
    }
}

function showPinScreen(action) {
    // Validate payment form if coming from payment screen
    if (action === 'payment') {
        const name = document.getElementById('recipient-name').value.trim();
        const upi = document.getElementById('recipient-upi').value.trim();
        const amount = parseFloat(document.getElementById('payment-amount').value);

        console.log('Payment validation:', { name, upi, amount, balance: appState.balance });

        if (!name || !upi || !amount || amount <= 0) {
            showNotification('Please fill all required fields', 'error');
            return;
        }

        if (isNaN(amount)) {
            showNotification('Please enter a valid amount', 'error');
            return;
        }

        if (amount > appState.balance) {
            showNotification(`Insufficient balance. Available: $${appState.balance.toFixed(2)}`, 'error');
            return;
        }

        appState.paymentData = {
            name,
            upi,
            amount,
            note: document.getElementById('payment-note').value.trim()
        };

        console.log('Payment data saved:', appState.paymentData);
    }

    appState.currentPin = '';
    updatePinDisplay();
    hideConfirmButton();
    hideProcessingAnimation();
    showPinSection(); // Make sure PIN section is visible
    showScreen('pin-screen');
}

function goBackFromPin() {
    if (appState.paymentData.name) {
        showScreen('payment-screen', false);
    } else {
        goBack();
    }
}

// PIN Management
function enterPin(digit) {
    if (appState.currentPin.length < 4) {
        appState.currentPin += digit;
        updatePinDisplay();

        if (appState.currentPin.length === 4) {
            setTimeout(() => validatePin(), 300);
        }
    }
}

function deletePin() {
    if (appState.currentPin.length > 0) {
        appState.currentPin = appState.currentPin.slice(0, -1);
        updatePinDisplay();
    }
}

function updatePinDisplay() {
    const dots = document.querySelectorAll('.pin-dot');
    dots.forEach((dot, index) => {
        if (index < appState.currentPin.length) {
            dot.classList.add('filled');
        } else {
            dot.classList.remove('filled');
        }
    });
}

function validatePin() {
    // For demo purposes, accept any 4-digit PIN
    if (appState.currentPin.length === 4) {
        showConfirmButton();
    } else {
        showNotification('Invalid PIN', 'error');
        appState.currentPin = '';
        updatePinDisplay();
    }
}

function showConfirmButton() {
    const confirmBtn = document.getElementById('confirm-payment-btn');
    if (confirmBtn) {
        confirmBtn.style.display = 'flex';
        confirmBtn.style.animation = 'fadeInScale 0.3s ease-out';
    }
}

function hideConfirmButton() {
    const confirmBtn = document.getElementById('confirm-payment-btn');
    if (confirmBtn) {
        confirmBtn.style.display = 'none';
    }
}

function hidePinSection() {
    const pinDisplay = document.querySelector('.pin-display');
    const pinKeypad = document.querySelector('.pin-keypad');
    const screenHeader = document.querySelector('#pin-screen .screen-header');

    if (pinDisplay) {
        pinDisplay.style.display = 'none';
    }
    if (pinKeypad) {
        pinKeypad.style.display = 'none';
    }
    if (screenHeader) {
        screenHeader.style.display = 'none';
    }
}

function showPinSection() {
    const pinDisplay = document.querySelector('.pin-display');
    const pinKeypad = document.querySelector('.pin-keypad');
    const screenHeader = document.querySelector('#pin-screen .screen-header');

    if (pinDisplay) {
        pinDisplay.style.display = 'block';
    }
    if (pinKeypad) {
        pinKeypad.style.display = 'grid';
    }
    if (screenHeader) {
        screenHeader.style.display = 'flex';
    }
}

function confirmPayment() {
    // Hide confirm button first
    hideConfirmButton();

    // Hide the entire PIN section and show processing animation
    hidePinSection();
    showProcessingAnimation();

    // Simulate processing delay
    setTimeout(() => {
        processPayment();
    }, 2000);
}

function showProcessingAnimation() {
    const processingDiv = document.getElementById('payment-processing');
    if (processingDiv) {
        processingDiv.style.display = 'flex';
    }
}

function hideProcessingAnimation() {
    const processingDiv = document.getElementById('payment-processing');
    if (processingDiv) {
        processingDiv.style.display = 'none';
    }
}

// Payment Processing
function processPayment() {
    const { name, upi, amount, note, isBillPayment, billId } = appState.paymentData;

    console.log('Processing payment:', { name, upi, amount, currentBalance: appState.balance, isBillPayment });

    // Hide processing animation
    hideProcessingAnimation();

    // Check if sufficient balance
    if (amount > appState.balance) {
        showNotification('Insufficient balance', 'error');
        showHomeScreen();
        return;
    }

    // Deduct from balance
    appState.balance -= amount;
    console.log('New balance after payment:', appState.balance);

    // Update balance display immediately
    updateBalanceDisplay();

    // If this is a bill payment, mark the bill as paid
    if (isBillPayment && billId) {
        const billIndex = appState.bills.findIndex(b => b.id === billId);
        if (billIndex !== -1) {
            appState.bills[billIndex].status = 'paid';
            appState.bills[billIndex].paidDate = new Date();
            // Re-render bills list
            renderRecentBills();
        }
    }

    // Add to transaction history
    const newTransaction = {
        id: Date.now(),
        type: 'sent',
        title: name,
        subtitle: note || 'Payment sent',
        amount: -amount,
        time: 'Just now',
        date: new Date(),
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
        originalUpi: upi // Store the original UPI ID entered by user
    };

    appState.transactions.unshift(newTransaction);
    renderRecentTransactions();
    renderAllTransactions();

    // Save state immediately after payment
    saveState();

    // Show success screen
    showSuccessScreen(name, amount);
}

function showSuccessScreen(recipient, amount) {
    document.getElementById('success-recipient').textContent = recipient;
    document.getElementById('success-amount').textContent = `${getCurrencySymbol()}${formatCurrency(amount)}`;
    document.getElementById('success-time').textContent = new Date().toLocaleString();

    // Store transaction details for the details modal
    appState.lastTransactionDetails = {
        recipient: recipient,
        amount: amount,
        transactionId: generateTransactionId(),
        utr: generateUTR(),
        timestamp: new Date(),
        status: 'Success',
        paymentMethod: 'SwiftPay Wallet',
        transactionType: appState.paymentData.isBillPayment ? 'Bill Payment' : 'Money Transfer',
        reference: appState.paymentData.note || 'Payment sent',
        fromAccount: 'SwiftPay Wallet ****2847',
        toAccount: appState.paymentData.upi || recipient + '@upi',
        originalUpi: appState.paymentData.upi // Store the original UPI ID entered
    };

    console.log('Transaction details stored:', appState.lastTransactionDetails);
    
    showScreen('success-screen');

    // Clear payment data but keep lastTransactionDetails
    appState.paymentData = {};
    appState.currentPin = '';
}

// Generate unique transaction ID
function generateTransactionId() {
    const prefix = 'TXN';
    const timestamp = Date.now().toString(36).toUpperCase(); // Convert to base 36 and uppercase
    const random1 = Math.random().toString(36).substring(2, 8).toUpperCase();
    const random2 = Math.random().toString(36).substring(2, 6).toUpperCase();
    const random3 = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `${prefix}${timestamp}${random1}${random2}${random3}`;
}

// Generate UTR (Unique Transaction Reference)
function generateUTR() {
    const year = new Date().getFullYear().toString().slice(-2);
    const month = String(new Date().getMonth() + 1).padStart(2, '0');
    const day = String(new Date().getDate()).padStart(2, '0');
    const random1 = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
    const random2 = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${year}${month}${day}${random1}${random2}`;
}

// Show payment details page
function showPaymentDetails() {
    if (!appState.lastTransactionDetails) {
        showNotification('No recent transaction details available', 'error');
        return;
    }

    const details = appState.lastTransactionDetails;
    console.log('Loading payment details:', details);

    try {
        // Navigate to payment details screen first
        showScreen('payment-details-screen');

        // Use setTimeout to ensure DOM is ready
        setTimeout(() => {
            try {
                // Populate the page with transaction details
                const recipientNameEl = document.getElementById('detail-recipient-name');
                const amountEl = document.getElementById('detail-amount');
                const debitAmountEl = document.getElementById('detail-debit-amount');
                const transactionIdEl = document.getElementById('detail-transaction-id');
                const utrEl = document.getElementById('detail-utr');
                const headerTimeEl = document.getElementById('detail-header-time');
                const bankingNameEl = document.getElementById('detail-banking-name');
                const sentToEl = document.getElementById('detail-sent-to');
                const recipientIdEl = document.getElementById('detail-recipient-id');
                const fromAccountEl = document.getElementById('detail-from-account');
                const avatarEl = document.getElementById('detail-recipient-avatar');

                if (recipientNameEl) recipientNameEl.textContent = details.recipient || 'Unknown';
                if (amountEl) amountEl.textContent = `${getCurrencySymbol()}${formatCurrency(details.amount || 0)}`;
                if (debitAmountEl) debitAmountEl.textContent = `${getCurrencySymbol()}${formatCurrency(details.amount || 0)}`;
                if (transactionIdEl) transactionIdEl.textContent = details.transactionId || 'N/A';
                if (utrEl) utrEl.textContent = details.utr || 'N/A';
                
                if (headerTimeEl && details.timestamp) {
                    const date = new Date(details.timestamp);
                    const day = String(date.getDate()).padStart(2, '0');
                    const month = String(date.getMonth() + 1).padStart(2, '0');
                    const year = date.getFullYear();
                    const hours = String(date.getHours()).padStart(2, '0');
                    const minutes = String(date.getMinutes()).padStart(2, '0');
                    const seconds = String(date.getSeconds()).padStart(2, '0');
                    headerTimeEl.textContent = `${day}-${month}-${year} on ${hours}:${minutes}:${seconds}`;
                }
                
                if (bankingNameEl) {
                    const spanEl = bankingNameEl.querySelector('span');
                    if (spanEl) spanEl.textContent = details.recipient || 'Unknown';
                }
                
                if (sentToEl) sentToEl.textContent = details.originalUpi || details.toAccount || 'N/A';
                if (recipientIdEl) recipientIdEl.textContent = details.originalUpi || details.toAccount || 'N/A';
                if (fromAccountEl) fromAccountEl.textContent = details.fromAccount || 'N/A';

                // Set recipient avatar initials
                if (avatarEl && details.recipient) {
                    const initials = details.recipient.split(' ').map(name => name.charAt(0).toUpperCase()).join('').substring(0, 2);
                    avatarEl.textContent = initials;
                }

                showNotification('Transaction details loaded successfully', 'success');
                
            } catch (innerError) {
                console.error('Error populating payment details:', innerError);
                showNotification('Error loading transaction details', 'error');
            }
        }, 100);
        
    } catch (error) {
        console.error('Error showing payment details:', error);
        showNotification('Error loading transaction details', 'error');
    }
}

// Toggle transfer details section
function toggleTransferDetails() {
    const section = document.getElementById('transfer-details-section');
    const content = document.getElementById('transfer-details-content');

    section.classList.toggle('expanded');
    content.classList.toggle('expanded');
}

// Copy text to clipboard
function copyText(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            showNotification('Copied to clipboard', 'success');
        }).catch(() => {
            showNotification('Failed to copy', 'error');
        });
    } else {
        showNotification('Clipboard not supported', 'error');
    }
}

// Repeat payment function
function repeatPayment() {
    if (appState.lastTransactionDetails) {
        const details = appState.lastTransactionDetails;
        document.getElementById('recipient-name').value = details.recipient;
        document.getElementById('recipient-upi').value = details.toAccount;
        document.getElementById('payment-amount').value = details.amount;
        document.getElementById('payment-note').value = 'Repeat payment';

        showPaymentScreen();
        showNotification('Payment form filled with previous details', 'success');
    }
}

// Split expense function
function splitExpense() {
    showNotification('Split expense feature coming soon!', 'info');
}

// Contact support function
function contactSupport() {
    showNotification('Contacting SwiftPay support...', 'info');
}

// Close payment details page
function closePaymentDetails() {
    goBack();
}

// Copy transaction details to clipboard
function copyTransactionDetails() {
    if (!appState.lastTransactionDetails) {
        showNotification('No transaction details to copy', 'error');
        return;
    }

    const details = appState.lastTransactionDetails;
    const detailsText = `
Transaction Details:
- Recipient: ${details.recipient}
- Amount: ${getCurrencySymbol()}${formatCurrency(details.amount)}
- Transaction ID: ${details.transactionId}
- UTR: ${details.utr}
- Date & Time: ${details.timestamp.toLocaleString()}
- Status: ${details.status}
- Payment Method: ${details.paymentMethod}
- Type: ${details.transactionType}
- Reference: ${details.reference}
- From: ${details.fromAccount}
- To: ${details.toAccount}
    `.trim();

    if (navigator.clipboard) {
        navigator.clipboard.writeText(detailsText).then(() => {
            showNotification('Transaction details copied to clipboard', 'success');
        }).catch(() => {
            showNotification('Failed to copy transaction details', 'error');
        });
    } else {
        showNotification('Clipboard not supported', 'error');
    }
}

// Share transaction details
function shareTransactionDetails() {
    if (!appState.lastTransactionDetails) {
        showNotification('No transaction details to share', 'error');
        return;
    }

    const details = appState.lastTransactionDetails;
    const shareText = `Payment of ${getCurrencySymbol()}${formatCurrency(details.amount)} sent to ${details.recipient} via SwiftPay. Transaction ID: ${details.transactionId}`;

    if (navigator.share) {
        navigator.share({
            title: 'SwiftPay Transaction Receipt',
            text: shareText,
            url: window.location.href
        }).then(() => {
            showNotification('Transaction details shared successfully!', 'success');
        }).catch(() => {
            copyTransactionDetails();
        });
    } else {
        copyTransactionDetails();
    }
}

// Currency Management
function getCurrencySymbol() {
    return appState.currency === 'USD' ? '$' : '₹';
}

function formatCurrency(amount) {
    const symbol = getCurrencySymbol();
    const locale = appState.currency === 'USD' ? 'en-US' : 'en-IN';
    return amount.toLocaleString(locale, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

function convertCurrency(amount, fromCurrency, toCurrency) {
    if (fromCurrency === toCurrency) return amount;

    if (fromCurrency === 'USD' && toCurrency === 'INR') {
        return amount * appState.exchangeRate;
    } else if (fromCurrency === 'INR' && toCurrency === 'USD') {
        return amount / appState.exchangeRate;
    }

    return amount;
}

// Balance Management
function updateBalanceDisplay() {
    // Update currency symbols throughout the UI
    const currencyElements = document.querySelectorAll('.currency, .currency-symbol');
    currencyElements.forEach(element => {
        element.textContent = getCurrencySymbol();
    });

    // Update balance visibility
    updateBalanceVisibility();
}

function showEditBalance() {
    document.getElementById('new-balance').value = appState.balance.toFixed(2);
    document.getElementById('edit-balance-modal').classList.add('active');
}

function closeEditBalance() {
    document.getElementById('edit-balance-modal').classList.remove('active');
}

function updateBalanceValue() {
    const newBalance = parseFloat(document.getElementById('new-balance').value);

    if (isNaN(newBalance) || newBalance < 0) {
        showNotification('Please enter a valid amount', 'error');
        return;
    }

    appState.balance = newBalance;
    updateBalanceDisplay();
    closeEditBalance();
    showNotification('Balance updated successfully', 'success');
    saveState(); // Save immediately after balance change
}

function showEditNameModal() {
    document.getElementById('new-name').value = appState.userName;
    document.getElementById('edit-name-modal').classList.add('active');
}

function closeEditName() {
    document.getElementById('edit-name-modal').classList.remove('active');
}

function updateUserName() {
    const newName = document.getElementById('new-name').value.trim();

    if (!newName) {
        showNotification('Please enter a valid name', 'error');
        return;
    }

    appState.userName = newName;
    updateNameDisplay();
    updateCardholderName(); // Automatically update cardholder name
    closeEditName();
    showNotification('Name updated successfully', 'success');
    saveState();
}

function updateNameDisplay() {
    document.querySelector('.user-name').textContent = appState.userName;
    updateCardholderName();
}

// Function to get random name based on currency
function getRandomNameByCurrency(currency) {
    const names = currency === 'INR' ? indianNames : westernNames;
    return names[Math.floor(Math.random() * names.length)];
}

function switchCurrency() {
    const oldCurrency = appState.currency;
    const newCurrency = appState.currency === 'USD' ? 'INR' : 'USD';

    // Convert balance to new currency
    appState.balance = convertCurrency(appState.balance, oldCurrency, newCurrency);

    // Convert all transaction amounts and update names based on currency
    appState.transactions = appState.transactions.map(transaction => ({
        ...transaction,
        amount: convertCurrency(transaction.amount, oldCurrency, newCurrency),
        title: getRandomNameByCurrency(newCurrency)
    }));

    // Update currency
    appState.currency = newCurrency;

    // Update all displays
    updateBalanceDisplay();
    renderRecentTransactions();
    renderAllTransactions();
    updateCurrencyDescription();

    // Save state
    saveState();

    showNotification(`Currency switched to ${newCurrency}`, 'success');
}

function updateCurrencyDescription() {
    const descriptionElement = document.getElementById('currency-description');
    if (descriptionElement) {
        if (appState.currency === 'USD') {
            descriptionElement.textContent = 'USD ($) - Switch to INR (₹)';
        } else {
            descriptionElement.textContent = 'INR (₹) - Switch to USD ($)';
        }
    }
}

// Balance visibility toggle
function toggleBalanceVisibility() {
    appState.balanceVisible = !appState.balanceVisible;
    updateBalanceVisibility();
    saveState();

    const message = appState.balanceVisible ? 'Balance visible' : 'Balance hidden';
    showNotification(message, 'info');
}

function updateBalanceVisibility() {
    const balanceElement = document.getElementById('main-balance');
    const currencyElement = document.querySelector('.balance-amount-new .currency');
    const eyeIcon = document.getElementById('balance-eye-icon');

    if (appState.balanceVisible) {
        balanceElement.classList.remove('balance-hidden');
        currencyElement.classList.remove('balance-hidden');
        eyeIcon.className = 'fas fa-eye';
        balanceElement.textContent = formatCurrency(appState.balance);
    } else {
        balanceElement.classList.add('balance-hidden');
        currencyElement.classList.add('balance-hidden');
        eyeIcon.className = 'fas fa-eye-slash';
        balanceElement.textContent = '****.**';
    }
}

// Custom Transaction Modal Functions
function showCustomTransactionModal() {
    // Reset form fields
    document.getElementById('custom-transaction-name').value = '';
    document.getElementById('custom-transaction-description').value = '';
    document.getElementById('custom-transaction-amount').value = '';
    document.getElementById('custom-transaction-type').value = 'received';
    document.getElementById('custom-transaction-avatar').value = '';

    document.getElementById('custom-transaction-modal').classList.add('active');
}

function closeCustomTransactionModal() {
    document.getElementById('custom-transaction-modal').classList.remove('active');
}

// Transaction Management Functions
function showTransactionManagement() {
    document.getElementById('transaction-management-modal').classList.add('active');
    renderTransactionManagementList();
}

function closeTransactionManagement() {
    document.getElementById('transaction-management-modal').classList.remove('active');
}

function renderTransactionManagementList() {
    const container = document.getElementById('transaction-list-manage');

    if (appState.transactions.length === 0) {
        container.innerHTML = `
            <div class="transaction-empty-state">
                <i class="fas fa-history"></i>
                <h3>No Transactions</h3>
                <p>You don't have any transactions to manage</p>
            </div>
        `;
        return;
    }

    container.innerHTML = appState.transactions.map(transaction => {
        const isPositive = transaction.amount > 0;
        const amountPrefix = isPositive ? '+' : '-';
        const amountColor = isPositive ? '#2ed573' : '#ff4757';
        const currencySymbol = getCurrencySymbol();

        return `
            <div class="transaction-item-manage">
                <div class="transaction-info-manage">
                    <div class="transaction-title-manage">${transaction.title}</div>
                    <div class="transaction-amount-manage" style="color: ${amountColor}">
                        ${amountPrefix}${currencySymbol}${formatCurrency(Math.abs(transaction.amount))} • ${transaction.time}
                    </div>
                </div>
                <button class="transaction-delete-btn" onclick="deleteSpecificTransaction(${transaction.id})">
                    <i class="fas fa-trash"></i>
                    Delete
                </button>
            </div>
        `;
    }).join('');
}

function deleteSpecificTransaction(transactionId) {
    const transaction = appState.transactions.find(t => t.id === transactionId);
    if (!transaction) {
        showNotification('Transaction not found', 'error');
        return;
    }

    showConfirmation(
        'Delete Transaction',
        `Are you sure you want to delete the transaction "${transaction.title}"? This action cannot be undone.`,
        () => {
            // Find and remove the transaction
            const index = appState.transactions.findIndex(t => t.id === transactionId);
            if (index !== -1) {
                appState.transactions.splice(index, 1);

                // Re-render transaction lists
                renderRecentTransactions();
                renderAllTransactions();
                renderTransactionManagementList();

                // Save state
                saveState();

                showNotification('Transaction deleted successfully', 'success');
                closeConfirmation();
            }
        }
    );
}

function deleteAllTransactions() {
    if (appState.transactions.length === 0) {
        showNotification('No transactions to delete', 'info');
        return;
    }

    showConfirmation(
        'Delete All Transactions',
        `Are you sure you want to delete all ${appState.transactions.length} transactions? This action cannot be undone.`,
        () => {
            // Clear all transactions
            appState.transactions = [];

            // Re-render transaction lists
            renderRecentTransactions();
            renderAllTransactions();
            renderTransactionManagementList();

            // Save state
            saveState();

            showNotification('All transactions deleted successfully', 'success');
            closeConfirmation();
            closeTransactionManagement();
        }
    );
}

// Confirmation Modal Functions
function showConfirmation(title, message, onConfirm) {
    document.getElementById('confirmation-title').textContent = title;
    document.getElementById('confirmation-message').textContent = message;

    const actionBtn = document.getElementById('confirmation-action-btn');
    actionBtn.onclick = onConfirm;

    document.getElementById('confirmation-modal').classList.add('active');
}

function closeConfirmation() {
    document.getElementById('confirmation-modal').classList.remove('active');
}

function addCustomTransaction() {
    const name = document.getElementById('custom-transaction-name').value.trim();
    const description = document.getElementById('custom-transaction-description').value.trim();
    const amount = parseFloat(document.getElementById('custom-transaction-amount').value);
    const type = document.getElementById('custom-transaction-type').value;
    const avatarUrl = document.getElementById('custom-transaction-avatar').value.trim();

    // Validation
    if (!name) {
        showNotification('Please enter a transaction name', 'error');
        return;
    }



    if (isNaN(amount) || amount <= 0) {
        showNotification('Please enter a valid amount', 'error');
        return;
    }

    // Default avatar if none provided
    const defaultAvatar = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face';
    const avatar = avatarUrl || defaultAvatar;

    // Create new transaction
    const newTransaction = {
        id: Date.now(),
        type: type,
        title: name,
        subtitle: description || (type === 'received' ? 'Payment received' : 'Payment sent'),
        amount: type === 'received' ? amount : -amount,
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
        date: new Date(),
        avatar: avatar
    };

    // Update balance if it's a received payment
    if (type === 'received') {
        appState.balance += amount;
        updateBalanceDisplay();
    }

    // Add to transaction history
    appState.transactions.unshift(newTransaction);

    // Re-render transaction lists
    renderRecentTransactions();
    renderAllTransactions();

    // Save state
    saveState();

    // Close modal and show success
    closeCustomTransactionModal();
    showNotification(`Custom transaction "${name}" added successfully`, 'success');
}

// Transaction Rendering
function renderRecentTransactions() {
    const container = document.getElementById('recent-transactions');
    const recentTransactions = appState.transactions.slice(0, 4);

    container.innerHTML = recentTransactions.map(transaction => createTransactionHTML(transaction)).join('');
}

function renderAllTransactions() {
    const container = document.getElementById('all-transactions');
    container.innerHTML = appState.transactions.map(transaction => createTransactionHTML(transaction)).join('');
}

function createTransactionHTML(transaction) {
    const isPositive = transaction.amount > 0;
    const amountClass = isPositive ? 'received' : 'sent';
    const amountPrefix = isPositive ? '+' : '-';
    const amountColor = isPositive ? '#2ed573' : '#ff4757';
    const currencySymbol = getCurrencySymbol();

    // Get first letter of the name for avatar
    const firstLetter = transaction.title.charAt(0).toUpperCase();

    // Generate a consistent background color based on the name
    const colors = ['#10B981', '#6366f1', '#8b5cf6', '#f59e0b', '#ef4444', '#06b6d4', '#84cc16', '#f97316'];
    const colorIndex = transaction.title.charCodeAt(0) % colors.length;
    const avatarColor = colors[colorIndex];

    return `
        <div class="transaction-item-new" onclick="showTransactionDetails(${transaction.id})">
            <div class="transaction-avatar letter-avatar" style="background: ${avatarColor}">
                <span>${firstLetter}</span>
            </div>
            <div class="transaction-details-new">
                <div class="transaction-title-new">${transaction.title}</div>
                <div class="transaction-time">${transaction.time}</div>
            </div>
            <div class="transaction-amount-new" style="color: ${amountColor}">
                ${amountPrefix}${currencySymbol}${formatCurrency(Math.abs(transaction.amount))}
            </div>
        </div>
    `;
}

function showTransactionDetails(transactionId) {
    const transaction = appState.transactions.find(t => t.id === transactionId);
    if (!transaction) {
        showNotification('Transaction not found', 'error');
        return;
    }

    // Store transaction details for the details page
    appState.lastTransactionDetails = {
        recipient: transaction.title,
        amount: Math.abs(transaction.amount),
        transactionId: generateTransactionId(),
        utr: generateUTR(),
        timestamp: transaction.date,
        status: 'Completed',
        paymentMethod: 'SwiftPay Wallet',
        transactionType: transaction.amount > 0 ? 'Money Received' : 'Money Sent',
        reference: transaction.subtitle,
        fromAccount: transaction.amount > 0 ? 'External Account' : 'SwiftPay Wallet ****2847',
        toAccount: transaction.amount > 0 ? 'SwiftPay Wallet ****2847' : transaction.title.toLowerCase().replace(/\s+/g, '.') + '@upi',
        originalUpi: transaction.originalUpi || transaction.title.toLowerCase().replace(/\s+/g, '.') + '@upi' // Use stored UPI or generate fallback
    };

    console.log('Showing transaction details for:', transactionId);
    console.log('Transaction details:', appState.lastTransactionDetails);

    // Call the showPaymentDetails function to handle the display
    showPaymentDetails();
}

// QR Code Scanning Variables
let qrScanner = null;
let currentStream = null;
let isScanning = false;

// QR Code Detection
function detectQRCode(video, canvas) {
    const context = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

    // Use jsQR library for real QR code detection
    try {
        const code = jsQR(imageData.data, imageData.width, imageData.height);

        if (code) {
            handleQRDetection(code.data);
            return true;
        }
    } catch (error) {
        console.error('QR detection error:', error);
    }

    return false;
}

function handleQRDetection(qrData) {
    try {
        // Stop camera
        stopCamera();

        // Try to parse as JSON first (for structured payment QR codes)
        try {
            const data = JSON.parse(qrData);
            if (data.type === 'payment') {
                document.getElementById('recipient-name').value = data.name || '';
                document.getElementById('recipient-upi').value = data.upi || '';
                if (data.amount) {
                    document.getElementById('payment-amount').value = data.amount;
                }
                showPaymentScreen();
                showNotification(`QR code scanned: ${data.name}`, 'success');
                return;
            }
        } catch (jsonError) {
            // Not JSON, continue with other formats
        }

        // Check for UPI payment URLs
        if (qrData.startsWith('upi://pay?')) {
            const url = new URL(qrData);
            const params = url.searchParams;

            const name = params.get('pn') || 'Unknown';
            const upi = params.get('pa') || '';
            const amount = params.get('am') || '';

            document.getElementById('recipient-name').value = name;
            document.getElementById('recipient-upi').value = upi;
            if (amount) {
                document.getElementById('payment-amount').value = amount;
            }

            showPaymentScreen();
            showNotification(`UPI QR scanned: ${name}`, 'success');
            return;
        }

        // Check for simple contact/phone number
        if (qrData.match(/^\+?[\d\s\-\(\)]+$/)) {
            document.getElementById('recipient-upi').value = qrData;
            showPaymentScreen();
            showNotification('Phone number QR scanned', 'success');
            return;
        }

        // Check for email addresses
        if (qrData.includes('@') && qrData.includes('.')) {
            document.getElementById('recipient-upi').value = qrData;
            showPaymentScreen();
            showNotification('Email QR scanned', 'success');
            return;
        }

        // For any other QR code content
        document.getElementById('recipient-upi').value = qrData;
        showPaymentScreen();
        showNotification('QR code scanned successfully', 'success');

    } catch (e) {
        console.error('QR handling error:', e);
        showNotification('Error processing QR code', 'error');
    }
}

// Camera permission check
async function checkCameraPermission() {
    try {
        if (navigator.permissions && navigator.permissions.query) {
            const permissionStatus = await navigator.permissions.query({ name: 'camera' });
            console.log('Camera permission state:', permissionStatus.state);
            return permissionStatus.state;
        }
    } catch (error) {
        console.log('Permission API not supported, will prompt during getUserMedia');
    }
    // Return 'prompt' if permission API is not supported - getUserMedia will handle the prompt
    return 'prompt';
}

// Camera Controls
async function startCamera() {
    try {
        const video = document.getElementById('qr-video');
        const canvas = document.getElementById('qr-canvas');
        const statusElement = document.getElementById('scan-status');
        const cameraIcon = document.getElementById('camera-icon');
        const cameraText = document.getElementById('camera-text');
        const flashBtn = document.getElementById('flash-btn');

        // Check if getUserMedia is supported
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            statusElement.textContent = 'Camera not supported in this browser';
            showNotification('Camera access is not supported in this browser. Please use a modern browser like Chrome, Firefox, or Safari.', 'error');
            return;
        }

        // Show requesting permission status immediately
        statusElement.textContent = 'Click "Allow" when prompted for camera access';
        cameraIcon.className = 'fas fa-spinner fa-spin';
        cameraText.textContent = 'Requesting Access';

        // Show instruction to user
        showNotification('Your browser will ask for camera permission. Please click "Allow" to scan QR codes.', 'info');

        // Request camera permission - this WILL trigger browser permission prompt
        const constraints = {
            video: {
                facingMode: { ideal: 'environment' }, // Prefer back camera but allow front
                width: { min: 320, ideal: 1280, max: 1920 },
                height: { min: 240, ideal: 720, max: 1080 }
            },
            audio: false
        };

        console.log('Requesting camera access with constraints:', constraints);

        // The getUserMedia call will trigger the permission prompt
        currentStream = await navigator.mediaDevices.getUserMedia(constraints);

        console.log('Camera access granted, stream obtained:', currentStream);

        // Set video source
        video.srcObject = currentStream;

        // Wait for video to be ready
        await new Promise((resolve) => {
            video.onloadedmetadata = () => {
                video.play().then(resolve).catch(resolve);
            };
        });

        statusElement.textContent = 'Camera ready - Point at QR code to scan';
        cameraIcon.className = 'fas fa-stop';
        cameraText.textContent = 'Stop Camera';
        flashBtn.style.display = 'flex';

        isScanning = true;

        // Start QR detection loop
        scanQRCode(video, canvas);

        showNotification('Camera started successfully! Point at a QR code to scan.', 'success');

    } catch (error) {
        console.error('Camera access error:', error);
        let errorMessage = 'Camera access failed';
        let detailedMessage = errorMessage;

        if (error.name === 'NotAllowedError') {
            errorMessage = 'Camera permission denied';
            detailedMessage = 'Camera permission was denied. Please refresh the page and click "Allow" when asked for camera access. Or check your browser settings to enable camera permissions for this site.';
        } else if (error.name === 'NotFoundError') {
            errorMessage = 'No camera found';
            detailedMessage = 'No camera found on this device. Please ensure your device has a working camera.';
        } else if (error.name === 'NotSupportedError') {
            errorMessage = 'Camera not supported';
            detailedMessage = 'Camera not supported on this device or browser. Please use a modern browser.';
        } else if (error.name === 'NotReadableError') {
            errorMessage = 'Camera busy';
            detailedMessage = 'Camera is being used by another application. Please close other apps using the camera and try again.';
        } else if (error.name === 'OverconstrainedError') {
            errorMessage = 'Camera constraints error';
            detailedMessage = 'Camera does not support the requested video format. Trying with basic settings...';

            // Try again with minimal constraints
            setTimeout(() => startCameraFallback(), 1000);
            return;
        }

        // Reset UI
        const statusElement = document.getElementById('scan-status');
        const cameraIcon = document.getElementById('camera-icon');
        const cameraText = document.getElementById('camera-text');
        const flashBtn = document.getElementById('flash-btn');

        statusElement.textContent = errorMessage;
        cameraIcon.className = 'fas fa-camera';
        cameraText.textContent = 'Start Camera';
        flashBtn.style.display = 'none';

        showNotification(detailedMessage, 'error');
    }
}

// Fallback camera function with minimal constraints
async function startCameraFallback() {
    try {
        const video = document.getElementById('qr-video');
        const canvas = document.getElementById('qr-canvas');
        const statusElement = document.getElementById('scan-status');
        const cameraIcon = document.getElementById('camera-icon');
        const cameraText = document.getElementById('camera-text');
        const flashBtn = document.getElementById('flash-btn');

        statusElement.textContent = 'Trying with basic camera settings...';
        showNotification('Trying with basic camera settings...', 'info');

        // Minimal constraints
        const constraints = {
            video: true,
            audio: false
        };

        currentStream = await navigator.mediaDevices.getUserMedia(constraints);
        video.srcObject = currentStream;

        await new Promise((resolve) => {
            video.onloadedmetadata = () => {
                video.play().then(resolve).catch(resolve);
            };
        });

        statusElement.textContent = 'Camera ready - Point at QR code to scan';
        cameraIcon.className = 'fas fa-stop';
        cameraText.textContent = 'Stop Camera';
        flashBtn.style.display = 'flex';

        isScanning = true;
        scanQRCode(video, canvas);

        showNotification('Camera started with basic settings!', 'success');

    } catch (error) {
        console.error('Fallback camera error:', error);
        const statusElement = document.getElementById('scan-status');
        const cameraIcon = document.getElementById('camera-icon');
        const cameraText = document.getElementById('camera-text');

        statusElement.textContent = 'Camera access failed completely';
        cameraIcon.className = 'fas fa-camera';
        cameraText.textContent = 'Start Camera';

        showNotification('Unable to access camera. Please check your browser settings and permissions.', 'error');
    }
}

function stopCamera() {
    if (currentStream) {
        currentStream.getTracks().forEach(track => track.stop());
        currentStream = null;
    }

    const video = document.getElementById('qr-video');
    const statusElement = document.getElementById('scan-status');
    const cameraIcon = document.getElementById('camera-icon');
    const cameraText = document.getElementById('camera-text');
    const flashBtn = document.getElementById('flash-btn');

    video.srcObject = null;
    isScanning = false;

    statusElement.textContent = 'Camera stopped';
    cameraIcon.className = 'fas fa-camera';
    cameraText.textContent = 'Start Camera';
    flashBtn.style.display = 'none';
}

function toggleCamera() {
    if (isScanning) {
        stopCamera();
        showNotification('Camera stopped', 'info');
    } else {
        // Show clear instruction about camera permission
        showNotification('Your browser will ask for camera permission. Please click "Allow" to enable QR code scanning.', 'info');

        // Add a small delay to ensure the user sees the notification
        setTimeout(() => {
            startCamera();
        }, 500);
    }
}

function scanQRCode(video, canvas) {
    if (!isScanning) return;

    if (video.readyState === video.HAVE_ENOUGH_DATA) {
        const detected = detectQRCode(video, canvas);
        if (detected) {
            return; // Stop scanning if QR code is detected
        }
    }

    // Continue scanning
    requestAnimationFrame(() => scanQRCode(video, canvas));
}

async function toggleFlash() {
    if (!currentStream) return;

    try {
        const track = currentStream.getVideoTracks()[0];
        const capabilities = track.getCapabilities();

        if (capabilities.torch) {
            const settings = track.getSettings();
            await track.applyConstraints({
                advanced: [{ torch: !settings.torch }]
            });

            showNotification(settings.torch ? 'Flash off' : 'Flash on', 'info');
        } else {
            showNotification('Flash not supported on this device', 'error');
        }
    } catch (error) {
        console.error('Flash toggle error:', error);
        showNotification('Flash control failed', 'error');
    }
}

function startScanAnimation() {
    const scanLine = document.querySelector('.scan-line');
    if (scanLine) {
        scanLine.style.animation = 'none';
        setTimeout(() => {
            scanLine.style.animation = 'scanAnimation 2s linear infinite';
        }, 10);
    }
}

// Form Management
function clearPaymentForm() {
    document.getElementById('recipient-name').value = '';
    document.getElementById('recipient-upi').value = '';
    document.getElementById('payment-amount').value = '';
    document.getElementById('payment-note').value = '';
}

// Cards Screen Functions
let cardDetailsVisible = false;
let cvvVisible = false;

function toggleCardDetails() {
    const cardDetails = document.getElementById('card-details');
    const swipeIndicator = document.querySelector('.swipe-indicator');
    const swipeArrow = document.getElementById('swipe-arrow');

    cardDetailsVisible = !cardDetailsVisible;

    if (cardDetailsVisible) {
        cardDetails.classList.add('visible');
        swipeIndicator.classList.add('expanded');
        swipeIndicator.querySelector('span').textContent = 'Swipe Up to hide';
    } else {
        cardDetails.classList.remove('visible');
        swipeIndicator.classList.remove('expanded');
        swipeIndicator.querySelector('span').textContent = 'Swipe Down for details';
    }
}

function copyCardNumber() {
    const cardNumber = '4532 1234 5678 2847';

    if (navigator.clipboard) {
        navigator.clipboard.writeText(cardNumber).then(() => {
            showNotification('Card number copied to clipboard', 'success');
        }).catch(() => {
            showNotification('Failed to copy card number', 'error');
        });
    } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = cardNumber;
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            showNotification('Card number copied to clipboard', 'success');
        } catch (err) {
            showNotification('Failed to copy card number', 'error');
        }
        document.body.removeChild(textArea);
    }
}

function toggleCVV() {
    const cvvValue = document.getElementById('cvv-value');
    const cvvEye = document.getElementById('cvv-eye');

    cvvVisible = !cvvVisible;

    if (cvvVisible) {
        cvvValue.textContent = '142';
        cvvEye.className = 'fas fa-eye-slash';
    } else {
        cvvValue.textContent = '***';
        cvvEye.className = 'fas fa-eye';
    }
}

function freezeCard() {
    showNotification('Card freeze functionality would be implemented here', 'info');
}

function showCardSettings() {
    showNotification('Card settings would open here', 'info');
}

// Update cardholder name when user name changes
function updateCardholderName() {
    const cardholderElement = document.getElementById('cardholder-name');
    const cardholderDetailElement = document.getElementById('cardholder-detail-name');

    if (cardholderElement) {
        cardholderElement.textContent = appState.userName.toUpperCase();
    }
    if (cardholderDetailElement) {
        cardholderDetailElement.textContent = appState.userName.toUpperCase();
    }
}

// Bottom Navigation
function updateBottomNav() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => item.classList.remove('active'));

    // Set active based on current screen
    switch (appState.currentScreen) {
        case 'home-screen':
            navItems[0].classList.add('active');
            break;
        case 'history-screen':
            navItems[1].classList.add('active');
            break;
        case 'payment-screen':
        case 'pin-screen':
            navItems[2].classList.add('active');
            break;
        case 'cards-screen':
            navItems[3].classList.add('active');
            break;
        case 'settings-screen':
            navItems[4].classList.add('active');
            break;
    }
}

// Notification System
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    const messageSpan = document.createElement('span');
    messageSpan.textContent = message;

    notification.innerHTML = '';
    notification.appendChild(document.createElement('div'));
    notification.firstChild.className = 'notification-content';

    notification.firstChild.appendChild(messageSpan);

    const closeButton = document.createElement('button');
    closeButton.className = 'notification-close';
    closeButton.onclick = function() { this.parentElement.parentElement.remove(); };
    closeButton.innerHTML = '<i class="fas fa-times"></i>';

    notification.firstChild.appendChild(closeButton);

    // Add notification styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: ${type === 'error' ? '#ff6b6b' : type === 'success' ? '#4ecdc4' : '#6c63ff'};
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 10000;
        animation: slideDown 0.3s ease;
        max-width: 90%;
        font-size: 14px;
        font-weight: 500;
    `;

    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideDown {
            from {
                opacity: 0;
                transform: translateX(-50%) translateY(-20px);
            }
            to {
                opacity: 1;
                transform: translateX(-50%) translateY(0);
            }
        }
        .notification-content {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
        }
        .notification-close {
            background: none;
            border: none;
            color: white;
            cursor: pointer;
            padding: 4px;
            border-radius: 4px;
            opacity: 0.8;
            transition: opacity 0.2s ease;
        }
        .notification-close:hover {
            opacity: 1;
        }
    `;

    document.head.appendChild(style);
    document.body.appendChild(notification);

    // Auto remove after 3 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 3000);
}

// Filter Management
function initializeFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));

            // Add active class to clicked button
            this.classList.add('active');

            // Filter transactions based on button text
            const filterType = this.textContent.toLowerCase();
            filterTransactions(filterType);
        });
    });
}

function filterTransactions(filterType) {
    let filteredTransactions = appState.transactions;

    switch (filterType) {
        case 'sent':
            filteredTransactions = appState.transactions.filter(t => t.amount < 0);
            break;
        case 'received':
            filteredTransactions = appState.transactions.filter(t => t.amount > 0);
            break;
        case 'pending':
            // For demo purposes, show some transactions as pending
            filteredTransactions = appState.transactions.slice(0, 2).map(t => ({
                ...t,
                subtitle: 'Pending...',
                type: 'pending'
            }));
            break;
        default:
            filteredTransactions = appState.transactions;
    }

    const container = document.getElementById('all-transactions');
    container.innerHTML = filteredTransactions.map(transaction => createTransactionHTML(transaction)).join('');
}

// Chart Simulation (area chart)
function initializeChart() {
    const canvas = document.getElementById('spending-chart');
    if (!canvas) return;

    try {
        const container = canvas.parentElement;
        if (!container) return;

        const containerRect = container.getBoundingClientRect();
        const containerWidth = Math.max(containerRect.width - 48, 200); // Account for padding with minimum width
        const containerHeight = Math.max(containerRect.height - 40, 120); // Account for padding with minimum height

        // Set canvas resolution
        const dpr = window.devicePixelRatio || 1;
        canvas.width = containerWidth * dpr;
        canvas.height = containerHeight * dpr;

        // Set canvas display size
        canvas.style.width = containerWidth + 'px';
        canvas.style.height = containerHeight + 'px';

        // Scale the drawing context so everything draws at the higher resolution
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.scale(dpr, dpr);

        // Sample data points for smooth area chart
        const dataPoints = [400, 580, 520, 480, 520, 380, 420, 650, 820];

        // Chart dimensions
        const padding = 20;
        const chartWidth = containerWidth - (padding * 2);
        const chartHeight = containerHeight - (padding * 2);

        // Ensure positive dimensions
        if (chartWidth <= 0 || chartHeight <= 0) return;

        // Clear canvas
        ctx.clearRect(0, 0, containerWidth, containerHeight);

        // Find min and max values for scaling
        const maxValue = Math.max(...dataPoints);
        const minValue = Math.min(...dataPoints);
        const valueRange = maxValue - minValue || 1; // Prevent division by zero

        // Calculate positions
        const stepX = chartWidth / Math.max(dataPoints.length - 1, 1);
        const points = dataPoints.map((value, index) => ({
            x: padding + (index * stepX),
            y: padding + chartHeight - ((value - minValue) / valueRange * chartHeight)
        }));

        // Draw grid lines (very subtle)
        ctx.strokeStyle = 'rgba(125, 133, 144, 0.05)';
        ctx.lineWidth = 1;

        // Horizontal grid lines
        for (let i = 0; i <= 5; i++) {
            const y = padding + (i * chartHeight / 5);
            ctx.beginPath();
            ctx.moveTo(padding, y);
            ctx.lineTo(padding + chartWidth, y);
            ctx.stroke();
        }

        // Create smooth curve using quadratic curves
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);

        for (let i = 0; i < points.length - 1; i++) {
            const currentPoint = points[i];
            const nextPoint = points[i + 1];

            // Calculate control point for smooth curve
            const controlPointX = currentPoint.x + (nextPoint.x - currentPoint.x) / 2;
            const controlPointY = currentPoint.y;

            ctx.quadraticCurveTo(controlPointX, controlPointY, nextPoint.x, nextPoint.y);
        }

        // Create area fill by connecting to bottom
        const areaPath = new Path2D();
        areaPath.moveTo(points[0].x, points[0].y);

        // Draw the smooth curve for the area
        for (let i = 0; i < points.length - 1; i++) {
            const currentPoint = points[i];
            const nextPoint = points[i + 1];
            const controlPointX = currentPoint.x + (nextPoint.x - currentPoint.x) / 2;
            const controlPointY = currentPoint.y;
            areaPath.quadraticCurveTo(controlPointX, controlPointY, nextPoint.x, nextPoint.y);
        }

        // Close the area by drawing to bottom and back
        areaPath.lineTo(points[points.length - 1].x, padding + chartHeight);
        areaPath.lineTo(points[0].x, padding + chartHeight);
        areaPath.closePath();

        // Fill the area with gradient
        const gradient = ctx.createLinearGradient(0, padding, 0, padding + chartHeight);
        gradient.addColorStop(0, 'rgba(16, 185, 129, 0.3)');
        gradient.addColorStop(0.5, 'rgba(16, 185, 129, 0.15)');
        gradient.addColorStop(1, 'rgba(16, 185, 129, 0.05)');

        ctx.fillStyle = gradient;
        ctx.fill(areaPath);

        // Draw the stroke line
        ctx.strokeStyle = '#10B981';
        ctx.lineWidth = 2.5;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();

        // Add subtle value labels at top
        ctx.fillStyle = 'rgba(125, 133, 144, 0.7)';
        ctx.font = '10px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctx.textAlign = 'center';

        // Show values at key points
        [0, 2, 4, 6, 8].forEach(index => {
            if (points[index] && index < dataPoints.length) {
                ctx.fillText(dataPoints[index].toString(), points[index].x, padding - 5);
            }
        });

        // Add bottom axis labels
        ctx.fillStyle = 'rgba(125, 133, 144, 0.6)';
        ctx.font = '9px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';

        // Show simplified month labels
        const labelIndices = [0, 2, 4, 6];
        const labelTexts = ['APR 30', 'MAY 1', 'MAY 3', 'MAY 5'];

        labelIndices.forEach((index, i) => {
            if (points[index] && labelTexts[i] && index < points.length) {
                ctx.fillText(labelTexts[i], points[index].x, containerHeight - 5);
            }
        });

    } catch (error) {
        console.error('Chart initialization error:', error);
        // Fallback: show a simple placeholder
        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.fillStyle = 'rgba(125, 133, 144, 0.3)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#10B981';
            ctx.font = '14px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('Chart Loading...', canvas.width / 2, canvas.height / 2);
        }
    }
}

// Touch/Swipe Gestures (for mobile enhancement)
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', function(e) {
    touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', function(e) {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 100;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            // Swipe left - could implement screen navigation
        } else {
            // Swipe right - could implement back navigation
        }
    }
}

// Browser back button support
window.addEventListener('popstate', function(e) {
    if (e.state && e.state.screen) {
        showScreen(e.state.screen, false);
    } else {
        // If on home screen, close app instead of going back
        if (appState.currentScreen === 'home' || appState.currentScreen === 'home-screen') {
            closeApp();
        } else {
            goBack();
        }
    }
});

// Push initial state
if (window.history.state === null) {
    window.history.replaceState({ screen: 'home-screen' }, '', '');
}

// Update browser history when navigating
function updateBrowserHistory(screenId) {
    window.history.pushState({ screen: screenId }, '', '');
}

// Keyboard shortcuts (for desktop)
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        if (appState.currentScreen === 'pin-screen') {
            goBackFromPin();
        } else if (appState.currentScreen === 'home-screen' || appState.currentScreen === 'home') {
            closeApp();
        } else {
            goBack();
        }
    }
});

// Auto-save state to localStorage
function saveState() {
    localStorage.setItem('payWalletState', JSON.stringify({
        balance: appState.balance,
        transactions: appState.transactions,
        userName: appState.userName,
        currency: appState.currency,
        balanceVisible: appState.balanceVisible,
        transactionsInitialized: appState.transactionsInitialized
    }));
}

function loadState() {
    const saved = localStorage.getItem('payWalletState');
    if (saved) {
        const state = JSON.parse(saved);
        appState.balance = state.balance || appState.balance;
        appState.transactions = state.transactions || appState.transactions;
        appState.userName = state.userName || appState.userName;
        appState.currency = state.currency || appState.currency;
        appState.balanceVisible = state.balanceVisible !== undefined ? state.balanceVisible : appState.balanceVisible;
        appState.transactionsInitialized = state.transactionsInitialized || false;
    }
}

function loadTransactions() {
    const recentContainer = document.getElementById('recent-transactions');
    const allContainer = document.getElementById('all-transactions');

    if (recentContainer) {
        recentContainer.innerHTML = '';
        appState.transactions.slice(0, 3).forEach(transaction => {
            const transactionElement = createTransactionHTML(transaction);
            recentContainer.appendChild(transactionElement);
        });
    }

    if (allContainer) {
        allContainer.innerHTML = '';
        appState.transactions.forEach(transaction => {
            const transactionElement = createTransactionHTML(transaction);
            allContainer.appendChild(transactionElement);
        });
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    showSplashScreen();

    // Save state periodically
    setInterval(saveState, 30000); // Save every 30 seconds
});

// Update the onclick handler
window.updateBalance = updateBalanceValue;

// Enhanced animations
function addRippleEffect(element, e) {
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
    `;

    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);

    setTimeout(() => ripple.remove(), 600);
}

// Add ripple effects to buttons
document.addEventListener('click', function(e) {
    if (e.target.matches('.primary-btn, .action-btn, .pin-btn:not(.empty)')) {
        addRippleEffect(e.target, e);
    }
});

// Add CSS for ripple animation
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);

// Bills functionality
function renderRecentBills() {
    const container = document.getElementById('recent-bills-list');
    if (!container) return;

    const recentBills = appState.bills.slice(0, 3);
    container.innerHTML = recentBills.map(bill => createBillHTML(bill)).join('');
}

function createBillHTML(bill) {
    const dueDate = new Date(bill.dueDate);
    const now = new Date();
    const daysDiff = Math.ceil((dueDate - now) / (1000 * 60 * 60 * 24));

    let dueDateText = '';
    let statusClass = bill.status;

    if (bill.status === 'paid') {
        dueDateText = 'Paid ✓';
        statusClass = 'paid';
    } else if (daysDiff < 0) {
        dueDateText = `Overdue by ${Math.abs(daysDiff)} days`;
        statusClass = 'overdue';
    } else if (daysDiff === 0) {
        dueDateText = 'Due today';
        statusClass = 'due-today';
    } else if (daysDiff <= 7) {
        dueDateText = `Due in ${daysDiff} days`;
        statusClass = 'due-soon';
    } else {
        dueDateText = `Due ${dueDate.toLocaleDateString()}`;
        statusClass = 'pending';
    }

    const categoryColors = {
        electricity: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
        water: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
        internet: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
        mobile: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        gas: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
        insurance: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)'
    };

    const categoryIcons = {
        electricity: 'fas fa-bolt',
        water: 'fas fa-tint',
        internet: 'fas fa-wifi',
        mobile: 'fas fa-mobile-alt',
        gas: 'fas fa-fire',
        insurance: 'fas fa-shield-alt'
    };

    const clickHandler = bill.status === 'paid' ? '' : `onclick="payBill(${bill.id})"`;
    const disabledClass = bill.status === 'paid' ? 'bill-paid' : '';

    return `
        <div class="bill-item ${disabledClass}" ${clickHandler}>
            <div class="bill-icon" style="background: ${categoryColors[bill.category] || '#6366f1'}">
                <i class="${categoryIcons[bill.category] || 'fas fa-file-invoice'}"></i>
            </div>
            <div class="bill-details">
                <div class="bill-title">${bill.title}</div>
                <div class="bill-due-date ${statusClass}">${dueDateText}</div>
            </div>
            <div class="bill-amount ${statusClass}">
                ${getCurrencySymbol()}${formatCurrency(bill.amount)}
            </div>
        </div>
    `;
}

function showBillCategory(category) {
    showNotification(`${category.charAt(0).toUpperCase() + category.slice(1)} bills will be shown here`, 'info');
}

function showAllBills() {
    showNotification('All bills view will be implemented here', 'info');
}

function payBill(billId) {
    const bill = appState.bills.find(b => b.id === billId);
    if (bill) {
        // Store bill payment data
        appState.paymentData = {
            name: bill.provider,
            upi: bill.referenceNumber,
            amount: bill.amount,
            note: `Payment for ${bill.title}`,
            isBillPayment: true,
            billId: billId
        };

        // Go directly to PIN screen for bill payments
        showPinScreen('bill-payment');
        showNotification(`Processing payment for ${bill.title}`, 'info');
    }
}

function payBillQuick() {
    const reference = document.getElementById('bill-reference').value.trim();
    const amount = parseFloat(document.getElementById('bill-amount').value);

    if (!reference) {
        showNotification('Please enter bill reference number', 'error');
        return;
    }

    if (!amount || amount <= 0) {
        showNotification('Please enter a valid amount', 'error');
        return;
    }

    // Pre-fill payment form
    document.getElementById('recipient-name').value = 'Bill Payment';
    document.getElementById('recipient-upi').value = reference;
    document.getElementById('payment-amount').value = amount;
    document.getElementById('payment-note').value = 'Quick bill payment';

    showPaymentScreen();
    showNotification('Quick pay form filled', 'success');
}

// Fullscreen functionality
function requestFullscreen() {
    // Check if already in fullscreen
    if (document.fullscreenElement) {
        return;
    }

    const element = document.documentElement;

    if (element.requestFullscreen) {
        element.requestFullscreen().catch(err => {
            console.log('Fullscreen request failed:', err);
        });
    } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
    } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
    }
}

function exitFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    }
}

function toggleFullscreen() {
    if (document.fullscreenElement) {
        exitFullscreen();
    } else {
        requestFullscreen();
    }
}

// Listen for fullscreen changes
document.addEventListener('fullscreenchange', function() {
    if (document.fullscreenElement) {
        console.log('Entered fullscreen mode');
    } else {
        console.log('Exited fullscreen mode');
    }
});

// Handle escape key to allow users to exit fullscreen manually
document.addEventListener('keydown', function(e) {
    if (e.key === 'F11') {
        e.preventDefault();
        toggleFullscreen();
    }
});

// Fullscreen popup functions
function showFullscreenPopup() {
    // Show popup if not already in fullscreen
    if (!document.fullscreenElement) {
        document.getElementById('fullscreen-popup-modal').classList.add('active');
    }
}

function closeFullscreenPopup() {
    document.getElementById('fullscreen-popup-modal').classList.remove('active');
}

function acceptFullscreen() {
    document.getElementById('fullscreen-popup-modal').classList.remove('active');
    requestFullscreen();
}

// Update fullscreen icon in navbar when fullscreen state changes
document.addEventListener('fullscreenchange', function() {
    const icon = document.getElementById('fullscreen-icon');
    if (document.fullscreenElement) {
        console.log('Entered fullscreen mode');
        if (icon) {
            icon.className = 'fas fa-compress';
        }
    } else {
        console.log('Exited fullscreen mode');
        if (icon) {
            icon.className = 'fas fa-expand';
        }
    }
});

console.log('PayWallet App Initialized Successfully! 🚀');

// Wallet Management
function showBalanceTab() {
    // Update tab active states
    document.querySelectorAll('.wallet-tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.wallet-tab')[0].classList.add('active');
    
    // Show/hide content
    document.getElementById('balance-content').style.display = 'block';
    document.getElementById('wallet-content').style.display = 'none';
}

function showWalletTab() {
    // Update tab active states
    document.querySelectorAll('.wallet-tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.wallet-tab')[1].classList.add('active');
    
    // Show/hide content
    document.getElementById('balance-content').style.display = 'none';
    document.getElementById('wallet-content').style.display = 'block';
    
    // Load wallet accounts if not already loaded
    renderWalletAccounts();
}

function renderWalletAccounts() {
    const container = document.getElementById('wallet-accounts-list');
    if (!container) return;

    // Sample wallet accounts data
    const walletAccounts = [
        {
            id: 1,
            name: 'Primary Wallet',
            balance: appState.balance,
            type: 'primary',
            isDefault: true,
            icon: 'fas fa-wallet',
            color: '#10B981'
        },
        {
            id: 2,
            name: 'Savings Wallet',
            balance: 1250.75,
            type: 'savings',
            isDefault: false,
            icon: 'fas fa-piggy-bank',
            color: '#8b5cf6'
        },
        {
            id: 3,
            name: 'Business Wallet',
            balance: 890.25,
            type: 'business',
            isDefault: false,
            icon: 'fas fa-briefcase',
            color: '#f59e0b'
        }
    ];

    container.innerHTML = walletAccounts.map(account => `
        <div class="wallet-account-item" onclick="selectWallet(${account.id})">
            <div class="wallet-account-icon" style="background: ${account.color}">
                <i class="${account.icon}"></i>
            </div>
            <div class="wallet-account-details">
                <div class="wallet-account-name">${account.name}</div>
                <div class="wallet-account-balance">${getCurrencySymbol()}${formatCurrency(account.balance)}</div>
                <div class="wallet-account-type">${account.type.charAt(0).toUpperCase() + account.type.slice(1)} Account</div>
            </div>
            ${account.isDefault ? '<div class="wallet-default-badge">Default</div>' : ''}
            <div class="wallet-account-arrow">
                <i class="fas fa-chevron-right"></i>
            </div>
        </div>
    `).join('');
}

function selectWallet(walletId) {
    showNotification(`Switched to wallet ${walletId}`, 'success');
}

function showCreateWalletModal() {
    document.getElementById('new-wallet-name').value = '';
    document.getElementById('new-wallet-balance').value = '';
    document.getElementById('new-wallet-type').value = 'primary';
    document.getElementById('create-wallet-modal').classList.add('active');
}

function closeCreateWalletModal() {
    document.getElementById('create-wallet-modal').classList.remove('active');
}

function createNewWallet() {
    const name = document.getElementById('new-wallet-name').value.trim();
    const balance = parseFloat(document.getElementById('new-wallet-balance').value);
    const type = document.getElementById('new-wallet-type').value;

    if (!name) {
        showNotification('Please enter a wallet name', 'error');
        return;
    }

    if (isNaN(balance) || balance < 0) {
        showNotification('Please enter a valid balance', 'error');
        return;
    }

    // Close modal and show success
    closeCreateWalletModal();
    showNotification(`Wallet "${name}" created successfully with ${getCurrencySymbol()}${formatCurrency(balance)}`, 'success');
    
    // Re-render wallet accounts to include the new one
    renderWalletAccounts();
}