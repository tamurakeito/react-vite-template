import React, { MouseEvent, ReactNode } from "react";
import classNames from "classnames";
import {
  Bell,
  ChevronLeft,
  ChevronRight,
  Edit2,
  MoreHorizontal,
  MoreVertical,
  X,
  Copy,
  Trash2,
  Download,
} from "react-feather";
import classes from "./styles.module.scss";
import { ButtonSize, buttonSizes, Icon, iconTypes } from "tamurakeito-react-ui";

export function CircleButton({
  children,
  className,
  size = circleButtonSizes.sm,
  icon,
  disabled = false,
  variant = circleButtonVariants.primary,
  onClick,
}: {
  children?: ReactNode;
  className?: string;
  size?: CircleButtonSize;
  icon?: CircleButtonIcon;
  disabled?: boolean;
  variant?: CircleButtonVariant;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
}): JSX.Element {
  const clazz = classNames(
    className,
    classes.circleButton,
    classes[`circleButton--${size}`],
    classes[`circleButton--${variant}`],
    disabled && classes[`circleButton--${variant}--disabled`]
  );
  const Icon = icon == null ? children : getIcon(icon, size);
  return (
    <button onClick={onClick} disabled={disabled} className={clazz}>
      {Icon}
    </button>
  );
}

function getIcon(icon: CircleButtonIcon, size: CircleButtonSize): JSX.Element {
  const iconSize = size === circleButtonSizes.sm ? 14 : 18;
  if (icon === circleButtonIcons.edit) {
    return <Edit2 size={iconSize} />;
  } else if (icon === circleButtonIcons.cancel) {
    return <X size={iconSize} />;
  } else if (icon === circleButtonIcons.chevronLeft) {
    return <ChevronLeft size={iconSize} />;
  } else if (icon === circleButtonIcons.chevronRight) {
    return <ChevronRight size={iconSize} />;
  } else if (icon === circleButtonIcons.moreH) {
    return <MoreHorizontal size={iconSize} />;
  } else if (icon === circleButtonIcons.moreV) {
    return <MoreVertical size={iconSize} />;
  } else if (icon === circleButtonIcons.bell) {
    return <Bell size={iconSize} />;
  } else if (icon === circleButtonIcons.copy) {
    return <Copy size={iconSize} />;
  } else if (icon === circleButtonIcons.delete) {
    return <Trash2 size={iconSize} />;
  } else if (icon === circleButtonIcons.qr) {
    return <Icon size={iconSize} type={iconTypes.qr} />;
  } else if (icon === circleButtonIcons.download) {
    return <Download size={iconSize} />;
  }
  return <></>;
}

export type CircleButtonSize = ButtonSize;
export const circleButtonSizes = buttonSizes;
export type CircleButtonIcon =
  (typeof circleButtonIcons)[keyof typeof circleButtonIcons];
export const circleButtonIcons = {
  edit: "edit",
  cancel: "cancel",
  chevronLeft: "chevronLeft",
  chevronRight: "chevronRight",
  moreH: "moreHorizontal",
  moreV: "moreVertical",
  bell: "bell",
  copy: "copy",
  delete: "delete",
  qr: "qr",
  download: "download",
} as const;

export type CircleButtonVariant =
  (typeof circleButtonVariants)[keyof typeof circleButtonVariants];
export const circleButtonVariants = {
  primary: "primary",
  white: "white",
} as const;
