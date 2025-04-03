import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faCheckDouble,
  faEye,
} from "@fortawesome/free-solid-svg-icons";

interface StatusIconProps {
  messageStatus: string | null | undefined; // Adjust type as needed
}

function StatusIcon({ messageStatus }: StatusIconProps) {
  let statusIcon;

  switch (messageStatus) {
    case "sent":
      statusIcon = <FontAwesomeIcon icon={faCheck} />;
      break;
    case "delivered":
      statusIcon = <FontAwesomeIcon icon={faCheckDouble} />;
      break;
    case "read":
      statusIcon = <FontAwesomeIcon icon={faEye} />;
      break;
    default:
      statusIcon = null;
      break;
  }

  return <div className="mr-2">{statusIcon}</div>;
}

export default StatusIcon;
