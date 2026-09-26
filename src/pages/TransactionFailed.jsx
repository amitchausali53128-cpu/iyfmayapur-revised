export default function TransactionFailed() {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 text-center text-sm text-stone-500">
      <h1 className="text-lg font-bold text-stone-700">Transaction Failed</h1>
      <p>We apologize, but your transaction could not be completed.</p>
      <p>Please try again or contact support if the issue persists.</p>
    </div>
  );
}