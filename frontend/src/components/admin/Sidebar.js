import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';
import SidebarComponent from '../../helper-components/SidebarComponent';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

export default function Sidebar() {
  return (
    <div>
      <div className="hidden mt-20 sm:block">
        <SidebarComponent />
      </div>
      <div className="block mb-4 sm:hidden">
        <Accordion>
          <AccordionSummary expandIcon={<KeyboardArrowDownIcon />}>
            <div>Menu</div>
          </AccordionSummary>
          <AccordionDetails>
            <SidebarComponent />
          </AccordionDetails>
        </Accordion>
      </div>
    </div>
  );
}
