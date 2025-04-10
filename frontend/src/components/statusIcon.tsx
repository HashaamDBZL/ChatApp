import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IoCheckmarkDoneSharp } from "react-icons/io5";
import { MdCheck } from "react-icons/md";

import React from "react";

interface StatusIconProps {
  messageStatus: string | null | undefined; // Adjust type as needed
}

function StatusIcon({ messageStatus }: StatusIconProps) {
  let statusIcon;

  switch (messageStatus) {
    case "sent":
      statusIcon = <MdCheck />;

      break;
    case "delivered":
      statusIcon = <IoCheckmarkDoneSharp />;

      break;
    case "read":
      statusIcon = <IoCheckmarkDoneSharp color="blue" />;
      break;
    default:
      statusIcon = null;
      break;
  }

  return <div className="mr-2 mt-1">{statusIcon}</div>;
}

export default StatusIcon;
