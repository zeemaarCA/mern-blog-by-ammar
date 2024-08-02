import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function PaymentComplete() {
  const { sessionId } = useParams(); // Assuming sessionId is passed in the URL
  const [paymentStatus, setPaymentStatus] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch payment status from your backend
    const fetchPaymentStatus = async () => {
      try {
        const response = await fetch(`/api/payment/checkout-success`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ sessionId }),
        });

        if (response.ok) {
          const data = await response.json();
          setPaymentStatus(data.message || 'Payment completed successfully!');
        } else {
          setPaymentStatus('Payment failed or status not found.');
        }
      } catch (error) {
        console.error('Error fetching payment status:', error);
        setPaymentStatus('An error occurred while fetching payment status.');
      }
    };

    if (sessionId) {
      fetchPaymentStatus();
    }
  }, [sessionId]);

  return (
    <div>
      <h1>Payment Complete</h1>
      <p>{paymentStatus}</p>
      <button onClick={() => navigate('/')}>Go to Home</button>
    </div>
  );
}
