import React from "react";

type Props = { text: string };

const TitlePage = ({ text }: Props) => {
  return <h1 className="text-2xl font-semibold">{text}</h1>;
};

export default TitlePage;
