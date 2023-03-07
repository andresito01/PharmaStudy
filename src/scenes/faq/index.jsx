import { Box, useTheme } from "@mui/material";
import Header from "../../components/Header";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { tokens } from "../../theme";

const FAQ = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <Box m="20px">
      <Header title="FAQ" />

      <Accordion >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography color={colors.greenAccent[500]} variant="h5">
          Client/Sponsor/Support
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Chris Grove
          </Typography>
          <Typography sx={{ m: "0 0 0 10px" }}>
            Part-time professor, SW Manager @ Micron 
          </Typography>
          <Typography sx={{ m: "0 0 0 10px" }}>
            Email: grove@csus.edu
          </Typography>
          <Typography>
            Philipp
          </Typography>
          <Typography sx={{ m: "0 0 0 10px" }}>
            Head of Engineering at Vendia as a sponsor 
          </Typography>
          <Typography sx={{ m: "0 0 0 10px" }}>
            Email: philipp@vendia.net
          </Typography>
          <Typography>
            Elliot Turner
          </Typography>
          <Typography sx={{ m: "0 0 0 10px" }}>
            Graduating Sac State student and Vendia employee will help provide tech support 
          </Typography>
          <Typography sx={{ m: "0 0 0 10px" }}>
            Email: eturner@vendia.net
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography color={colors.greenAccent[500]} variant="h5">
            Background
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography sx={{ m: "0 30px 0 10px" }}>
            In the United States the Federal Drug Administration (FDA) approves medications for specific use cases,
            if the medication has been shown to be both effective and safe. To prove safety and effectiveness of a new drug, 
            pharma companies conduct multi-phase clinical trials in collaboration with health care providers and 
            under oversight of the FDA. For a successful study, all three parties need to exchange data in a controlled 
            and auditable manner. For example, a health care provider needs to be able to identify their patient and 
            track treatment, but they should not know whether the patient is part of the treatment group 
            (receiving the actual medication) or the control group (receiving a placebo or established medication). 
            On the other hand, the FDA and pharma companies need this information, but generally have no need to 
            know a patient's personally identifiable information (PII), such as their name, date of birth, or address. 
            In the interest of patient privacy, PII should be redacted before it is transmitted by a healthcare provider. 
            At the same time it is important that the FDA can verify the integrity of study data. The technical means 
            used to transfer data should make it impossible to - for example - remove a study participant or manipulate 
            laboratory data to improve the chances of approval for a new medication. While we generally believe in the 
            moral integrity of humans, this is a real risk given the cost of developing a new drug (~$1B). 
            Especially when the drug maker has to show that the medication is more effective than existing alternatives.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography color={colors.greenAccent[500]} variant="h5">
            The Goal
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography sx={{ m: "0 30px 0 10px" }}>
            The goal of this class is to build a proof of concept distributed information 
            system with suitable user interfaces that could be used by the FDA, pharmaceutical 
            companies, and participating health care providers to exchange study data as it is 
            produced (i.e., in near real time) in a secure, trusted (i.e., auditable), and controlled 
            (i.e., minimally permissive) manner. We will build our information system on top of the 
            Vendia Share platform, which supports data exchange through an immutable, cryptographically 
            verifiable, distributed ledger and provides the primitives to control data flow (e.g., redaction).
            In the following, we go into more detail on the use case, which you will translate into technical
            requirements and a suitable implementation during this class.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography color={colors.greenAccent[500]} variant="h5">
            Tech Stack/Requirements
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography sx={{ m: "0 30px 0 10px" }}>
            Front End - React is highly recommended. It is easy to use and is a valuable 
            skill to have on your resume. Popular alternatives are: Vue or Angular. 
            You have complete agency over what styling frameworks you want to use, but two 
            suggestions are Tailwind or Bootstrap. The app should be responsive (an essential component in a quality UX).
          </Typography>
          <Typography sx={{ m: "15px 30px 0 10px" }}>
          Back End - Vendia Client SDK (recommended) or Vendia GraphQL API. 
          Vendia utilizes an entirely serverless architecture, so there is no 
          need for any additional infrastructure beyond these two methods
          </Typography>
          <Typography sx={{ m: "15px 30px 0 10px" }}>
          Authentication & Authorization - Cognito, Firebase, and Auth0 are the three major 
          authentication services that are exceptionally easy to integrate.
          </Typography>
        </AccordionDetails>
      </Accordion>      
    </Box>
  );
};

export default FAQ;