document.addEventListener('DOMContentLoaded', function () {

    // --- Element Selections ---
    const fab = document.getElementById('fab');
    const actionSheet = document.getElementById('action-sheet');
    const dashboardScreen = document.getElementById('dashboard-screen');
    const invoiceScreen = document.getElementById('invoice-screen');

    // --- Screen Navigation ---
    const showScreen = (screenId) => {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        document.getElementById(screenId).classList.add('active');
    };

    // --- FAB & Action Sheet Logic ---
    fab.addEventListener('click', () => {
        actionSheet.classList.add('show');
    });

    document.getElementById('cancel-action').addEventListener('click', () => {
        actionSheet.classList.remove('show');
    });

    // Handle clicks outside the action sheet content to close it
    actionSheet.addEventListener('click', (event) => {
        if (event.target === actionSheet) {
            actionSheet.classList.remove('show');
        }
    });

    // Handle action selections
    actionSheet.addEventListener('click', (event) => {
        if (event.target.matches('.action-item[data-action="new-invoice"]')) {
            actionSheet.classList.remove('show');
            showScreen('invoice-screen');
            // Set today's date automatically
            document.getElementById('invoice-date').valueAsDate = new Date();
            // Add one initial line item
            if (document.getElementById('line-items').children.length === 0) {
               addLineItem();
            }
        }
    });
    
    // --- Invoice Screen Logic ---
    const backToDashboardBtn = document.getElementById('back-to-dashboard');
    const invoiceForm = document.getElementById('invoice-form');
    const lineItemsContainer = document.getElementById('line-items');
    const addItemBtn = document.getElementById('add-item-btn');
    const invoiceTotalEl = document.getElementById('invoice-total');
    
    backToDashboardBtn.addEventListener('click', () => {
        showScreen('dashboard-screen');
    });

    const addLineItem = () => {
        const itemIndex = lineItemsContainer.children.length;
        const newItem = document.createElement('div');
        newItem.classList.add('line-item');
        newItem.innerHTML = `
            <input type="text" placeholder="Item name" name="item_${itemIndex}_name">
            <input type="number" placeholder="Qty" name="item_${itemIndex}_qty" class="line-item-qty" value="1" min="1">
            <input type="number" placeholder="Price" name="item_${itemIndex}_price" class="line-item-price" step="0.01" min="0">
            <button type="button" class="line-item-delete">×</button>
        `;
        lineItemsContainer.appendChild(newItem);
    };

    addItemBtn.addEventListener('click', addLineItem);

    // Event delegation for deleting line items and calculating total
    lineItemsContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('line-item-delete')) {
            event.target.parentElement.remove();
            calculateTotal();
        }
    });
    lineItemsContainer.addEventListener('input', (event) => {
         if (event.target.classList.contains('line-item-qty') || event.target.classList.contains('line-item-price')) {
            calculateTotal();
        }
    });
    
    const calculateTotal = () => {
        let total = 0;
        const lineItems = lineItemsContainer.querySelectorAll('.line-item');
        lineItems.forEach(item => {
            const qty = parseFloat(item.querySelector('.line-item-qty').value) || 0;
            const price = parseFloat(item.querySelector('.line-item-price').value) || 0;
            total += qty * price;
        });
        invoiceTotalEl.textContent = `₹${total.toFixed(2)}`;
    };

    // --- Form Submission & Toast Notification ---
    invoiceForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent actual form submission
        // In a real app, you would send data to the server here.
        
        showToast("✅ Invoice #INV-0024 sent successfully!");
        
        // After a short delay, go back to the dashboard
        setTimeout(() => {
            showScreen('dashboard-screen');
            // Reset the form for next time
            invoiceForm.reset();
            lineItemsContainer.innerHTML = '';
            calculateTotal();
        }, 2500);
    });

    const showToast = (message) => {
        const toast = document.getElementById('toast');
        const toastMessage = document.getElementById('toast-message');
        
        toastMessage.textContent = message;
        toast.classList.add('show');
        
        // Hide the toast after 3 seconds
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    };
});
