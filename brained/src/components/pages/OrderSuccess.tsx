import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircle, Download, Package, Truck, Mail } from 'lucide-react';
import trackingClient from '../../services/trackingClient';

interface OrderData {
  orderNumber: string;
  items: any[];
  shippingInfo: any;
  pricing: any;
  createdAt: string;
}

export default function OrderSuccess() {
  const location = useLocation();
  const orderData = location.state?.order as OrderData;
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    trackingClient.trackCustomEvent('order_success_viewed', {
      orderNumber: orderData?.orderNumber,
    });
  }, [orderData]);

  const downloadReceipt = () => {
    if (!orderData) return;
    
    setDownloading(true);
    
    // Generate receipt HTML
    const receiptHTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Order Receipt - ${orderData.orderNumber}</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      max-width: 800px;
      margin: 40px auto;
      padding: 20px;
      color: #333;
    }
    .header {
      text-align: center;
      border-bottom: 3px solid #f97316;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    .header h1 {
      color: #f97316;
      margin: 0;
    }
    .order-info {
      background: #f9f9f9;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 30px;
    }
    .section {
      margin-bottom: 30px;
    }
    .section h2 {
      color: #f97316;
      border-bottom: 2px solid #f97316;
      padding-bottom: 10px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 15px;
    }
    th, td {
      text-align: left;
      padding: 12px;
      border-bottom: 1px solid #ddd;
    }
    th {
      background-color: #f97316;
      color: white;
    }
    .totals {
      margin-top: 20px;
      text-align: right;
    }
    .totals div {
      padding: 8px 0;
    }
    .total {
      font-size: 1.4em;
      font-weight: bold;
      color: #f97316;
      padding-top: 15px;
      border-top: 2px solid #f97316;
    }
    .footer {
      text-align: center;
      margin-top: 40px;
      padding-top: 20px;
      border-top: 2px solid #ddd;
      color: #666;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>🛒 ShopEase</h1>
    <p>Order Receipt</p>
  </div>

  <div class="order-info">
    <h2>Order #${orderData.orderNumber}</h2>
    <p><strong>Date:</strong> ${new Date(orderData.createdAt).toLocaleString()}</p>
    <p><strong>Status:</strong> Processing</p>
  </div>

  <div class="section">
    <h2>Shipping Information</h2>
    <p><strong>Name:</strong> ${orderData.shippingInfo.name}</p>
    <p><strong>Email:</strong> ${orderData.shippingInfo.email}</p>
    <p><strong>Address:</strong> ${orderData.shippingInfo.address}</p>
    <p><strong>City:</strong> ${orderData.shippingInfo.city}, ${orderData.shippingInfo.zip}</p>
    <p><strong>Country:</strong> ${orderData.shippingInfo.country}</p>
  </div>

  <div class="section">
    <h2>Order Items</h2>
    <table>
      <thead>
        <tr>
          <th>Item</th>
          <th>Quantity</th>
          <th>Price</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        ${orderData.items.map(item => `
          <tr>
            <td>
              ${item.title}
              ${item.color ? `<br><small>Color: ${item.color}</small>` : ''}
              ${item.size ? `<br><small>Size: ${item.size}</small>` : ''}
            </td>
            <td>${item.quantity}</td>
            <td>$${item.price.toFixed(2)}</td>
            <td>$${(item.price * item.quantity).toFixed(2)}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>

    <div class="totals">
      <div><strong>Subtotal:</strong> $${orderData.pricing.subtotal.toFixed(2)}</div>
      <div><strong>Shipping:</strong> ${orderData.pricing.shipping === 0 ? 'FREE' : '$' + orderData.pricing.shipping.toFixed(2)}</div>
      <div><strong>Tax:</strong> $${orderData.pricing.tax.toFixed(2)}</div>
      <div class="total">Total: $${orderData.pricing.total.toFixed(2)}</div>
    </div>
  </div>

  <div class="footer">
    <p>Thank you for shopping with ShopEase!</p>
    <p>Questions? Contact us at support@shopease.com</p>
  </div>
</body>
</html>
    `;

    // Create and download the file
    const blob = new Blob([receiptHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipt-${orderData.orderNumber}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    trackingClient.trackCustomEvent('receipt_downloaded', {
      orderNumber: orderData.orderNumber,
    });

    setTimeout(() => setDownloading(false), 1000);
  };

  if (!orderData) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">No order data found</p>
          <Link to="/products" className="text-indigo-600 hover:text-indigo-700 font-medium">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 mb-4">
            <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Order Placed Successfully!
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Thank you for your purchase
          </p>
        </div>

        {/* Order Number Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Order Number</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{orderData.orderNumber}</p>
            </div>
            <button
              onClick={downloadReceipt}
              disabled={downloading}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              {downloading ? 'Downloading...' : 'Download Receipt'}
            </button>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Order Date: {new Date(orderData.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>

        {/* What's Next */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">What happens next?</h2>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="shrink-0">
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Order Confirmation Email</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  We've sent a confirmation email to {orderData.shippingInfo.email}
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="shrink-0">
                <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <Package className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Processing Your Order</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  We're preparing your items for shipment
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="shrink-0">
                <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                  <Truck className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Shipping Updates</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  You'll receive tracking information once your order ships (1-3 business days)
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Order Summary</h2>
          
          <div className="space-y-3 mb-4">
            {orderData.items.map((item, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  {item.title} x {item.quantity}
                  {item.color && ` (${item.color})`}
                  {item.size && ` - ${item.size}`}
                </span>
                <span className="font-medium text-gray-900 dark:text-white">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
              <span className="font-medium text-gray-900 dark:text-white">${orderData.pricing.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Shipping</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {orderData.pricing.shipping === 0 ? 'FREE' : `$${orderData.pricing.shipping.toFixed(2)}`}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Tax</span>
              <span className="font-medium text-gray-900 dark:text-white">${orderData.pricing.tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200 dark:border-gray-700">
              <span className="text-gray-900 dark:text-white">Total</span>
              <span className="text-indigo-600 dark:text-indigo-400">${orderData.pricing.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Shipping Address */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Shipping Address</h2>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            <p className="font-medium text-gray-900 dark:text-white">{orderData.shippingInfo.name}</p>
            <p>{orderData.shippingInfo.address}</p>
            <p>{orderData.shippingInfo.city}, {orderData.shippingInfo.zip}</p>
            <p>{orderData.shippingInfo.country}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link to="/products" className="flex-1">
            <button className="w-full py-3 px-6 bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl">
              Continue Shopping
            </button>
          </Link>
          <button
            onClick={downloadReceipt}
            disabled={downloading}
            className="flex-1 py-3 px-6 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 hover:border-indigo-600 dark:hover:border-indigo-400 text-gray-700 dark:text-gray-300 font-semibold rounded-xl transition-all disabled:opacity-50"
          >
            {downloading ? 'Downloading...' : 'Download Receipt'}
          </button>
        </div>
      </div>
    </div>
  );
}
