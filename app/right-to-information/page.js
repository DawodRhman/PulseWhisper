import RtiClient from "./RtiClient";

export const metadata = {
  title: "Right to Information | KW&SC",
  description: "Access official documents, forms, and information about KW&SC operations.",
  keywords: "rti, right to information, documents, forms, kwsc, karachi",
};

export default function Page() {
  return <RtiClient />;
}
