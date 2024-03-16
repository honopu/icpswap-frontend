import { ReactNode } from "react";
import { useHistory } from "react-router-dom";
import { Typography, Box } from "@mui/material";
import { mockALinkToOpen } from "utils/index";

export function ALink({ children, link }: { children: ReactNode; link?: string }) {
  return (
    <a
      href={link}
      target="_blank"
      rel="noreferrer"
      style={{ textDecoration: "underline", textDecorationColor: "#8492c4" }}
    >
      <Typography
        color="text.secondary"
        sx={{
          cursor: "pointer",
          userSelect: "none",
        }}
        component="span"
      >
        {children}
      </Typography>
    </a>
  );
}

function ArrowIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.43866 2.42969H1.15951V0.429688H8.85528H9.85528V1.42969V9.12545H7.85528V3.8415L1.94156 9.75521L0.527344 8.341L6.43866 2.42969Z"
        fill="#5669DC"
      />
    </svg>
  );
}

export interface TextButtonProps {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  link?: string;
  to?: string;
  sx?: any;
  arrow?: boolean;
}

export default function TextButton({ children, onClick = () => {}, disabled, link, to, sx, arrow }: TextButtonProps) {
  const history = useHistory();

  const handleClick = () => {
    if (link) {
      mockALinkToOpen(link, "text-button-open-new-window");
      return;
    }

    if (to) {
      history.push(to);
      return;
    }

    if (onClick) onClick();
  };

  return (
    <Typography
      color="secondary"
      sx={{
        cursor: "pointer",
        userSelect: "none",
        "&:hover": {
          textDecoration: "underline",
        },
        "& +.custom-text-button": {
          marginLeft: "18px",
        },
        ...(sx ?? {}),
      }}
      className="custom-text-button"
      component="span"
      onClick={() => {
        if (Boolean(disabled)) return;
        handleClick();
      }}
    >
      {children}

      {arrow && (
        <Box component="span" sx={{ margin: "0 0 0 5px" }}>
          <ArrowIcon />
        </Box>
      )}
    </Typography>
  );
}