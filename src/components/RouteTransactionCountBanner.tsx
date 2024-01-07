interface Props {
  numberOfTransactions: number;
}

export default function RouteTransactionCountBanner({
  numberOfTransactions,
}: Props) {
  return (
    <div className="bg-black text-white/50 font-medium uppercase text-xs p-3 rounded-md flex items-center w-full text-left">
      <p className="flex-1">
        This route requires{" "}
        {numberOfTransactions === 1 && (
          <span className="text-white">1 Transaction</span>
        )}
        {numberOfTransactions > 1 && (
          <span className="text-white">
            {numberOfTransactions} Transactions
          </span>
        )}{" "}
        to complete
      </p>
    </div>
  );
}
