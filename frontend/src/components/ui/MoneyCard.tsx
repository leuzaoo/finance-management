import CurrencyValue from "../utils/CurrencyValue";

interface Props {
  label: string;
  value: string;
  currency: string;
}

function MoneyCard({ label, value, currency }: Props) {
  return (
    <div className="bg-light/10 h-24 min-w-56 rounded-xl">
      <div className="flex h-full flex-col justify-center p-3">
        <span className="text-light/50 first-letter:capitalize">{label}</span>
        <div className="mt-2 flex items-center justify-between gap-3">
          <CurrencyValue value={value} />{" "}
          <span className="text-lg opacity-60">{currency}</span>
        </div>
      </div>
    </div>
  );
}

export default MoneyCard;
