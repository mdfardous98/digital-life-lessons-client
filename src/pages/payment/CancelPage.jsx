import React from "react";

const CancelPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="text-center">
        <h1 className="text-5xl font-bold mb-6">Payment Cancelled</h1>
        <p className="text-xl mb-8">No worries! You can try again anytime.</p>
        <Link to="/pricing" className="btn btn-primary btn-lg">
          Back to Pricing
        </Link>
      </div>
    </div>
  );
};

export default CancelPage;
