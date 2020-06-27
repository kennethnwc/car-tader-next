import { GetStaticProps } from "next";
import { openDB } from "../openDB";
import { FaqModel } from "../../api/Faq";

type Props = {
  faq: FaqModel[];
};

export default function Faq({ faq }: Props) {
  return (
    <div>
      {faq.map((f) => (
        <div key={f.id}>
          {f.question} | {f.answer}
        </div>
      ))}
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const db = await openDB();
  const faq = await db.all("SELECT * FROM FAQ ORDER BY createDate DESC");
  return { props: { faq } };
};
