interface Props {
  value: string;
}

export default function CurrencyValue({ value }: Props) {
  const [integer, cents] = value.split(",");

  return (
    <div>
      <div className="font-oswald flex items-end">
        <span className="text-3xl">{integer}</span>
        <span className="text-sm font-extralight">,{cents}</span>
      </div>
    </div>
  );
}
