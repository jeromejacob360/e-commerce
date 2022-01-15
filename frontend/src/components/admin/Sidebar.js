import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';
import SidebarComponent from '../../helper-components/SidebarComponent';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

export default function FileSystemNavigator() {
  return (
    <div>
      <div className="hidden sm:block">
        <SidebarComponent />
      </div>
      <div className="sm:hidden block">
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
