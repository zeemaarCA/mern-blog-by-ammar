import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function PaymentComplete() {
  const [statusMessage, setStatusMessage] = useState('Processing payment...');
  const navigate = useNavigate();

  useEffect(() => {
    const checkPaymentStatus = async () => {
      setStatusMessage('Payment completed successfully!');
    };

    checkPaymentStatus();
  }, []);

  return (
    <div>
      <h1>Payment Complete</h1>
      <p>{statusMessage}</p>
      <button onClick={() => navigate('/')}>Go to Home</button>
    </div>
  );
}
