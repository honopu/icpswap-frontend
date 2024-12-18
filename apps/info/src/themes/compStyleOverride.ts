import { isDarkTheme } from "utils/index";
import { createTheme } from "@mui/material";
import { DynamicObject } from "types/index";

import colors from "./colors";

const MuiTheme = createTheme({});

export function componentStyleOverrides(theme: DynamicObject) {
  const isDark = isDarkTheme(theme);
  const globalButtonBackground = isDark ? theme.defaultGradient : theme.colors.lightPrimaryMain;
  const menuHoverBackground = isDark ? theme.menuSelectedBack : theme.colors.lightLevel2;

  return {
    MuiButton: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          borderRadius: "8px",
          textTransform: "none",
          "&.MuiButton-outlinedPrimary": {
            color: isDark ? theme.colors.secondaryMain : theme.colors.lightPrimaryMain,
            borderColor: isDark ? theme.colors.secondaryMain : theme.colors.lightPrimaryMain,
            "&:hover": {
              background: "rgba(86, 105, 220, 0.1)",
            },
          },
          "&.MuiButton-contained.Mui-disabled": {
            ...(isDark
              ? {
                  background: "#4F5A84",
                }
              : { color: "#9E9E9E", background: "#E0E0E0" }),
          },
          "&.secondary": {
            background: "#4F5A84",
            "&:hover": {
              background: "#4F5A84",
            },
          },
          "&.MuiButton-contained": {
            "&.secondary": {
              background: colors.darkLevel4,
              boxShadow: "none",
              "&.Mui-disabled": {
                color: colors.darkTextTertiary,
              },
            },
          },
        },
        containedPrimary: {
          background: globalButtonBackground,
        },
        containedSecondary: {
          background: isDark ? theme.colors.darkLevel4 : "#EFEFFF",
          color: isDark ? theme.colors.darkTextSecondary : theme.colors.primaryMain,
        },
      },
    },
    MuiPaper: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          backgroundImage: "none",
          backgroundColor: isDark ? theme.colors.darkLevel1 : theme.colors.paper,
        },
        rounded: {
          borderRadius: "8px",
        },
      },
    },
    MuiCardHeader: {
      styleOverrides: {
        root: {
          color: theme.colors.textDark,
          padding: "24px",
        },
        title: {
          fontSize: "1.125rem",
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: "24px",
          [MuiTheme.breakpoints.down("sm")]: {
            padding: "12px",
            paddingBottom: "12px!important",
          },
        },
      },
    },
    MuiCardActions: {
      styleOverrides: {
        root: {
          padding: "24px",
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          alignItems: "center",
        },
        outlined: {
          border: "1px dashed",
        },
      },
    },
    MuiButtonBase: {
      styleOverrides: {
        root: {
          "&.radius-12": {
            borderRadius: "12px",
          },
          "&.MuiListItem-root": {
            color: theme.textSecondary,
            paddingTop: "10px",
            paddingBottom: "10px",
            backgroundColor: theme.menuBackground,
            "&.Mui-selected": {
              color: theme.textPrimary,
              backgroundColor: menuHoverBackground,
              "&:hover": {
                backgroundColor: menuHoverBackground,
              },
              "& .MuiListItemIcon-root": {
                color: theme.textPrimary,
              },
            },
            "&:hover": {
              backgroundColor: menuHoverBackground,
              color: theme.textPrimary,
              "& .MuiListItemIcon-root": {
                color: theme.textPrimary,
              },
            },
          },

          // sidebar menu
          "&.MuiListItem-root&.sidebar": {
            color: theme.textPrimary,
            paddingTop: "10px",
            paddingBottom: "10px",
            marginBottom: "5px",
            paddingLeft: "0px",
            "&:last-child": {
              marginBottom: 0,
            },
            "& .MuiSvgIcon-root": {
              color: "#8492C4",
            },
            "&.Mui-selected, &:hover": {
              color: theme.menuSelected,
              background: globalButtonBackground,
              "& .MuiListItemIcon-root": {
                color: theme.menuSelected,
              },
              "& .MuiSvgIcon-root": {
                color: theme.menuSelected,
              },
            },
          },
          "&.MuiListItem-root&.sub": {
            color: theme.textPrimary,
            paddingTop: "7px",
            paddingBottom: "7px",
            paddingLeft: "0px",
            background: "transparent",
            "& .MuiSvgIcon-root": {
              color: "#8492C4",
            },
            "&.Mui-selected, &:hover": {
              color: theme.menuSelected,
              background: "transparent",
              "& .MuiListItemIcon-root": {
                color: theme.menuSelected,
              },
              "& .MuiSvgIcon-root": {
                color: theme.colors.darkSecondaryMain,
              },
            },
          },
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          color: theme.textPrimary,
          minWidth: "36px",
        },
      },
    },
    MuiListItemText: {
      styleOverrides: {
        primary: {
          color: theme.textDark,
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        input: {
          color: theme.textDark,
          "&::placeholder": {
            color: theme.textSecondary,
            fontSize: "0.875rem",
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          background: theme.customization.outlinedFilled
            ? isDark
              ? theme.colors.darkBackground
              : theme.colors.grey50
            : "transparent",
          borderRadius: "8px",
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor:
              theme.customization.navType === "dark" ? theme.colors.textPrimary + 28 : theme.colors.lightGray200,
          },
          "&:hover $notchedOutline": {
            borderColor: theme.colors.primaryLight,
          },
          "&.MuiInputBase-multiline": {
            padding: 1,
          },
        },
        input: {
          fontWeight: 500,
          background: theme.customization.outlinedFilled
            ? isDark
              ? theme.colors.darkBackground
              : theme.colors.grey50
            : "transparent",
          padding: "15.5px 14px",
          borderRadius: "8px",
          "&.MuiInputBase-inputSizeSmall": {
            padding: "10px 14px",
            "&.MuiInputBase-inputAdornedStart": {
              paddingLeft: 0,
            },
          },
        },
        inputAdornedStart: {
          paddingLeft: 4,
        },
        notchedOutline: {
          borderRadius: "8px",
        },
      },
    },
    MuiSlider: {
      styleOverrides: {
        root: {
          "&.Mui-disabled": {
            color: isDark ? theme.colors.textPrimary + 50 : theme.colors.grey300,
          },
        },
        mark: {
          backgroundColor: theme.paper,
          width: "4px",
        },
        valueLabel: {
          color: theme.colors.primaryMain,
        },
      },
    },
    MuiAutocomplete: {
      styleOverrides: {
        root: {
          "& .MuiAutocomplete-tag": {
            background: isDark ? theme.colors.textPrimary + 20 : theme.colors.secondaryLight,
            borderRadius: 4,
            color: theme.textDark,
            ".MuiChip-deleteIcon": {
              color: isDark ? theme.colors.textPrimary + 80 : theme.colors.secondary200,
            },
          },
        },
        popper: {
          borderRadius: "8px",
          boxShadow:
            "0px 8px 10px -5px rgb(0 0 0 / 20%), 0px 16px 24px 2px rgb(0 0 0 / 14%), 0px 6px 30px 5px rgb(0 0 0 / 12%)",
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: theme.divider,
          opacity: isDark ? 0.2 : 1,
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        select: {
          "&:focus": {
            backgroundColor: "transparent",
          },
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        select: {
          fontSize: "28px",
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          color: isDark ? theme.colors.darkLevel1 : theme.colors.primaryDark,
          background: isDark ? theme.textPrimary : theme.colors.primary200,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          "&.MuiChip-deletable .MuiChip-deleteIcon": {
            color: "inherit",
          },
        },
      },
    },
    MuiTimelineContent: {
      styleOverrides: {
        root: {
          color: theme.textDark,
          fontSize: "16px",
        },
      },
    },
    MuiTreeItem: {
      styleOverrides: {
        label: {
          marginTop: 14,
          marginBottom: 14,
        },
      },
    },
    MuiTimelineDot: {
      styleOverrides: {
        root: {
          boxShadow: "none",
        },
      },
    },
    MuiInternalDateTimePickerTabs: {
      styleOverrides: {
        tabs: {
          backgroundColor: isDark ? theme.colors.darkPaper : theme.colors.primaryLight,
          "& .MuiTabs-flexContainer": {
            borderColor: isDark ? theme.colors.textPrimary + 20 : theme.colors.primary200,
          },
          "& .MuiTab-root": {
            color: isDark ? theme.colors.textSecondary : theme.colors.grey900,
          },
          "& .MuiTabs-indicator": {
            backgroundColor: theme.colors.primaryDark,
          },
          "& .Mui-selected": {
            color: theme.colors.primaryDark,
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        flexContainer: {
          borderBottom: "1px solid",
          borderColor: isDark ? theme.colors.textPrimary + 20 : theme.colors.grey200,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          padding: "12px 0 12px 0",
          backgroundColor: isDark ? theme.colors.darkLevel3 : theme.colors.primary200,
        },
      },
    },
    MuiTable: {
      styleOverrides: {
        root: {
          "& td": {
            whiteSpace: "nowrap",
          },
          "& td:first-of-type, & th:first-of-type": {
            paddingLeft: "0px",
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor: isDark ? "rgba(189, 200, 240, 0.082)" : theme.colors.grey200,
          "&.MuiTableCell-head": {
            fontSize: theme.fontSize.xs,
            color: theme.textTertiary,
            "&.MuiTableCell-stickyHeader": {
              background: theme.colors.darkLevel2,
            },
          },
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          color: isDark ? theme.colors.darkLevel1 : theme.paper,
          background: isDark ? theme.colors.grey50 : theme.colors.grey700,
        },
      },
    },
    MuiPagination: {
      styleOverrides: {
        root: {
          ".MuiPaginationItem-previousNext": {
            borderRadius: "50%",
          },
          ".MuiPaginationItem-root": {
            "&.Mui-selected": {
              backgroundColor: theme.colors.secondaryMain,
            },
          },
          ".MuiButtonBase-root": {
            minWidth: "22px",
            height: "22px",
          },
        },
        nav: {
          backgroundColor: theme.colors.primaryMain,
        },
      },
    },
    MuiTableContainer: {
      styleOverrides: {
        root: {
          position: "relative",
          "&.with-loading": {
            minHeight: "210px",
          },
        },
      },
    },
    MuiStepper: {
      styleOverrides: {
        root: {
          "& .MuiStepLabel-label": {
            color: isDark ? theme.textSecondary : theme.textPrimary,
            "&.Mui-active": {
              color: theme.textPrimary,
            },
          },
          "& .MuiStepIcon-root": {
            color: isDark ? theme.colors.darkLevel4 : "#BDBDBD",
            "&.Mui-active": {
              color: isDark ? theme.colors.darkSecondaryMain : theme.colors.lightPrimaryMain,
            },
            "&.MuiStepIcon-completed": {
              color: isDark ? theme.colors.darkSecondaryMain : "#00C853",
            },
          },
          "& .MuiStepConnector-line": {
            borderColor: isDark ? theme.colors.darkLevel4 : "#E0E0E0",
          },
        },
      },
    },
    MuiBreadcrumbs: {
      styleOverrides: {
        root: {
          "& a": {
            "&:hover": {
              textDecoration: `underline solid ${theme.textSecondary}!important`,
            },
            "& .MuiTypography-root": {
              color: theme.textSecondary,
            },
          },
          "& .MuiTypography-root": {
            color: theme.textPrimary,
          },
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        root: {
          width: "36px",
          borderRadius: "12px",
        },
      },
    },
    MuiGrid: {
      styleOverrides: {
        root: {
          "& .lightGray200": {
            ...(theme.customization.navType !== "dark" ? { backgroundColor: theme.colors.lightGray200 } : {}),
          },
          "& .lightGray50": {
            ...(theme.customization.navType !== "dark" ? { backgroundColor: theme.colors.lightGray50 } : {}),
          },
        },
      },
    },
    MuiPopover: {
      styleOverrides: {
        root: {
          "&.custom-select": {
            "& .MuiPaper-root": {
              background: theme.colors.darkLevel3,
              border: "1px solid #49588E",
              "& .MuiList-root": {
                padding: 0,
              },
              "& .MuiMenuItem-root": {
                background: theme.colors.darkLevel3,
                paddingTop: "13px",
                paddingBottom: "13px",
                "&.active": {
                  background: "#313D67",
                },
                "&:hover": {
                  background: "#313D67",
                },
              },
            },
          },
        },
      },
    },
    MuiList: {
      styleOverrides: {
        root: {
          "&.customize-menu-list": {
            padding: 0,
            background: theme.colors.darkLevel3,
            border: "1px solid #49588E",
            borderRadius: "8px",
            width: "146px",
            overflow: "hidden",
            "& .MuiMenuItem-root.MuiButtonBase-root": {
              background: theme.colors.darkLevel3,
              paddingTop: "8px",
              paddingBottom: "8px",
              "&:first-of-type": {
                borderRadius: "8px 8px 0 0",
              },
              "&:last-child": {
                borderRadius: "0 0 8px 8px",
              },
              "&.active": {
                background: "#313D67",
              },
              "&:hover": {
                background: "#313D67",
              },
            },
          },
        },
      },
    },
  };
}
