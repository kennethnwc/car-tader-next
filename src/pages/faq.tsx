import { GetStaticProps } from "next";
import { openDB } from "../openDB";
import { FaqModel } from "../../api/Faq";
import {
  ExpansionPanel,
  ExpansionPanelSummary,
  Typography,
  ExpansionPanelDetails,
} from "@material-ui/core";
import { ExpandMore } from "@material-ui/icons";

type Props = {
  faq: FaqModel[];
};

export default function Faq({ faq }: Props) {
  return (
    <div>
      {faq.map((f) => (
        <ExpansionPanel key={f.id}>
          <ExpansionPanelSummary
            expandIcon={<ExpandMore />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography>{f.question}</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Typography>{f.answer}</Typography>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      ))}
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const db = await openDB();
  const faq = await db.all("SELECT * FROM FAQ ORDER BY createDate DESC");
  return { props: { faq } };
};
